import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '@transcripto/db';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Helper to parse SRT file
function parseSRT(content: string) {
  const blocks = content.trim().split(/\r?\n\s*\r?\n/);
  return blocks.map((block) => {
    const lines = block.split(/\r?\n/);
    if (lines.length >= 3) {
      const id = lines[0].trim();
      const timeLine = lines[1].trim();
      const text = lines.slice(2).join(' ').trim();

      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3}) --> (\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
      if (timeMatch) {
        const startSecs = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
        const endSecs = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;

        // Basic speaker extraction
        const speakerMatch = text.match(/^\[?([^\]:]+)\]?:\s*(.+)$/);
        const speaker = speakerMatch ? speakerMatch[1].trim() : 'Speaker A';
        const cleanText = speakerMatch ? speakerMatch[2].trim() : text;

        return {
          startTime: startSecs,
          endTime: endSecs,
          speaker,
          text: cleanText
        };
      }
    }
    return null;
  }).filter(Boolean) as Array<{ startTime: number; endTime: number; speaker: string; text: string }>;
}

// Generate text embedding using OpenRouter / OpenAI
async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not defined.');
  }

  const res = await fetch(`${baseUrl}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      input: text,
      model: 'openai/text-embedding-3-small'
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding request failed: ${err}`);
  }

  const json = await res.json();
  return json.data[0].embedding;
}

