import { ChatMessage } from '@/components/core/mock-data';
import { PaperPlaneRight } from '@phosphor-icons/react/dist/ssr';

interface ChatInterfaceProps {
  chats: ChatMessage[];
  onTimeClick?: (seconds: number) => void;
}

export default function ChatInterface({ chats, onTimeClick }: ChatInterfaceProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-8 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {chats.map((chat) => (
          <div key={chat.id} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-4 ${chat.role === 'user' ? 'bg-forest-700/5 text-forest-700 rounded-2xl rounded-tr-sm shadow-sm' : 'bg-transparent text-forest-700/80'}`}>
              <p className="font-sans text-sm leading-relaxed">{chat.content}</p>
              {chat.referencedTime !== undefined && (
                <div className="mt-3">
                  <button
                    onClick={() => onTimeClick?.(chat.referencedTime!)}
                    className="font-mono text-xs text-forest-700/40 hover:text-forest-700 transition-colors focus:outline-none"
                  >
                    ↗ {formatTime(chat.referencedTime)}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 pt-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transcript..."
            className="w-full bg-forest-700/5 border border-forest-700/5 rounded-2xl py-4 pl-6 pr-14 text-sm font-sans text-forest-700 placeholder:text-forest-700/30 focus:outline-none focus:ring-1 focus:ring-forest-700/20 transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-forest-700 text-[#FAF9F6] flex items-center justify-center hover:scale-105 transition-transform focus:outline-none shadow-md">
            <PaperPlaneRight size={18} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}
