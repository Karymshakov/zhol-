import type { Block } from '../../types';

interface BlockHeaderProps {
  block: Block;
}

export default function BlockHeader({ block }: BlockHeaderProps) {
  return (
    <div className="bg-surface border border-border rounded-card p-5 mb-5 shadow-card flex gap-4 items-start">
      <div
        className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: block.color }}
      >
        {block.icon}
      </div>
      <div>
        <h2 className="text-[17px] font-semibold text-text-main mb-1">{block.title}</h2>
        <p className="text-[13px] text-muted leading-snug">{block.desc}</p>
        <p className="text-[11px] font-semibold text-muted mt-1">{block.count}</p>
      </div>
    </div>
  );
}
