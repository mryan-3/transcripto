import { RefObject } from 'react';

interface VideoConsoleProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  onTimeUpdate: () => void;
  src?: string;
}

export default function VideoConsole({ videoRef, onTimeUpdate, src }: VideoConsoleProps) {
  const defaultVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const videoSrc = src 
    ? (src.startsWith('/') ? `http://localhost:4000${src}` : src)
    : defaultVideo;

  return (
    <div className="w-full bg-[#1C1B19]/90 aspect-video rounded-3xl overflow-hidden relative shadow-lg">
      <video
        ref={videoRef}
        onTimeUpdate={onTimeUpdate}
        className="w-full h-full object-cover"
        controls
        src={videoSrc}
      />
    </div>
  );
}
