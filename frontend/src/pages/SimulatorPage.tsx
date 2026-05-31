import { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Career, SimulatorRecord } from '../types';
import {
  getSimulatorStep, getSimulatorComplete,
  type SimulatorScenario,
} from '../utils/api';
import { translations } from '../i18n/translations';

// ─── Props & Types ────────────────────────────────────────────────────────────

interface SimulatorPageProps {
  career: Career;
  onBack: () => void;
  onGoProfessions: () => void;
  onGoHome: () => void;
  onComplete?: (record: SimulatorRecord) => void;
}

interface Stats {
  energy: number;
  stress: number;
  skills: number;
  mood: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_DAYS   = 7;
const STEPS_PER_DAY = 3;
const TOTAL_STEPS  = TOTAL_DAYS * STEPS_PER_DAY; // 21

const DAY_EMOJIS = ['🌅', '🌤️', '☀️', '⚡', '🔥', '🎯', '🏆'];
const TIME_LABELS = ['Утро', 'День', 'Вечер'];

const FALLBACK_SCENARIOS: SimulatorScenario[] = [
  {
    time: '09:00 ? Start of the workday',
    text: 'You are a young specialist starting a new workday. Your manager gives you a task and asks how you plan to approach it.',
    choices: [
      { emoji: '?', text: 'Study the task carefully and write a clear action plan', delta: { energy: -5, stress: -10, skills: 15, mood: 5 } },
      { emoji: '?', text: 'Start immediately and figure out the details while working', delta: { energy: -10, stress: 10, skills: 10, mood: -5 } },
      { emoji: '?', text: 'Ask colleagues for context before starting', delta: { energy: 0, stress: -5, skills: 5, mood: 15 } },
    ],
  },
  {
    time: '13:00 ? Midday team meeting',
    text: 'You are invited to a team meeting. The lead asks for your opinion as a new team member, and everyone is waiting for your response.',
    choices: [
      { emoji: '?', text: 'Share a prepared idea with confidence', delta: { energy: -5, stress: 15, skills: 10, mood: 10 } },
      { emoji: '?', text: 'Listen carefully and ask clarifying questions', delta: { energy: 5, stress: -10, skills: 5, mood: 5 } },
      { emoji: '?', text: 'Offer to prepare a detailed suggestion by tomorrow morning', delta: { energy: 0, stress: -5, skills: 10, mood: 0 } },
    ],
  },
  {
    time: '18:00 ? End of the workday',
    text: 'A small urgent issue appears 15 minutes before the day ends. Colleagues are leaving, but the deadline is tomorrow morning.',
    choices: [
      { emoji: '?', text: 'Stay late and finish the task yourself', delta: { energy: -20, stress: 15, skills: 20, mood: -5 } },
      { emoji: '?', text: 'Ask a colleague for a quick 15-minute review', delta: { energy: -5, stress: -10, skills: 15, mood: 5 } },
      { emoji: '?', text: 'Document the status and continue tomorrow', delta: { energy: 0, stress: -15, skills: 5, mood: 10 } },
    ],
  },
];

const GROWTH_DATA = [
  { year: 'Year 1', you: 60, avg: 45 },
  { year: 'Year 2', you: 82, avg: 55 },
  { year: 'Year 3', you: 108, avg: 65 },
  { year: 'Year 4', you: 128, avg: 72 },
  { year: 'Year 5', you: 152, avg: 80 },
];

// ─── Theme & Mentor Data ──────────────────────────────────────────────────────

const RIASEC_THEME: Record<string, { from: string; mid: string; to: string; accent: string }> = {
  R: { from: '#0f172a', mid: '#1e3a5f', to: '#1d4ed8', accent: '#60a5fa' },
  I: { from: '#1a0533', mid: '#2e1065', to: '#6d28d9', accent: '#a78bfa' },
  A: { from: '#431407', mid: '#7c2d12', to: '#c2410c', accent: '#fb923c' },
  S: { from: '#052e16', mid: '#064e3b', to: '#047857', accent: '#34d399' },
  E: { from: '#451a03', mid: '#78350f', to: '#b45309', accent: '#fbbf24' },
  C: { from: '#0f172a', mid: '#1e293b', to: '#334155', accent: '#94a3b8' },
};


// ─── Аватары и фоны ──────────────────────────────────────────────────────────
// Аватары — это уже готовые персонажи в своей форме, красить не нужно

const FEMALE_AVATAR = '/girl_romance_club.png'; // девушка-наставник
const MEDIC_AVATAR  = '/medik_girl.png';        // врач в форме

interface CareerVisual {
  avatar: string;       // персонаж-наставник
  bg?: string;          // фон сцены (если есть фото)
  accessory: string;    // emoji-бейдж профессии
  role: string;         // подпись роли под аватаром
  accentColor: string;  // цвет акцента карточки
}

const CAREER_VISUAL: Record<string, CareerVisual> = {
  'Разработчик программного обеспечения': {
    avatar: FEMALE_AVATAR, bg: '/mbank_it.png',
    accessory: '💻', role: 'Junior Dev', accentColor: '#7c3aed',
  },
  'Врач': {
    avatar: MEDIC_AVATAR,
    accessory: '🩺', role: 'Интерн', accentColor: '#059669',
  },
  'Учитель': {
    avatar: FEMALE_AVATAR, bg: '/school.png',
    accessory: '📚', role: 'Учитель', accentColor: '#2563eb',
  },
  'Психолог': {
    avatar: FEMALE_AVATAR,
    accessory: '🧠', role: 'Психолог', accentColor: '#6d28d9',
  },
  'Маркетолог': {
    avatar: FEMALE_AVATAR, bg: '/mbank_it.png',
    accessory: '📊', role: 'Маркетолог', accentColor: '#d97706',
  },
  'Финансовый аналитик': {
    avatar: FEMALE_AVATAR, bg: '/mbank_it.png',
    accessory: '💹', role: 'Аналитик', accentColor: '#059669',
  },
  'Дизайнер': {
    avatar: FEMALE_AVATAR,
    accessory: '🎨', role: 'Дизайнер', accentColor: '#e11d48',
  },
  'Бухгалтер': {
    avatar: FEMALE_AVATAR, bg: '/mbank_it.png',
    accessory: '📋', role: 'Бухгалтер', accentColor: '#475569',
  },
  'Инженер': {
    avatar: FEMALE_AVATAR,
    accessory: '🔧', role: 'Инженер', accentColor: '#0891b2',
  },
  'Социальный работник': {
    avatar: FEMALE_AVATAR,
    accessory: '🤝', role: 'Куратор', accentColor: '#16a34a',
  },
};


// ─── CircleScore ──────────────────────────────────────────────────────────────

function CircleScore({ value }: { value: number }) {
  const [animated, setAnimated] = useState(0);
  const r = 56;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    let cur = 0;
    const iv = setInterval(() => {
      cur += 2;
      setAnimated(Math.min(cur, value));
      if (cur >= value) clearInterval(iv);
    }, 20);
    return () => clearInterval(iv);
  }, [value]);

  const color = value >= 70 ? '#22C55E' : value >= 50 ? '#4A7CF5' : '#F59E0B';
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={circ - (animated / 100) * circ}
          style={{ transition: 'stroke-dashoffset 0.03s linear' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-extrabold text-text-main">{animated}%</span>
      </div>
    </div>
  );
}

