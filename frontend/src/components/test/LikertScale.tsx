interface LikertScaleProps {
  value?: number;
  onChange: (v: number) => void;
}

export default function LikertScale({ value, onChange }: LikertScaleProps) {
  return (
    <div>
      <p className="text-xs text-muted italic mb-3">
        Насколько это про тебя? (1 — совсем нет, 5 — абсолютно да)
      </p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`flex-1 h-11 rounded-lg border-[1.5px] text-sm font-medium transition-all duration-150
              ${value === v
                ? 'border-accent bg-accent text-white'
                : 'border-border bg-bg text-muted hover:border-accent hover:bg-accent-light hover:text-accent'
              }`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-muted mt-1 px-0.5">
        <span>Совсем нет</span>
        <span>Абсолютно да</span>
      </div>
    </div>
  );
}
