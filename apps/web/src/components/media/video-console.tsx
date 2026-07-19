import { RefObject } from 'react';

interface VideoConsoleProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  onTimeUpdate: () => void;
}

export default function VideoConsole({ videoRef, onTimeUpdate }: VideoConsoleProps) {
  return (
    <div className="w-full bg-[#1C1B19]/90 aspect-video rounded-3xl overflow-hidden relative shadow-lg">
      <video
        ref={videoRef}
        onTimeUpdate={onTimeUpdate}
        className="w-full h-full object-cover"
        controls
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />
    </div>
  );
}
