import type { Career } from '../../types';
import { useT, useL } from '../../i18n/LanguageContext';
import { translations, type Lang } from '../../i18n/translations';
import type { I18nString } from '../../types';

interface CareerCardProps {
  career: Career;
  rank: number;
  forceLang?: Lang;
}

const rankColors = [
  'bg-accent text-white',
  'bg-purple-light text-purple-brand',
  'bg-green-light text-green-brand',
  'bg-amber-light text-amber-brand',
  'bg-bg text-muted',
];

export default function CareerCard({ career, rank, forceLang }: CareerCardProps) {
  const contextT = useT();
  const contextL = useL();
  const t = forceLang ? translations[forceLang] : contextT;
  const l = (field: I18nString) => forceLang ? (field[forceLang] ?? field.en ?? field.ru) : contextL(field);
  const matchPct = Math.max(40, Math.min(99, 95 - (rank - 1) * 12 + Math.floor(Math.random() * 5)));

  return (
    <div className="border border-border rounded-xl p-4 hover:bg-bg transition-all cursor-default">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${rankColors[rank - 1] || rankColors[4]}`}>
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-[15px] font-semibold text-text-main">{l(career.name)}</h3>
            <span className="text-[13px] font-bold text-accent flex-shrink-0">{matchPct}%</span>
          </div>
          {/* Match bar */}
          <div className="h-1.5 bg-bg rounded-full mb-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${matchPct}%` }}
            />
          </div>
          <p className="text-[12px] text-muted mb-2 leading-relaxed">{l(career.why)}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted mb-2">
            <span>💰 {l(career.salary)}</span>
            <span>📚 {t.profOrt}: {l(career.ort)}</span>
          </div>
          {career.universities && career.universities.length > 0 && (
            <div className="text-[11px] text-muted mb-2">
              🎓 {career.universities.join(' · ')}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {career.tags.map((tag) => (
              <span
                key={tag.ru}
                className="text-[10px] px-2 py-0.5 rounded-full bg-accent-light text-accent font-semibold"
              >
                {l(tag)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
