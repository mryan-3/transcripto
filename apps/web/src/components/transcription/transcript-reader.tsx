import { Segment } from '@/components/core/mock-data';

interface TranscriptReaderProps {
  segments: Segment[];
  currentTime: number;
  onTimeClick: (seconds: number) => void;
}

export default function TranscriptReader({ segments, currentTime, onTimeClick }: TranscriptReaderProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      {segments.map((segment) => {
        const isActive = currentTime >= segment.startTime && currentTime <= segment.endTime;

        return (
          <div
            key={segment.id}
            className={`flex gap-6 px-6 py-5 rounded-2xl transition-all duration-500 ease-out ${isActive
                ? 'bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-forest-700/5 scale-[1.02] transform-gpu z-10'
                : 'opacity-40 hover:opacity-80 hover:bg-white/20'
              }`}
          >
            <button
              onClick={() => onTimeClick(segment.startTime)}
              className="font-mono text-xs text-forest-700/40 hover:text-forest-700 pt-1"
            >
              {formatTime(segment.startTime)}
            </button>
            <div className="space-y-1">
              <span className="font-sans text-xs font-semibold text-forest-700/60">
                {segment.speaker}
              </span>
              <p className="font-serif text-base text-forest-700 leading-relaxed">
                {segment.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
