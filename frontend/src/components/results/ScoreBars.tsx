import type { ScoresMap } from '../../types';
import { RIASEC_NAMES, RIASEC_COLORS } from '../../utils/scoring';

interface Props {
  scores: ScoresMap;
}

export default function ScoreBars({ scores }: Props) {
  const riasec = ['R', 'I', 'A', 'S', 'E', 'C'] as const;
  const maxVal = Math.max(...riasec.map((k) => scores[k])) || 1;

  return (
    <div className="flex flex-col gap-3">
      {riasec.map((key) => {
        const pct = Math.round((scores[key] / maxVal) * 100);
        return (
          <div key={key}>
            <div className="flex justify-between text-[13px] mb-1.5">
              <span className="font-medium">{RIASEC_NAMES[key]} ({key})</span>
              <span className="text-muted">{scores[key].toFixed(1)}</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: RIASEC_COLORS[key] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
