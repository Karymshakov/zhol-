import { blocks } from '../data/questions';
import { careers } from '../data/careers';
import type { Answers, ScoresMap, Career, RankSelection, RiasecKey } from '../types';

const INITIAL_SCORES: ScoresMap = {
  R: 0, I: 0, A: 0, S: 0, E: 0, C: 0,
  autonomy: 0, impact: 0, creativity: 0, security: 0, recognition: 0, growth: 0, money: 0,
  analytical: 0, intuitive: 0, systematic: 0, holistic: 0,
  depth: 0, breadth: 0, people: 0, things: 0, structure: 0,
  family_influence: 0, finance_limit: 0, mobility: 0,
};

export function calcScores(answers: Answers): ScoresMap {
  const scores: ScoresMap = { ...INITIAL_SCORES };

  blocks.forEach((block) => {
    block.questions.forEach((q) => {
      const ans = answers[q.id];
      if (ans === undefined || ans === null) return;

      if (q.type === 'likert5' && typeof ans === 'number' && q.scores) {
        Object.entries(q.scores).forEach(([k, v]) => {
          scores[k] = (scores[k] ?? 0) + (ans as number) * (v as number);
        });
      } else if (q.type === 'choice' && (ans === 'A' || ans === 'B')) {
        const opt = ans === 'A' ? q.optA : q.optB;
        if (opt?.scores) {
          Object.entries(opt.scores).forEach(([k, v]) => {
            scores[k] = (scores[k] ?? 0) + (v as number);
          });
        }
      } else if (q.type === 'rank' && Array.isArray(ans)) {
        (ans as RankSelection[]).forEach((s, idx) => {
          const weight = 3 - idx;
          scores[s.val] = (scores[s.val] ?? 0) + weight;
        });
      }
    });
  });

  return scores;
}

export function getRiasecCode(scores: ScoresMap): string {
  const riasec: RiasecKey[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  return [...riasec]
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, 3)
    .join('');
}

export function getTopValues(scores: ScoresMap): Array<[string, number]> {
  return Object.entries({
    autonomy: scores.autonomy,
    impact: scores.impact,
    creativity: scores.creativity,
    security: scores.security,
    recognition: scores.recognition,
    growth: scores.growth,
    money: scores.money,
  }).sort((a, b) => b[1] - a[1]).slice(0, 3);
}

export function matchCareers(scores: ScoresMap): Career[] {
  const code = getRiasecCode(scores);
  const topValues = getTopValues(scores).map((e) => e[0]);
  const thinking = scores.analytical >= scores.intuitive ? 'analytical' : 'intuitive';

  return careers
    .map((c) => {
      let score = 0;
      c.riasec.forEach((t) => {
        if (code[0] === t) score += 3;
        if (code[1] === t) score += 2;
        if (code[2] === t) score += 1;
      });
      c.values.forEach((v) => {
        if (topValues.includes(v)) score += 2;
      });
      if (c.thinking === thinking) score += 1;
      return { ...c, matchScore: score };
    })
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    .slice(0, 5);
}

export const RIASEC_NAMES: Record<string, string> = {
  R: 'Реалист', I: 'Исследователь', A: 'Художник',
  S: 'Социальный', E: 'Предприниматель', C: 'Конвенциональный',
};

export const RIASEC_COLORS: Record<string, string> = {
  R: '#2d5a3d', I: '#1a4a7a', A: '#6b3a8c',
  S: '#1a6b6b', E: '#b5621a', C: '#c23b3b',
};

export const VALUE_LABELS: Record<string, string> = {
  autonomy: 'Автономия', impact: 'Влияние', creativity: 'Творчество',
  security: 'Стабильность', recognition: 'Признание', growth: 'Рост', money: 'Доход',
};
