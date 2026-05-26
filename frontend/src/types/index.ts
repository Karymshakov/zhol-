export type RiasecKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

/** Multilingual string — holds a value for each supported language */
export type I18nString = { ru: string; en: string; ky: string };

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
  label: I18nString;
  text: I18nString;
  scores: QuestionScores;
}

export interface RankOption {
  text: I18nString;
  val: string;
}

export interface Question {
  id: string;
  type: 'likert5' | 'choice' | 'rank';
  text: I18nString;
  scores?: QuestionScores;
  optA?: ChoiceOption;
  optB?: ChoiceOption;
  options?: RankOption[];
}

export interface Block {
  id: number;
  title: I18nString;
  desc: I18nString;
  count: I18nString;
  icon: string;
  color: string;
  doneTitle: I18nString;
  doneText: I18nString;
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
  name: I18nString;
  riasec: RiasecKey[];
  values: string[];
  thinking: string;
  why: I18nString;
  salary: I18nString;
  ort: I18nString;
  tags: I18nString[];
  universities?: string[];
  matchScore?: number;
}

/** Career shape returned by the backend (uses plain Russian strings) */
export interface ApiCareer {
  name: string;
  riasec: RiasecKey[];
  values: string[];
  thinking: string;
  why: string;
  salary: string;
  ort: string;
  tags: string[];
  universities?: string[];
  match_score?: number;
  matchScore?: number;
}
