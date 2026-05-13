import type { RankOption, RankSelection } from '../../types';

interface RankingListProps {
  options: RankOption[];
  selections: RankSelection[];
  onChange: (selections: RankSelection[]) => void;
}

const rankColors = [
  'bg-accent border-accent text-white',
  'bg-[#4a9e6e] border-[#4a9e6e] text-white',
  'bg-accent-light border-[#7bbe9a] text-accent',
];

export default function RankingList({ options, selections, onChange }: RankingListProps) {
  const handleClick = (opt: RankOption) => {
    const idx = selections.findIndex((s) => s.val === opt.val);
    if (idx >= 0) {
      onChange(selections.filter((s) => s.val !== opt.val));
    } else if (selections.length < 3) {
      onChange([...selections, { val: opt.val, rank: selections.length + 1 }]);
    }
  };

  return (
    <div>
      <p className="text-xs text-muted mb-2">
        Нажимай по очереди — 1-е место (самое важное), потом 2-е, потом 3-е
      </p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const selIdx = selections.findIndex((s) => s.val === opt.val);
          const rankNum = selIdx + 1;
          const isSelected = selIdx >= 0;

          return (
            <button
              key={opt.val}
              onClick={() => handleClick(opt)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[10px] border-[1.5px] text-sm text-left transition-all duration-150
                ${isSelected
                  ? rankColors[selIdx] || 'border-accent bg-accent-light text-accent'
                  : 'border-border bg-bg text-text-main hover:border-accent hover:bg-accent-light'
                }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
                ${isSelected
                  ? selIdx < 2 ? 'bg-white/25' : 'bg-accent-light text-accent'
                  : 'bg-border text-muted'
                }`}>
                {isSelected ? rankNum : '·'}
              </span>
              <span className="leading-snug">{opt.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
