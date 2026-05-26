import type { ChoiceOption } from '../../types';
import { useT, useL } from '../../i18n/LanguageContext';

interface ChoiceCardsProps {
  optA: ChoiceOption;
  optB: ChoiceOption;
  value?: 'A' | 'B';
  onChange: (v: 'A' | 'B') => void;
}

export default function ChoiceCards({ optA, optB, value, onChange }: ChoiceCardsProps) {
  const t = useT();
  const l = useL();
  return (
    <div>
      <p className="text-xs text-muted italic mb-3">{t.chooseOneOption}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {(['A', 'B'] as const).map((side) => {
          const opt = side === 'A' ? optA : optB;
          const selected = value === side;
          return (
            <button
              key={side}
              onClick={() => onChange(side)}
              className={`p-3.5 rounded-[10px] border-[1.5px] text-left transition-all duration-150
                ${selected
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-bg text-text-main hover:border-accent hover:bg-accent-light'
                }`}
            >
              <span className={`block text-[11px] font-semibold uppercase tracking-[0.1em] mb-1.5
                ${selected ? 'text-white/70' : 'text-muted'}`}>
                {l(opt.label)}
              </span>
              <span className="text-sm leading-snug">{l(opt.text)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
