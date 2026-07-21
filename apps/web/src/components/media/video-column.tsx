import { RefObject } from 'react';
import VideoConsole from '@/components/media/video-console';
import TranscriptReader from '@/components/transcription/transcript-reader';
import { Meeting } from '@/components/core/mock-data';

interface VideoColumnProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  currentTime: number;
  onTimeUpdate: () => void;
  onTimeClick: (seconds: number) => void;
  activeMeeting: Meeting;
}

export default function VideoColumn({
  videoRef,
  currentTime,
  onTimeUpdate,
  onTimeClick,
  activeMeeting
}: VideoColumnProps) {
  return (
    <div className="flex-[0.6] flex flex-col min-w-0">
      {/* Video Area - The L-Shaped Divider */}
      <div className="shrink-0 pt-8 px-8 pb-8 border-r border-b border-forest-700/10 rounded-br-[60px]">
        <div className="max-w-4xl mx-auto w-full">
          <VideoConsole
            videoRef={videoRef}
            onTimeUpdate={onTimeUpdate}
            src={activeMeeting.audioUrl || undefined}
          />
        </div>
      </div>
      
      {/* Transcript Area */}
      <div className="flex-1 overflow-hidden flex flex-col pt-4 px-8">
        <TranscriptReader
          segments={activeMeeting.segments}
          currentTime={currentTime}
          onTimeClick={onTimeClick}
        />
      </div>
    </div>
  );
}
