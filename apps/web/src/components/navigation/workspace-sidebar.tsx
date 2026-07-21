import { Meeting } from '@/components/core/mock-data';
import { Plus } from '@phosphor-icons/react/dist/ssr';

interface WorkspaceSidebarProps {
  meetings: Meeting[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewClick: () => void;
}

export default function WorkspaceSidebar({ meetings, activeId, onSelect, onNewClick }: WorkspaceSidebarProps) {
  return (
    <aside className="w-80 bg-forest-700 text-[#FAF9F6] flex flex-col relative z-30 h-screen shrink-0">


      <svg
        className="absolute -right-6 top-0 w-6 h-6 text-forest-700"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M0,0 L0,24 C0,10.745 10.745,0 24,0 L0,0 Z" />
      </svg>

      <div className="p-10 pb-6 pt-12">
        <h1 className="font-serif text-3xl tracking-tight mb-2">Transcripto</h1>
        <p className="font-sans text-xs text-[#FAF9F6]/50">Workspace</p>
      </div>

      <div className="px-6 mb-8">
        <button
          onClick={onNewClick}
          className="w-full flex items-center justify-center gap-2 bg-[#FAF9F6]/5 hover:bg-[#FAF9F6]/10 transition-colors py-3 rounded-2xl font-sans text-sm"
        >
          <Plus size={16} />
          <span>Import Recording</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 pb-10 space-y-2">
        {meetings.map((meeting) => {
          const isActive = meeting.id === activeId;
          return (
            <button
              key={meeting.id}
              onClick={() => onSelect(meeting.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all ${isActive ? 'bg-[#FAF9F6]/10 shadow-sm' : 'hover:bg-[#FAF9F6]/5 text-[#FAF9F6]/60'
                }`}
            >
              <h3 className={`font-serif text-lg leading-tight mb-1 ${isActive ? 'text-[#FAF9F6]' : ''}`}>
                {meeting.title}
              </h3>
              <span className="font-mono text-[10px] text-[#FAF9F6]/40 block">
                {meeting.createdAt}
              </span>
            </button>
          );
        })}
      </nav>

    </aside>
  );
}
