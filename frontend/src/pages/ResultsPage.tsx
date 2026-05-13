import { useMemo, useState, useEffect } from 'react';
import type { Answers, RankSelection, ScoresMap, Career } from '../types';
import {
  calcScores, matchCareers, getRiasecCode, getTopValues,
  RIASEC_NAMES, VALUE_LABELS,
} from '../utils/scoring';
import type { SubmitResult } from '../utils/api';
import { getAIInsights } from '../utils/api';
import RiasecRadar from '../components/results/RadarChart';
import CareerCard from '../components/results/CareerCard';

interface ResultsPageProps {
  answers: Answers;
  rankSelections: Record<string, RankSelection[]>;
  apiResult: SubmitResult | null;
  onRestart: () => void;
  onGoProfessions: () => void;
  onGoSimulator: (career: Career) => void;
}

const RIASEC_FULL: Record<string, { label: string; color: string; bg: string }> = {
  R: { label: 'Реалистичный', color: 'text-amber-brand', bg: 'bg-amber-light' },
  I: { label: 'Исследователь', color: 'text-purple-brand', bg: 'bg-purple-light' },
  A: { label: 'Артистический', color: 'text-coral-brand', bg: 'bg-coral-light' },
  S: { label: 'Социальный', color: 'text-teal-brand', bg: 'bg-teal-light' },
  E: { label: 'Предприимчивый', color: 'text-accent', bg: 'bg-accent-light' },
  C: { label: 'Конвенциональный', color: 'text-green-brand', bg: 'bg-green-light' },
};

