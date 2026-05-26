import axios from 'axios';
import type { Answers, RankSelection, ScoresMap, Career } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE_URL, timeout: 20000 });

// Токен авторизации
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zhol_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Типы ────────────────────────────────────────────────────────────────────

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

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface HistoryItem {
  session_id: string;
  riasec_code: string;
  matched_careers: string[];
  created_at: string;
}

// ─── Тест ────────────────────────────────────────────────────────────────────

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

// ─── AI ──────────────────────────────────────────────────────────────────────

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

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function register(name: string, email: string, password: string): Promise<{ access_token: string; user: AuthUser }> {
  const { data } = await api.post('/api/auth/register', { name, email, password });
  return data;
}

export async function login(email: string, password: string): Promise<{ access_token: string; user: AuthUser }> {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/api/auth/me');
  return data;
}

export async function linkSession(sessionId: string): Promise<void> {
  await api.post('/api/auth/link-session', { session_id: sessionId });
}

export async function getHistory(): Promise<HistoryItem[]> {
  const { data } = await api.get<HistoryItem[]>('/api/auth/history');
  return data;
}

export async function getProfile(sessionId: string): Promise<SubmitResult> {
  const { data } = await api.get<SubmitResult>(`/api/profile/${sessionId}`);
  return data;
}