// ─── AnimatedStatBar ──────────────────────────────────────────────────────────

function AnimatedStatBar({ label, value, color, icon, delay = 0 }: {
  label: string; value: number; color: string; icon: string; delay?: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay + 200);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{icon}</span>
          <span className="text-[12px] font-medium text-text-main">{label}</span>
        </div>
        <span className="text-[12px] font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Scene Card (аватар + пузырь) ────────────────────────────────────────────

function SceneCard({ career, scenario, loading }: {
  career: Career;
  scenario: SimulatorScenario | null;
  loading: boolean;
}) {
  const primaryRiasec = (career.riasec?.[0] ?? 'I') as string;
  const theme = RIASEC_THEME[primaryRiasec] ?? RIASEC_THEME.I;
  const visual = CAREER_VISUAL[career.name.ru] ?? {
    avatar: FEMALE_AVATAR, accessory: '??',
    role: career.name.en ?? career.name.ru, accentColor: theme.accent,
  };
  const name = 'AI Mentor';
  const role = career.name.en ?? visual.role;

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xl mb-4"
      style={{ minHeight: 280 }}
    >
      {/* ── Фон: картинка или градиент ── */}
      {visual.bg ? (
        <>
          <img src={visual.bg} alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover" />
          {/* тёмный оверлей для читаемости */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(150deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.25) 100%)' }} />
        </>
      ) : (
        <>
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(150deg, ${theme.from} 0%, ${theme.mid} 50%, ${theme.to} 100%)` }} />
          {/* точечный паттерн */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </>
      )}

      {/* Бейдж времени */}
      {scenario && !loading && (
        <div className="absolute top-4 left-4 z-10">
          <span className="text-white text-[11px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.25)', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
            {scenario.time}
          </span>
        </div>
      )}
      <div className="absolute top-4 right-4 z-10">
        <span className="text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.25)' }}>
          🤖 AI
        </span>
      </div>

      {/* ── Контент: аватар + пузырь ── */}
      <div className="relative flex items-end gap-4 px-5 pt-14 pb-5 z-10">

        {/* Аватар */}
        <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 148 }}>
          <div className="relative">
            <div className="absolute inset-0 blur-2xl opacity-35 scale-110 rounded-full"
              style={{ background: visual.accentColor }} />
            <img
              src={visual.avatar}
              alt={name}
              className="relative object-contain"
              style={{ width: 148, height: 210, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.7))' }}
            />
            {/* Аксессуар */}
            <div className="absolute bottom-2 right-0 flex items-center justify-center rounded-full text-xl border-2 border-white shadow-lg"
              style={{ width: 40, height: 40, background: visual.accentColor }}>
              {visual.accessory}
            </div>
          </div>

          {/* Тень-пол */}
          <div className="w-20 h-2.5 rounded-full blur-md -mt-1"
            style={{ background: 'rgba(0,0,0,0.5)' }} />

          {/* Имя + роль — чёткий тёмный блок */}
          <div className="mt-2 text-center">
            <div className="text-[12px] font-bold px-3 py-1 rounded-lg"
              style={{ color: '#fff', background: 'rgba(0,0,0,0.75)', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>
              {name}
            </div>
            <div className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-lg"
              style={{ color: '#fff', background: visual.accentColor, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {role}
            </div>
          </div>
        </div>

        {/* ── Пузырь речи — полностью белый, непрозрачный ── */}
        <div className="flex-1 min-w-0 relative pb-2">
          {/* Стрелка */}
          <div className="absolute left-0 top-6 -translate-x-[11px]"
            style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '12px solid white' }} />

          <div className="rounded-2xl rounded-tl-sm shadow-2xl overflow-hidden"
            style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)' }}>

            {/* Шапка пузыря с именем */}
            <div className="px-4 py-2 flex items-center gap-2"
              style={{ background: visual.accentColor }}>
              <div className="w-2 h-2 rounded-full bg-white/70" />
              <span className="text-white text-[12px] font-bold">{name}</span>
              <span className="text-white/80 text-[11px] ml-auto">{role}</span>
            </div>

            {/* Текст сценария */}
            <div className="px-4 py-3">
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <p className="text-[11px] text-gray-400 pt-1 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
                    AI генерирует сценарий...
                  </p>
                </div>
              ) : (
                <p className="text-gray-800 text-[13px] leading-relaxed font-medium">
                  {scenario?.text ?? ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DayEndScreen ─────────────────────────────────────────────────────────────

function DayEndScreen({ day, totalDays, statsBefore, statsAfter, onNext, loadingNext }: {
  day: number; totalDays: number; statsBefore: Stats; statsAfter: Stats;
  onNext: () => void; loadingNext: boolean;
}) {
  const t = translations.en;
  const statItems = [
    { label: t.simEnergy, icon: '⚡', color: '#22C55E',  before: statsBefore.energy, after: statsAfter.energy },
    { label: t.simStress, icon: '😤', color: statsAfter.stress > 50 ? '#EF4444' : '#14B8A6', before: statsBefore.stress, after: statsAfter.stress },
    { label: t.simSkills, icon: '✨', color: '#7C5CFA',  before: statsBefore.skills, after: statsAfter.skills },
    { label: t.simMood,   icon: '😊', color: '#4A7CF5',  before: statsBefore.mood,   after: statsAfter.mood },
  ];
  const nextLabel = t.simDayLabels[day]?.split('\u00b7')[1]?.trim() ?? '';

  return (
    <div className="bg-white border border-border rounded-2xl p-8 shadow-card animate-scale-in text-center">
      <div className="text-5xl mb-3">{DAY_EMOJIS[day - 1]}</div>
      <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-accent mb-1">
        {t.simDay} {day} {t.simOf} {totalDays}
      </p>
      <h2 className="text-2xl font-extrabold text-text-main mb-1">{t.simDayLabels[day - 1]}</h2>
      <p className="text-muted text-sm mb-8">{t.simCompletedDesc}</p>
      <div className="grid grid-cols-4 gap-3 mb-8">
        {statItems.map((s) => {
          const diff = s.after - s.before;
          return (
            <div key={s.label} className="bg-bg rounded-xl p-3">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-lg font-bold" style={{ color: s.color }}>{s.after}%</div>
              <div className={`text-[11px] font-bold ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-muted'}`}>
                {diff > 0 ? `+${diff}` : diff === 0 ? '±0' : diff}
              </div>
              <div className="text-[10px] text-muted mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: totalDays }, (_, i) => (
          <div key={i} className={`rounded-full transition-all duration-300 ${
            i < day ? 'w-3 h-3 bg-accent'
            : i === day ? 'w-3 h-3 bg-accent-light border-2 border-accent'
            : 'w-2 h-2 bg-border'}`} />
        ))}
      </div>
      <button onClick={onNext} disabled={loadingNext}
        className="bg-accent text-white font-bold px-10 py-4 rounded-xl
          hover:bg-accent-dark hover:scale-105 active:scale-95 transition-all
          shadow-lg shadow-accent/20 text-[16px] disabled:opacity-60">
        {loadingNext ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            {t.simDay} {day + 1}...
          </span>
        ) : `${t.simDay} ${day + 1} · ${nextLabel} →`}
      </button>
    </div>
  );
}

