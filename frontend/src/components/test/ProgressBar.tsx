interface ProgressBarProps {
  blockIndex: number;
  totalBlocks: number;
  answeredInBlock: number;
  totalInBlock: number;
  timeLeft: number;
}

const BLOCK_LABELS = ['Интересы', 'Ценности', 'Мышление', 'Контекст'];

export default function ProgressBar({
  blockIndex, totalBlocks, answeredInBlock, totalInBlock, timeLeft,
}: ProgressBarProps) {
  const overallProgress = ((blockIndex * 12 + answeredInBlock) / 36) * 100;

  return (
    <div className="bg-surface border border-border rounded-card p-4 mb-7 shadow-card">
      <div className="flex justify-between items-center mb-2.5 text-[13px]">
        <span className="font-medium">
          Блок {blockIndex + 1} из {totalBlocks} — {BLOCK_LABELS[blockIndex]}
          {totalInBlock > 0 && (
            <span className="text-muted font-normal ml-2">
              ({answeredInBlock}/{totalInBlock})
            </span>
          )}
        </span>
        <span className="text-muted">~{timeLeft} мин осталось</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${overallProgress}%`,
            background: 'linear-gradient(90deg, #4A7CF5, #7C5CFA)',
          }}
        />
      </div>
      <div className="flex gap-2 mt-3">
        {BLOCK_LABELS.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300
              ${i < blockIndex ? 'bg-accent' : i === blockIndex ? 'bg-accent/40' : 'bg-border'}`}
          />
        ))}
      </div>
    </div>
  );
}
