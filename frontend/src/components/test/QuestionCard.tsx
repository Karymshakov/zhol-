import type { Question, RankSelection } from '../../types';
import LikertScale from './LikertScale';
import ChoiceCards from './ChoiceCards';
import RankingList from './RankingList';
import { useT, useL } from '../../i18n/LanguageContext';

interface QuestionCardProps {
  question: Question;
  number: number;
  answer: number | 'A' | 'B' | RankSelection[] | undefined;
  rankSelections: RankSelection[];
  onAnswer: (qid: string, value: number | 'A' | 'B' | RankSelection[]) => void;
}

export default function QuestionCard({
  question, number, answer, rankSelections, onAnswer,
}: QuestionCardProps) {
  const t = useT();
  const l = useL();

  const isAnswered =
    question.type === 'rank'
      ? rankSelections.length === 3
      : answer !== undefined;

  return (
    <div
      className={`bg-surface border rounded-card p-6 mb-4 shadow-card transition-colors duration-200
        ${isAnswered ? 'border-accent/30 bg-accent-light/20' : 'border-border'}`}
    >
      <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em] mb-2.5">
        {t.questionLabel} {number}
      </p>
      <p className="text-base font-medium leading-relaxed mb-4">{l(question.text)}</p>

      {question.type === 'likert5' && (
        <LikertScale
          value={answer as number | undefined}
          onChange={(v) => onAnswer(question.id, v)}
        />
      )}

      {question.type === 'choice' && question.optA && question.optB && (
        <ChoiceCards
          optA={question.optA}
          optB={question.optB}
          value={answer as 'A' | 'B' | undefined}
          onChange={(v) => onAnswer(question.id, v)}
        />
      )}

      {question.type === 'rank' && question.options && (
        <RankingList
          options={question.options}
          selections={rankSelections}
          onChange={(sels) => onAnswer(question.id, sels)}
        />
      )}
    </div>
  );
}
