import SummaryPanel from '@/components/intelligence/summary-panel';
import ChatInterface from '@/components/intelligence/chat-interface';
import { Meeting } from '@/components/core/mock-data';

interface IntelligenceColumnProps {
  activeMeeting: Meeting;
  onTimeClick: (seconds: number) => void;
}

export default function IntelligenceColumn({ activeMeeting, onTimeClick }: IntelligenceColumnProps) {
  return (
    <div className="flex-[0.4] flex flex-col min-w-0 pt-8">
      {/* Analysis Area (35% height) */}
      <div className="flex-[0.35] overflow-hidden flex flex-col px-8 pb-4">
        <div className="pb-4">
          <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-forest-700">
            Analysis & Insights
          </h3>
        </div>
        <SummaryPanel insights={activeMeeting.insights} />
      </div>
      
      {/* Chat Area (65% height) */}
      <div className="flex-[0.65] overflow-hidden flex flex-col px-8 pt-4 pb-8">
        <div className="pt-4 pb-4">
          <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-forest-700">
            AI Assistant
          </h3>
        </div>
        <ChatInterface chats={activeMeeting.chats} onTimeClick={onTimeClick} />
      </div>
    </div>
  );
}