export default function ResultsPage({
  answers, rankSelections, apiResult, onRestart, onGoProfessions, onGoSimulator,
}: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'careers'>('profile');

  const localScores = useMemo(() => {
    const merged: Answers = { ...answers, ...rankSelections };
    return calcScores(merged);
  }, [answers, rankSelections]);

  const scores: ScoresMap = apiResult?.scores ?? localScores;
  const code = apiResult?.riasec_code ?? getRiasecCode(scores);

  const topCareers: Career[] = useMemo(() => {
    if (apiResult?.matched_careers?.length) return apiResult.matched_careers;
    return matchCareers(scores);
  }, [apiResult, scores]);

  const topValues = useMemo(() => getTopValues(scores), [scores]);
  const isAnalytical = scores.analytical >= scores.intuitive;
  const isSystematic = scores.systematic >= scores.holistic;

  const [aiInsights, setAiInsights] = useState<string[] | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (!topCareers[0]) return;
    setLoadingInsights(true);
    getAIInsights(scores, code, topCareers[0].name)
      .then(setAiInsights)
      .catch(() => setAiInsights(null))
      .finally(() => setLoadingInsights(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const insights: string[] = aiInsights
    ?? (apiResult?.insights?.length ? apiResult.insights : buildInsights(scores));

  const riasecOrder = ['R', 'I', 'A', 'S', 'E', 'C'];
  const maxRiasec = Math.max(...riasecOrder.map((k) => scores[k] ?? 0), 1);

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold text-lg">Жол</span>
            <span className="text-[11px] text-muted font-medium bg-bg px-2 py-0.5 rounded-full">платформа</span>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-bg rounded-xl p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'profile' ? 'bg-white shadow-sm text-text-main' : 'text-muted hover:text-text-main'
              }`}
            >
              Профиль
            </button>
            <button
              onClick={() => setActiveTab('careers')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'careers' ? 'bg-white shadow-sm text-text-main' : 'text-muted hover:text-text-main'
              }`}
            >
              Профессии
            </button>
          </div>
          <button
            onClick={onRestart}
            className="text-sm font-medium text-muted hover:text-text-main transition-colors border border-border px-4 py-2 rounded-lg hover:bg-white"
          >
            ↩ Заново
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-accent to-[#7C5CFA] rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <p className="text-sm opacity-75 mb-2 font-medium">Твой карьерный профиль готов!</p>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-5xl font-extrabold tracking-widest">{code[0]}{code[1]}{code[2]}</div>
            <div className="h-12 w-px bg-white/30" />
            <div>
              <p className="text-base font-semibold opacity-90">
                {RIASEC_NAMES[code[0]]} · {RIASEC_NAMES[code[1]]} · {RIASEC_NAMES[code[2]]}
              </p>
              <p className="text-sm opacity-60 mt-0.5">RIASEC-код · Holland, 1997</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[code[0], code[1], code[2]].map((c) => {
              const info = RIASEC_FULL[c];
              return (
                <span key={c} className="bg-white/20 text-white text-[12px] font-semibold px-3 py-1 rounded-full">
                  {info?.label || RIASEC_NAMES[c]}
                </span>
              );
            })}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex md:hidden gap-1 bg-white rounded-xl p-1 mb-6 border border-border">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'profile' ? 'bg-accent text-white shadow-sm' : 'text-muted'
            }`}
          >
            Профиль
          </button>
          <button
            onClick={() => setActiveTab('careers')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'careers' ? 'bg-accent text-white shadow-sm' : 'text-muted'
            }`}
          >
            Профессии
          </button>
        </div>

        {/* Main grid */}
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left column — profile */}
          <div className={`md:col-span-2 space-y-5 ${activeTab === 'careers' ? 'hidden md:block' : ''}`}>
            {/* Radar */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
              <h3 className="text-sm font-semibold text-text-main mb-4">Профиль интересов</h3>
              <RiasecRadar scores={scores} />
            </div>

            {/* RIASEC bars */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
              <h3 className="text-sm font-semibold text-text-main mb-5">Детальный RIASEC</h3>
              <div className="space-y-3.5">
                {riasecOrder.map((k) => {
                  const val = scores[k] ?? 0;
                  const pct = Math.round((val / maxRiasec) * 100);
                  const info = RIASEC_FULL[k];
                  return (
                    <div key={k}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${info.bg} ${info.color}`}>{k}</span>
                          <span className="text-[13px] font-medium text-text-main">{info.label}</span>
                        </div>
                        <span className="text-[13px] font-bold text-muted">{pct}%</span>
                      </div>
                      <div className="h-2 bg-bg rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: k === 'R' ? '#F59E0B' : k === 'I' ? '#7C5CFA' : k === 'A' ? '#EF4444' : k === 'S' ? '#14B8A6' : k === 'E' ? '#4A7CF5' : '#22C55E',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cognitive & values */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
              <h3 className="text-sm font-semibold text-text-main mb-4">Когнитивный профиль</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Стиль мышления', val: isAnalytical ? 'Аналитический' : 'Интуитивный', icon: '🧠' },
                  { label: 'Обработка', val: isSystematic ? 'Системный' : 'Целостный', icon: '⚙️' },
                  { label: 'Главная ценность', val: VALUE_LABELS[topValues[0]?.[0]] || '—', icon: '⭐' },
                  { label: 'Вторая ценность', val: VALUE_LABELS[topValues[1]?.[0]] || '—', icon: '💎' },
                  { label: 'Ориентация', val: scores.people > scores.things ? 'С людьми' : 'С задачами', icon: '🎯' },
                  { label: 'Предпочтение', val: scores.depth > scores.breadth ? 'Глубина' : 'Широта', icon: '🔍' },
                ].map(({ label, val, icon }) => (
                  <div key={label} className="bg-bg border border-border rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base">{icon}</span>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</p>
                    </div>
                    <p className="text-[13px] font-semibold text-text-main">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — careers & insights */}
          <div className={`md:col-span-3 space-y-5 ${activeTab === 'profile' ? 'hidden md:block' : ''}`}>
            {/* Careers */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-text-main">Профессии для тебя</h3>
                <span className="text-[11px] text-muted bg-bg px-2.5 py-1 rounded-full font-medium">
                  Топ {topCareers.length}
                </span>
              </div>
              <div className="space-y-3">
                {topCareers.map((c, i) => (
                  <CareerCard key={c.name} career={c} rank={i + 1} />
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-text-main">Персональные инсайты</h3>
                {loadingInsights ? (
                  <div className="flex items-center gap-1.5 ml-auto bg-accent-light text-accent px-2.5 py-1 rounded-full">
                    <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-bold">AI думает...</span>
                  </div>
                ) : aiInsights ? (
                  <span className="ml-auto text-[10px] bg-accent-light text-accent px-2 py-0.5 rounded-full font-bold">
                    🤖 GPT-4o
                  </span>
                ) : null}
              </div>
              <div className="space-y-3">
                {loadingInsights ? (
                  [0, 1, 2].map((i) => (
                    <div key={i} className="bg-bg border border-border rounded-xl p-4 animate-pulse">
                      <div className="h-3 bg-border rounded w-4/5 mb-2" />
                      <div className="h-3 bg-border rounded w-3/5" />
                    </div>
                  ))
                ) : insights.map((txt, i) => (
                  <div
                    key={i}
                    className="bg-bg border border-border rounded-xl p-4 text-sm leading-relaxed text-text-main animate-fade-up"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="inline-block w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center mr-2 float-left mt-0.5">
                      {i + 1}
                    </span>
                    {txt}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onGoProfessions}
                className="bg-accent text-white font-semibold py-3.5 rounded-xl text-sm
                  hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                  shadow-md shadow-accent/20"
              >
                Все профессии →
              </button>
              <button
                onClick={() => topCareers[0] && onGoSimulator(topCareers[0])}
                className="bg-purple-light text-purple-brand font-semibold py-3.5 rounded-xl text-sm
                  hover:bg-purple-brand hover:text-white transition-all duration-200 border border-purple-brand/20"
              >
                🎮 Симулятор →
              </button>
            </div>
            <button
              onClick={onRestart}
              className="w-full mt-2 py-3 text-sm text-muted hover:text-text-main transition-colors"
            >
              ↩ Пройти тест заново
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildInsights(scores: ScoresMap): string[] {
  const insights: string[] = [];

  if (scores.autonomy > scores.security) {
    insights.push('Ты ценишь свободу и самостоятельность больше стабильности — тебе подойдёт среда, где есть пространство для инициативы, а не жёсткая иерархия.');
  } else {
    insights.push('Для тебя важна предсказуемость и надёжность — ты лучше раскроешься в структурированной среде с чёткими ожиданиями.');
  }

  if (scores.impact > scores.money) {
    insights.push('Тебя мотивирует смысл работы, а не только заработок — это признак, что профессии с выраженным социальным вкладом дадут тебе глубокую удовлетворённость.');
  }

  if (scores.analytical >= scores.intuitive) {
    insights.push('Твой стиль мышления аналитический — ты сильнее в работе с данными, логикой и структурой, чем с неопределёнными задачами без чётких критериев.');
  } else {
    insights.push('Твой стиль мышления интуитивный — ты хорошо видишь большую картину и справляешься с неопределённостью, что ценно в творческих и предпринимательских ролях.');
  }

  if (scores.S > scores.R && scores.S > scores.I) {
    insights.push('Ты ориентирован(а) на людей — тебе важен человеческий контакт в работе. Изолированная или исключительно техническая среда скорее всего тебя утомит.');
  }

  if (scores.family_influence > 1) {
    insights.push('Мнение семьи важно для тебя — это нормально. Результаты этого теста помогут тебе показать семье объективные данные в поддержку своего выбора.');
  }

  return insights;
}