// Generate Insights using LLM
async function generateInsights(transcriptText: string, meetingId: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';
  const model = process.env.OPENAI_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not defined.');
  }

  const prompt = `
You are an expert client meeting assistant. Analyze the following transcript and extract structured insights.
Specifically, extract:
1. Summary: A concise, high-level overview of decisions, concerns, and objectives.
2. Action Items: Specific tasks assigned.
3. Requirements: Software, functional, or system requirements identified.
4. Open Questions: Ambiguities or topics requiring further client feedback.

Transcript:
${transcriptText}

Respond ONLY with a valid JSON object matching this schema:
{
  "summary": "...",
  "actionItems": ["...", "..."],
  "requirements": ["...", "..."],
  "questions": ["...", "..."]
}
`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM insights request failed: ${err}`);
  }

  const json = await res.json();
  const text = json.choices[0].message.content.trim();
  const parsed = JSON.parse(text);

  const insightsData: Array<{ meetingId: string; type: 'SUMMARY' | 'ACTION_ITEM' | 'REQUIREMENT' | 'QUESTION'; content: string }> = [];

  if (parsed.summary) {
    insightsData.push({ meetingId, type: 'SUMMARY', content: parsed.summary });
  }
  if (parsed.actionItems) {
    for (const item of parsed.actionItems) {
      insightsData.push({ meetingId, type: 'ACTION_ITEM', content: item });
    }
  }
  if (parsed.requirements) {
    for (const req of parsed.requirements) {
      insightsData.push({ meetingId, type: 'REQUIREMENT', content: req });
    }
  }
  if (parsed.questions) {
    for (const q of parsed.questions) {
      insightsData.push({ meetingId, type: 'QUESTION', content: q });
    }
  }

  if (insightsData.length > 0) {
    await prisma.insight.createMany({
      data: insightsData
    });
  }
}

const worker = new Worker(
  'meeting-processing',
  async (job: Job) => {
    const { meetingId, filePath } = job.data;
    console.log(`[Worker] Started processing meeting ${meetingId}. Video: ${filePath}`);

    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`Input file not found at path: ${filePath}`);
    }

    // Update status to PROCESSING
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { status: 'PROCESSING' },
    });

    const tempDir = path.resolve(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const audioWavPath = path.join(tempDir, `${meetingId}.wav`);
    const srtFilePath = `${audioWavPath}.srt`;

    try {
      // 1. Audio Extraction via FFmpeg
      console.log(`[Worker] Extracting audio to ${audioWavPath}...`);
      await execAsync(`ffmpeg -y -i "${filePath}" -vn -ac 1 -ar 16000 -c:a pcm_s16le "${audioWavPath}"`);

      let srtContent = '';

      // 2. Transcription path strategy
      const provider = process.env.TRANSCRIPTION_PROVIDER || 'openai';
      if (provider === 'local') {
        const whisperBin = process.env.WHISPER_BIN_PATH || '/home/ryanm/Documents/projects/whisper.cpp/build/bin/whisper-cli';
        const whisperModel = process.env.WHISPER_MODEL_PATH || '/home/ryanm/Documents/projects/whisper.cpp/models/ggml-base.en.bin';

        console.log(`[Worker] transcribing locally using local whisper...`);
        // whisper-cli outputs <audioWavPath>.srt and <audioWavPath>.txt
        await execAsync(`"${whisperBin}" -m "${whisperModel}" -f "${audioWavPath}" -otxt -osrt`);

        srtContent = fs.readFileSync(srtFilePath, 'utf8');
      } else {
        console.log(`[Worker] transcribing via OpenAI Whisper API...`);
        const apiKey = process.env.OPENAI_API_KEY;
        const baseUrl = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';

        if (!apiKey) {
          throw new Error('OPENAI_API_KEY is not defined.');
        }

        const formData = new FormData();
        const fileBuffer = fs.readFileSync(audioWavPath);
        const fileBlob = new Blob([fileBuffer], { type: 'audio/wav' });
        formData.append('file', fileBlob, 'audio.wav');
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'srt');

        const apiRes = await fetch(`${baseUrl}/audio/transcriptions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          },
          body: formData
        });

        if (!apiRes.ok) {
          const errText = await apiRes.text();
          throw new Error(`OpenAI Whisper request failed: ${errText}`);
        }

        srtContent = await apiRes.text();
        fs.writeFileSync(srtFilePath, srtContent, 'utf8');
      }

      // 3. Parse segments
      console.log(`[Worker] Parsing transcript segments...`);
      const segments = parseSRT(srtContent);

      // 4. Generate Embeddings & Save Segments with pgvector
      let fullText = '';
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        fullText += `${seg.speaker}: ${seg.text}\n`;

        console.log(`[Worker] Generating embedding for segment ${i + 1}/${segments.length}...`);
        const embedding = await generateEmbedding(seg.text);
        const segmentId = `seg_${meetingId}_${i}`;
        const vectorStr = `[${embedding.join(',')}]`;

        // prisma raw insert for pgvector support
        await prisma.$executeRaw`
          INSERT INTO "TranscriptSegment" ("id", "meetingId", "startTime", "endTime", "speaker", "text", "embedding")
          VALUES (${segmentId}, ${meetingId}, ${seg.startTime}, ${seg.endTime}, ${seg.speaker}, ${seg.text}, ${vectorStr}::vector)
        `;
      }

      // 5. Generate AI Insights
      if (fullText.trim().length > 0) {
        console.log('[Worker] Extracting meeting insights...');
        await generateInsights(fullText, meetingId);
      }

      // Mark as completed
      await prisma.meeting.update({
        where: { id: meetingId },
        data: { status: 'COMPLETED' },
      });

      console.log(`[Worker] Successfully finished meeting ${meetingId}`);
    } catch (error) {
      console.error(`[Worker] Failed meeting ${meetingId}:`, error);

      await prisma.meeting.update({
        where: { id: meetingId },
        data: { status: 'FAILED' },
      });

      throw error;
    } finally {
      // Clean up temporary extracted WAV audio file
      if (fs.existsSync(audioWavPath)) {
        try {
          fs.unlinkSync(audioWavPath);
        } catch (e) {
          console.error('[Worker] Failed to delete temp WAV file:', e);
        }
      }
      // Clean up local srt file if exists
      if (fs.existsSync(srtFilePath)) {
        try {
          fs.unlinkSync(srtFilePath);
        } catch (e) {
          console.error('[Worker] Failed to delete temp SRT file:', e);
        }
      }
    }
  },
  { connection }
);

worker.on('ready', () => {
  console.log('BullMQ Worker is running and listening for jobs...');
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});
