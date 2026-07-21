import { Insight } from '@/components/core/mock-data';

interface SummaryPanelProps {
  insights: Insight[];
}

export default function SummaryPanel({ insights }: SummaryPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'ACTION_ITEM': return '→';
      case 'REQUIREMENT': return '◆';
      case 'QUESTION': return '?';
      default: return '≡';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      {insights.map((insight) => (
        <div key={insight.id} className="flex gap-4 group">
          <span className="font-mono text-sm text-forest-700/30 select-none pt-1">
            {getIcon(insight.type)}
          </span>
          <p className="font-sans text-sm text-forest-700/80 leading-relaxed group-hover:text-forest-700 transition-colors">
            {insight.content}
          </p>
        </div>
      ))}
    </div>
  );
}