// ─── Done Screen ──────────────────────────────────────────────────────────────

function DoneScreen({ stats, aiResult, loadingComplete, careerName, onGoProfessions, onBack }: {
  stats: Stats;
  aiResult: { insights: string[]; score: number } | null;
  loadingComplete: boolean;
  careerName: string;
  onGoProfessions: () => void;
  onBack: () => void;
}) {
  const t = translations.en;
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const finalScore = aiResult?.score ?? Math.round(
    (stats.energy + (100 - stats.stress) + stats.skills + stats.mood) / 4,
  );

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Score card */}
        <div className={`bg-white border border-border rounded-2xl p-8 text-center mb-6 shadow-card
          transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="text-4xl mb-3 animate-bounce">🏆</div>
          <h1 className="text-2xl font-extrabold text-text-main mb-1">{t.simCompletedTitle}</h1>
          <p className="text-muted text-sm mb-6">{t.simCompletedDesc}: {careerName}</p>
          {loadingComplete && !(aiResult?.score) ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-10 h-10 border-4 border-accent-light border-t-accent rounded-full animate-spin" />
              <p className="text-muted text-sm">AI анализирует твою неделю...</p>
            </div>
          ) : (
            <>
              <CircleScore value={finalScore} />
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-[14px]
                ${finalScore >= 70 ? 'bg-green-light text-green-brand'
                  : finalScore >= 50 ? 'bg-accent-light text-accent'
                  : 'bg-amber-light text-amber-brand'}`}>
                {finalScore >= 70 ? `🎉 ${t.simFitGood}`
                  : finalScore >= 50 ? `👍 ${t.simFitOk}`
                  : `🤔 ${t.simFitBad}`}
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className={`bg-white border border-border rounded-2xl p-6 mb-6 shadow-card
          transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-[14px] font-semibold text-text-main mb-5">Параметры после недели</h3>
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              { label: t.simEnergy, val: stats.energy, icon: '⚡', color: '#22C55E' },
              { label: t.simStress, val: stats.stress,  icon: '😤', color: stats.stress > 50 ? '#EF4444' : '#14B8A6' },
              { label: t.simSkills, val: stats.skills,  icon: '✨', color: '#7C5CFA' },
              { label: t.simMood,   val: stats.mood,    icon: '😊', color: '#4A7CF5' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold" style={{ color: s.color }}>{s.val}%</div>
                <div className="text-[11px] text-muted font-medium">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <AnimatedStatBar label={t.simEnergy} value={stats.energy} color="#22C55E" icon="⚡" delay={0} />
            <AnimatedStatBar label={t.simStress}  value={stats.stress}  color={stats.stress > 50 ? '#EF4444' : '#14B8A6'} icon="😤" delay={100} />
            <AnimatedStatBar label={t.simSkills}  value={stats.skills}  color="#7C5CFA" icon="✨" delay={200} />
            <AnimatedStatBar label={t.simMood}    value={stats.mood}    color="#4A7CF5" icon="😊" delay={300} />
          </div>
        </div>

        {/* Career growth chart */}
        <div className={`bg-white border border-border rounded-2xl p-6 mb-6 shadow-card
          transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-[14px] font-semibold text-text-main mb-1">Карьерный рост: {careerName}</h3>
          <p className="text-[12px] text-muted mb-5">Прогноз зарплаты (тыс. сом/мес)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit="к" />
                <Tooltip contentStyle={{ fontFamily: 'Onest', fontSize: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}
                  formatter={(v) => [`${v} тыс. сом`, '']} />
                <Line type="monotone" dataKey="you" name="Твоя зарплата"
                  stroke="#4A7CF5" strokeWidth={2.5} dot={{ fill: '#4A7CF5', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="avg" name="Среднее по КР"
                  stroke="#CBD5E1" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className={`bg-white border border-border rounded-2xl p-6 mb-8 shadow-card
          transition-all duration-700 delay-[450ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🤖</span>
            <h3 className="text-[14px] font-semibold text-text-main">AI-инсайты по итогам недели</h3>
            <span className="text-[10px] bg-accent-light text-accent px-2 py-0.5 rounded-full font-bold ml-auto">
              Персонально для тебя
            </span>
          </div>

          {loadingComplete && !aiResult?.insights?.length ? (
            <div className="space-y-3">
              <p className="text-[12px] text-muted mb-2 flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin inline-block" />
                Анализируем твои решения за неделю...
              </p>
              {[0,1,2,3].map(i => (
                <div key={i} className="h-4 bg-bg rounded animate-pulse" style={{ width: `${85 - i*8}%` }} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(aiResult?.insights ?? []).map((txt, i) => (
                <div key={i} className="flex items-start gap-3" style={{ animation: `fadeUp 0.4s ease both`, animationDelay: `${i*80}ms` }}>
                  <div className="w-5 h-5 rounded-full bg-green-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[13px] text-muted leading-relaxed">{txt}</p>
                </div>
              ))}
              {loadingComplete && (
                <div className="flex items-center gap-2 text-muted text-[12px] pt-1">
                  <span className="w-3 h-3 border-2 border-muted border-t-transparent rounded-full animate-spin" />
                  Загружаем персональные инсайты...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onGoProfessions}
            className="bg-accent text-white font-semibold py-4 rounded-xl text-sm
              hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/20">
            {t.simBtnProfessions} →
          </button>
          <button onClick={onBack}
            className="bg-bg border border-border text-muted font-semibold py-4 rounded-xl text-sm
              hover:bg-white hover:text-text-main transition-all">
            {t.simRestartBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SimulatorPage({ career, onBack, onGoProfessions, onGoHome, onComplete }: SimulatorPageProps) {
  const t = translations.en;

  const [currentDay,      setCurrentDay]      = useState(1);
  const [stepInDay,       setStepInDay]       = useState(0);
  const [showDayEnd,      setShowDayEnd]      = useState(false);
  const [statsAtDayStart, setStatsAtDayStart] = useState<Stats>({ energy: 80, stress: 20, skills: 30, mood: 70 });
  const [scenario,        setScenario]        = useState<SimulatorScenario | null>(null);
  const [loadingScenario, setLoadingScenario] = useState(true);
  const [chosen,          setChosen]          = useState<number | null>(null);
  const [stats,           setStats]           = useState<Stats>({ energy: 80, stress: 20, skills: 30, mood: 70 });
  const [choicesMade,     setChoicesMade]     = useState<string[]>([]);
  const [done,            setDone]            = useState(false);
  const [aiResult,        setAiResult]        = useState<{ insights: string[]; score: number } | null>(null);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const careerName = career.name.en ?? career.name.ru;
  const tip = 'Every choice helps you understand whether this career path fits you.';

  const loadScenario = useCallback(async (
    globalStep: number,
    prevChoices: string[],
    currentStats: Stats,
  ) => {
    setLoadingScenario(true);
    setChosen(null);
    try {
      const s = await getSimulatorStep(careerName, globalStep, prevChoices, currentStats, TOTAL_STEPS, 'en');
      setScenario(s);
    } catch {
      setScenario(FALLBACK_SCENARIOS[globalStep % STEPS_PER_DAY] ?? FALLBACK_SCENARIOS[0]);
    } finally {
      setLoadingScenario(false);
    }
  }, [careerName]);

  useEffect(() => { loadScenario(0, [], stats); }, []); // eslint-disable-line

  const finishSimulation = useCallback((finalStats: Stats, allChoices: string[]) => {
    const score = Math.round(
      (finalStats.energy + (100 - finalStats.stress) + finalStats.skills + finalStats.mood) / 4,
    );
    setDone(true);
    setLoadingComplete(true);
    setAiResult({ score, insights: [] });

    getSimulatorComplete(careerName, finalStats, allChoices, 'en')
      .then((result) => {
        setAiResult({ score: result.score ?? score, insights: result.insights ?? [] });
        onComplete?.({ id: `sim_${Date.now()}`, career: career.name.ru, score: result.score ?? score, stats: finalStats, insights: result.insights ?? [], completedAt: new Date().toISOString() });
      })
      .catch(() => {
        const fallback = [
          'You managed your energy consistently, which is important for long-term career growth.',
          'Your decisions show adaptability across different workplace situations.',
          'You stayed clear-minded during stressful moments, an important professional strength.',
          'The simulation shows good growth potential, so this career is worth exploring further.',
        ];
        setAiResult({ score, insights: fallback });
        onComplete?.({ id: `sim_${Date.now()}`, career: career.name.ru, score, stats: finalStats, insights: fallback, completedAt: new Date().toISOString() });
      })
      .finally(() => setLoadingComplete(false));
  }, [career.name.ru, onComplete]);

  const handleChoice = (idx: number) => {
    if (chosen !== null || !scenario) return;
    setChosen(idx);
    const delta = scenario.choices[idx].delta;
    const newStats: Stats = {
      energy: Math.max(0, Math.min(100, stats.energy + delta.energy)),
      stress:  Math.max(0, Math.min(100, stats.stress  + delta.stress)),
      skills:  Math.max(0, Math.min(100, stats.skills  + delta.skills)),
      mood:    Math.max(0, Math.min(100, stats.mood    + delta.mood)),
    };
    setStats(newStats);
    const newChoices = [...choicesMade, scenario.choices[idx].text];
    setChoicesMade(newChoices);

    const snapDay  = currentDay;
    const snapStep = stepInDay;
    setTimeout(() => {
      if (snapStep < STEPS_PER_DAY - 1) {
        const nextStep = snapStep + 1;
        setStepInDay(nextStep);
        loadScenario((snapDay - 1) * STEPS_PER_DAY + nextStep, newChoices, newStats);
      } else if (snapDay < TOTAL_DAYS) {
        setShowDayEnd(true);
      } else {
        finishSimulation(newStats, newChoices);
      }
    }, 1200);
  };

  const handleNextDay = async () => {
    const nextDay = currentDay + 1;
    setStatsAtDayStart(stats);
    setCurrentDay(nextDay);
    setStepInDay(0);
    setShowDayEnd(false);
    await loadScenario((nextDay - 1) * STEPS_PER_DAY, choicesMade, stats);
  };

  const globalStepNum = (currentDay - 1) * STEPS_PER_DAY + stepInDay;
  const overallProgress = Math.round(((globalStepNum + (chosen !== null ? 1 : 0)) / TOTAL_STEPS) * 100);

  // ─── NavBar ──────────────────────────────────────────────────────────────────
  const NavBar = () => (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <button onClick={onGoHome} className="text-accent font-bold text-lg hover:opacity-75 transition-opacity">
          {t.brand}
        </button>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
          <button onClick={onBack} className="hover:text-accent transition-colors">{t.simBackToResults}</button>
          <button onClick={onGoProfessions} className="hover:text-accent transition-colors">{t.simBtnProfessions}</button>
          <span className="text-accent font-semibold border-b-2 border-accent pb-0.5">{t.simHeaderBadge}</span>
        </div>
        <button onClick={onGoHome}
          className="text-sm font-medium text-muted border border-border px-4 py-1.5 rounded-lg hover:border-accent hover:text-accent transition-all">
          {t.simBtnHome}
        </button>
      </div>
    </nav>
  );

  // ─── Day End ──────────────────────────────────────────────────────────────────
  if (showDayEnd) {
    return (
      <div className="min-h-screen bg-bg">
        <NavBar />
        <div className="max-w-2xl mx-auto px-6 py-12">
          <DayEndScreen day={currentDay} totalDays={TOTAL_DAYS}
            statsBefore={statsAtDayStart} statsAfter={stats}
            onNext={handleNextDay} loadingNext={loadingScenario} />
        </div>
      </div>
    );
  }

  // ─── Done ─────────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-bg">
        <NavBar />
        <DoneScreen stats={stats} aiResult={aiResult} loadingComplete={loadingComplete}
          careerName={careerName} onGoProfessions={onGoProfessions} onBack={onBack} />
      </div>
    );
  }

  // ─── Игровой экран (3 колонки) ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex gap-4 items-start">

          {/* ── Левый сайдбар ─────────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-3 w-48 flex-shrink-0">

            {/* Заголовок */}
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-3">Симулятор</p>
              <div className="space-y-1">
                {Array.from({ length: TOTAL_DAYS }, (_, i) => {
                  const dayNum  = i + 1;
                  const active  = dayNum === currentDay;
                  const done_d  = dayNum < currentDay;
                  return (
                    <div key={i}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all
                        ${active  ? 'bg-accent text-white shadow-sm'
                        : done_d  ? 'text-text-main bg-green-light/60'
                        : 'text-muted'}`}>
                      <span>{DAY_EMOJIS[i]} День {dayNum}</span>
                      {done_d  && <span className="text-green-600 text-[10px]">✓</span>}
                      {!active && !done_d && <span className="text-muted/50 text-sm">🔒</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Цель */}
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎯</span>
                <p className="text-[12px] font-bold text-text-main">Твоя цель</p>
              </div>
              <p className="text-[13px] font-semibold text-accent mb-1">{careerName}</p>
              <p className="text-[11px] text-muted leading-relaxed">
                Проживи 7 рабочих дней и узнай, твой ли это путь.
              </p>
            </div>

            {/* Совет дня */}
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <p className="text-[12px] font-bold text-text-main">Совет дня</p>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">{tip}</p>
            </div>
          </aside>

          {/* ── Основной контент ──────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Сцена с аватаром */}
            <div key={`${currentDay}-${stepInDay}`} className="animate-fade-up">
              <SceneCard career={career} scenario={scenario} loading={loadingScenario} />

              {/* Варианты выбора */}
              {!loadingScenario && scenario && (
                <div className="bg-white border border-border rounded-2xl p-4 mb-4 shadow-card">
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-3">
                    {t.simChooseAction}:
                  </p>
                  <div className="space-y-2.5">
                    {scenario.choices.map((c, i) => (
                      <button key={i} onClick={() => handleChoice(i)} disabled={chosen !== null}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300
                          ${chosen === null
                            ? 'bg-bg border-border hover:border-accent hover:bg-accent-light hover:scale-[1.01] cursor-pointer'
                            : chosen === i
                              ? 'bg-accent border-accent text-white scale-[1.01] shadow-md shadow-accent/20'
                              : 'bg-white border-border opacity-35 cursor-not-allowed'}`}>
                        <span className="text-xl flex-shrink-0">{c.emoji}</span>
                        <span className={`text-[14px] font-medium ${chosen === i ? 'text-white' : 'text-text-main'}`}>
                          {c.text}
                        </span>
                        {chosen === i && (
                          <svg className="ml-auto w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 20 20">
                            <path d="M5 10l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Статус после выбора */}
              {chosen !== null && stepInDay < STEPS_PER_DAY - 1 && (
                <div className="text-center animate-fade-in mb-4">
                  <div className="inline-flex items-center gap-2 text-accent bg-accent-light px-4 py-2 rounded-full text-[13px] font-semibold">
                    <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    AI готовит следующую ситуацию...
                  </div>
                </div>
              )}
              {chosen !== null && stepInDay === STEPS_PER_DAY - 1 && currentDay < TOTAL_DAYS && (
                <div className="text-center animate-fade-in mb-4">
                  <div className="inline-flex items-center gap-2 text-accent bg-accent-light px-4 py-2 rounded-full text-[13px] font-semibold">
                    <span>{DAY_EMOJIS[currentDay - 1]}</span>
                    День {currentDay} завершён — считаем итоги...
                  </div>
                </div>
              )}
              {chosen !== null && stepInDay === STEPS_PER_DAY - 1 && currentDay === TOTAL_DAYS && (
                <div className="text-center animate-fade-in mb-4">
                  <div className="bg-white border border-border rounded-2xl p-5 shadow-card">
                    <div className="text-3xl mb-2">🏆</div>
                    <p className="text-[15px] font-bold text-text-main mb-1">Первая рабочая неделя завершена!</p>
                    <p className="text-[13px] text-muted mb-3">Подготавливаем итоговый отчёт...</p>
                    <div className="flex justify-center gap-1.5">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-accent animate-bounce"
                          style={{ animationDelay: `${i*150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Кнопки навигации */}
            <div className="flex items-center justify-between mt-2">
              <button onClick={onBack}
                className="flex items-center gap-2 text-sm font-medium text-muted border border-border px-5 py-2.5 rounded-xl
                  hover:bg-white hover:text-text-main hover:border-border transition-all">
                ← {t.simBackToResults}
              </button>
              <button
                disabled={chosen === null || loadingScenario}
                className={`flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all
                  ${chosen !== null && !loadingScenario
                    ? 'bg-accent text-white hover:bg-accent-dark shadow-lg shadow-accent/20 hover:scale-[1.02]'
                    : 'bg-border text-muted cursor-not-allowed opacity-60'}`}>
                {loadingScenario ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Загрузка...
                  </>
                ) : chosen !== null ? 'Продолжить →' : 'Сделай выбор'}
              </button>
            </div>
          </main>

          {/* ── Правый сайдбар ────────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-3 w-56 flex-shrink-0">

            {/* Прогресс */}
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-bold text-text-main">Твой прогресс</p>
                <span className="text-[10px] bg-accent-light text-accent font-bold px-2 py-0.5 rounded-full">
                  День {currentDay} из {TOTAL_DAYS}
                </span>
              </div>
              <p className="text-[11px] text-muted mb-1.5">Общий прогресс</p>
              <div className="h-2 bg-bg rounded-full overflow-hidden mb-1">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${overallProgress}%`, background: 'linear-gradient(90deg, #4A7CF5, #7C5CFA)' }} />
              </div>
              <p className="text-right text-[11px] font-bold text-accent">{overallProgress}%</p>
            </div>

            {/* Показатели */}
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <p className="text-[12px] font-bold text-text-main mb-3">Твои показатели</p>
              <div className="space-y-3">
                <AnimatedStatBar label={t.simEnergy} value={stats.energy} color="#22C55E" icon="⚡" />
                <AnimatedStatBar label={t.simStress}  value={stats.stress}  color={stats.stress > 50 ? '#EF4444' : '#14B8A6'} icon="🧠" delay={50} />
                <AnimatedStatBar label={t.simSkills}  value={stats.skills}  color="#7C5CFA" icon="📚" delay={100} />
                <AnimatedStatBar label={t.simMood}    value={stats.mood}    color="#4A7CF5" icon="😊" delay={150} />
              </div>
            </div>

            {/* Твой путь */}
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <p className="text-[12px] font-bold text-text-main mb-3">Твой путь</p>
              <div className="space-y-1 max-h-52 overflow-hidden">
                {Array.from({ length: Math.min(TOTAL_DAYS, 5) }, (_, d) =>
                  TIME_LABELS.map((tl, s) => {
                    const gStep     = d * STEPS_PER_DAY + s;
                    const curGStep  = (currentDay - 1) * STEPS_PER_DAY + stepInDay;
                    const isDone    = gStep < curGStep;
                    const isCurrent = gStep === curGStep;
                    return (
                      <div key={`${d}-${s}`}
                        className={`flex items-center gap-2 px-2 py-1 rounded-lg text-[11px] transition-all
                          ${isCurrent ? 'bg-accent-light text-accent font-semibold'
                          : isDone    ? 'text-muted'
                          : 'text-muted/40'}`}>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0
                          ${isCurrent ? 'bg-accent'
                          : isDone    ? 'bg-green-400'
                          : 'bg-border'}`} />
                        <span>День {d + 1} – {tl}</span>
                        {!isDone && !isCurrent && <span className="ml-auto text-[10px]">🔒</span>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Награда */}
            <div className="bg-white border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏆</span>
                <p className="text-[12px] font-bold text-text-main">Твоя награда</p>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                Пройди 7 дней и получи персональный AI-анализ своей карьерной недели!
              </p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
