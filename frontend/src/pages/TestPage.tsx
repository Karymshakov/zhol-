import { useState, useRef } from 'react';
import { blocks } from '../data/questions';
import type { Answers, RankSelection } from '../types';
import ProgressBar from '../components/test/ProgressBar';
import BlockHeader from '../components/test/BlockHeader';
import QuestionCard from '../components/test/QuestionCard';

const BLOCK_TIMES = [20, 14, 8, 4];

interface TestPageProps {
  onFinish: (answers: Answers, rankSelections: Record<string, RankSelection[]>) => void;
}

export default function TestPage({ onFinish }: TestPageProps) {
  const [blockIdx, setBlockIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [rankSelections, setRankSelections] = useState<Record<string, RankSelection[]>>({});
  const [showDone, setShowDone] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const block = blocks[blockIdx];

  const getQOffset = () =>
    blocks.slice(0, blockIdx).reduce((a, b) => a + b.questions.length, 0);

  const answeredCount = block.questions.filter((q) => {
    if (q.type === 'rank') return (rankSelections[q.id]?.length ?? 0) === 3;
    return answers[q.id] !== undefined;
  }).length;

  const allAnswered = answeredCount === block.questions.length;

  const handleAnswer = (qid: string, value: number | 'A' | 'B' | RankSelection[]) => {
    if (Array.isArray(value)) {
      setRankSelections((prev) => ({ ...prev, [qid]: value }));
      setAnswers((prev) => ({
        ...prev,
        [qid]: value.length === 3 ? value : undefined,
      }));
    } else {
      setAnswers((prev) => ({ ...prev, [qid]: value }));
    }
  };

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

  const nextBlock = () => {
    if (!allAnswered) return;
    if (blockIdx < blocks.length - 1) {
      setShowDone(true);
      setTimeout(() => {
        setShowDone(false);
        setBlockIdx((i) => i + 1);
        scrollTop();
      }, 1200);
    } else {
      onFinish(answers, rankSelections);
    }
  };

  const prevBlock = () => {
    if (blockIdx > 0) {
      setBlockIdx((i) => i - 1);
      scrollTop();
    }
  };

  return (
    <div className="min-h-screen bg-bg" ref={topRef}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold text-lg">Жол</span>
            <span className="text-[11px] text-muted font-medium bg-bg px-2 py-0.5 rounded-full">платформа</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="font-medium">Блок {blockIdx + 1}</span>
            <span>/</span>
            <span>{blocks.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-accent">{answeredCount}/{block.questions.length}</span>
            <span className="text-[13px] text-muted">ответов</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 pb-24 pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-accent-light border border-accent/20 rounded-full px-3 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-accent">Тест карьерного профиля</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-1.5">
            {block.title}
          </h1>
          <p className="text-muted text-[14px]">
            36 вопросов · 4 блока · ~{BLOCK_TIMES[blockIdx]} минут осталось
          </p>
        </div>

        <ProgressBar
          blockIndex={blockIdx}
          totalBlocks={blocks.length}
          answeredInBlock={answeredCount}
          totalInBlock={block.questions.length}
          timeLeft={BLOCK_TIMES[blockIdx]}
        />

        <BlockHeader block={block} />

        {/* Block done feedback */}
        {showDone && (
          <div className="bg-green-light border border-green-brand/20 rounded-2xl p-5 mb-5">
            <h3 className="text-base font-bold text-green-brand mb-1.5">{block.doneTitle}</h3>
            <p className="text-[14px] text-muted">{block.doneText}</p>
          </div>
        )}

        {/* Questions */}
        <div>
          {block.questions.map((q, qi) => (
            <QuestionCard
              key={q.id}
              question={q}
              number={getQOffset() + qi + 1}
              answer={answers[q.id]}
              rankSelections={rankSelections[q.id] ?? []}
              onAnswer={handleAnswer}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 items-center mt-7">
          {blockIdx > 0 && (
            <button
              onClick={prevBlock}
              className="px-5 py-3.5 border border-border rounded-xl bg-white text-muted text-sm font-medium hover:border-text-main hover:text-text-main transition-all"
            >
              ← Назад
            </button>
          )}
          <button
            onClick={nextBlock}
            disabled={!allAnswered}
            className="flex-1 py-3.5 px-7 rounded-xl bg-accent text-white text-[15px] font-semibold
              hover:bg-accent-dark transition-all disabled:bg-border disabled:text-muted disabled:cursor-not-allowed shadow-lg shadow-accent/20 disabled:shadow-none"
          >
            {blockIdx === blocks.length - 1
              ? 'Получить результат →'
              : allAnswered
                ? 'Следующий блок →'
                : `Ответь на все вопросы (${answeredCount}/${block.questions.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
