import axios from 'axios';
import type { Answers, RankSelection, ScoresMap, Career } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE_URL, timeout: 20000 });

export interface SubmitResult {
  session_id: string;
  riasec_code: string;
  scores: ScoresMap;
  matched_careers: (Career & { match_score: number })[];
  insights: string[];
}

export interface SimulatorScenario {
  time: string;
  text: string;
  choices: {
    emoji: string;
    text: string;
    delta: { energy: number; stress: number; skills: number; mood: number };
  }[];
}

export async function submitTest(
  answers: Answers,
  rankSelections: Record<string, RankSelection[]>,
  sessionId?: string,
): Promise<SubmitResult> {
  const merged: Record<string, unknown> = { ...answers };
  Object.entries(rankSelections).forEach(([k, v]) => { merged[k] = v; });

  const { data } = await api.post<SubmitResult>('/api/submit-test', {
    answers: merged,
    session_id: sessionId,
  });
  return data;
}

export async function getAIInsights(
  scores: ScoresMap,
  riasecCode: string,
  topCareer: string,
): Promise<string[]> {
  const { data } = await api.post<{ insights: string[] }>('/api/ai/insights', {
    scores,
    riasec_code: riasecCode,
    top_career: topCareer,
  });
  return data.insights;
}

export async function getSimulatorStep(
  career: string,
  step: number,
  previousChoices: string[],
  currentStats: { energy: number; stress: number; skills: number; mood: number },
  totalSteps = 3,
): Promise<SimulatorScenario> {
  const { data } = await api.post<SimulatorScenario>('/api/ai/simulator/step', {
    career,
    step,
    total_steps: totalSteps,
    previous_choices: previousChoices,
    current_stats: currentStats,
  });
  return data;
}

export async function getSimulatorComplete(
  career: string,
  finalStats: { energy: number; stress: number; skills: number; mood: number },
  choicesMade: string[],
): Promise<{ insights: string[]; score: number }> {
  const { data } = await api.post<{ insights: string[]; score: number }>(
    '/api/ai/simulator/complete',
    { career, final_stats: finalStats, choices_made: choicesMade },
  );
  return data;
}
