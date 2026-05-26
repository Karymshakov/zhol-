export type RiasecKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface QuestionScores {
  R?: number;
  I?: number;
  A?: number;
  S?: number;
  E?: number;
  C?: number;
  autonomy?: number;
  impact?: number;
  creativity?: number;
  security?: number;
  recognition?: number;
  growth?: number;
  money?: number;
  analytical?: number;
  intuitive?: number;
  systematic?: number;
  holistic?: number;
  depth?: number;
  breadth?: number;
  people?: number;
  things?: number;
  structure?: number;
  family_influence?: number;
  finance_limit?: number;
  mobility?: number;
}

export interface ChoiceOption {
  label: string;
  text: string;
  scores: QuestionScores;
}

export interface RankOption {
  text: string;
  val: string;
}

export interface Question {
  id: string;
  type: 'likert5' | 'choice' | 'rank';
  text: string;
  scores?: QuestionScores;
  optA?: ChoiceOption;
  optB?: ChoiceOption;
  options?: RankOption[];
}

export interface Block {
  id: number;
  title: string;
  desc: string;
  count: string;
  icon: string;
  color: string;
  doneTitle: string;
  doneText: string;
  questions: Question[];
}

export interface RankSelection {
  val: string;
  rank: number;
}

export type Answers = Record<string, number | 'A' | 'B' | RankSelection[] | undefined>;

export interface ScoresMap {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
  autonomy: number;
  impact: number;
  creativity: number;
  security: number;
  recognition: number;
  growth: number;
  money: number;
  analytical: number;
  intuitive: number;
  systematic: number;
  holistic: number;
  depth: number;
  breadth: number;
  people: number;
  things: number;
  structure: number;
  family_influence: number;
  finance_limit: number;
  mobility: number;
  [key: string]: number;
}

export interface SimulatorRecord {
  id: string;
  career: string;
  score: number;
  stats: { energy: number; stress: number; skills: number; mood: number };
  insights: string[];
  completedAt: string; // ISO
}

export interface Career {
  name: string;
  riasec: RiasecKey[];
  values: string[];
  thinking: string;
  why: string;
  salary: string;
  ort: string;
  tags: string[];
  universities?: string[];
  matchScore?: number;
}
