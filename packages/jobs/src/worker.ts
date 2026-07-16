import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '@transcripto/db';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'meeting-processing',
  async (job: Job) => {
    const { meetingId } = job.data;
    console.log(`[Worker] Started processing meeting ${meetingId}`);

    // Update status to PROCESSING
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { status: 'PROCESSING' },
    });

    try {
      // TODO: Phase 3 logic (FFmpeg, Whisper, Embeddings, LLM)
      // Simulate processing time for now
      await new Promise((resolve) => setTimeout(resolve, 3000));

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
