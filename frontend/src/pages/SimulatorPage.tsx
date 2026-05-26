import { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Career, SimulatorRecord } from '../types';
import { useInView } from '../hooks/useInView';
import {
  getSimulatorStep, getSimulatorComplete,
  type SimulatorScenario,
} from '../utils/api';
import { useT, useL } from '../i18n/LanguageContext';

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

const TOTAL_DAYS = 7;
const STEPS_PER_DAY = 3;
const TOTAL_STEPS = TOTAL_DAYS * STEPS_PER_DAY; // 21

const DAY_EMOJIS = ['🌅', '🌤️', '☀️', '⚡', '🔥', '🎯', '🏆'];

// Фоллбэк — 3 сценария (утро / день / вечер), используются для любого из 7 дней
const FALLBACK_SCENARIOS: SimulatorScenario[] = [
  {
    time: '09:00 · Начало рабочего дня',
    text: 'Ты — молодой специалист. Руководитель ставит тебе задачу на день и спрашивает, с чего ты планируешь начать.',
    choices: [
      { emoji: '📖', text: 'Изучаю задачу подробно, составляю план действий', delta: { energy: -5, stress: -10, skills: 15, mood: 5 } },
      { emoji: '🔍', text: 'Сразу погружаюсь — разберусь по ходу работы', delta: { energy: -10, stress: 10, skills: 10, mood: -5 } },
      { emoji: '🤝', text: 'Уточняю детали у коллег перед стартом', delta: { energy: 0, stress: -5, skills: 5, mood: 15 } },
    ],
  },
  {
    time: '13:00 · Разгар рабочего дня',
    text: 'Тебя позвали на совещание. Тим-лид просит поделиться своим мнением как нового члена команды. Все смотрят на тебя.',
    choices: [
      { emoji: '🎯', text: 'Высказываю идею, которую обдумал ранее', delta: { energy: -5, stress: 15, skills: 10, mood: 10 } },
      { emoji: '👂', text: 'Внимательно слушаю и задаю уточняющие вопросы', delta: { energy: 5, stress: -10, skills: 5, mood: 5 } },
      { emoji: '📝', text: 'Обещаю подготовить предложение к завтрашнему утру', delta: { energy: 0, stress: -5, skills: 10, mood: 0 } },
    ],
  },
  {
    time: '18:00 · Конец рабочего дня',
    text: 'За 15 минут до конца дня возникла срочная проблема. Коллеги уходят, но дедлайн — завтра утром.',
    choices: [
      { emoji: '💪', text: 'Остаюсь и довожу задачу до конца сам', delta: { energy: -20, stress: 15, skills: 20, mood: -5 } },
      { emoji: '💬', text: 'Прошу коллегу помочь буквально 15 минут', delta: { energy: -5, stress: -10, skills: 15, mood: 5 } },
      { emoji: '📋', text: 'Фиксирую статус и передаю на завтра с объяснением', delta: { energy: 0, stress: -15, skills: 5, mood: 10 } },
    ],
  },
];

const GROWTH_DATA = [
  { year: 'Год 1', you: 60, avg: 45 },
  { year: 'Год 2', you: 82, avg: 55 },
  { year: 'Год 3', you: 108, avg: 65 },
  { year: 'Год 4', you: 128, avg: 72 },
  { year: 'Год 5', you: 152, avg: 80 },
];

// ─── UI Components ────────────────────────────────────────────────────────────

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
        <circle
          cx="65" cy="65" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (animated / 100) * circ}
          style={{ transition: 'stroke-dashoffset 0.03s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-text-main">{animated}%</span>
      </div>
    </div>
  );
}

function AnimatedStatBar({ label, value, color, icon, delay = 0 }: {
  label: string; value: number; color: string; icon: string; delay?: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay + 400);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-[13px] font-medium text-text-main">{label}</span>
        </div>
        <span className="text-[13px] font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-bg rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}

function LoadingScenario() {
  return (
    <div className="bg-white border border-border rounded-2xl p-8 shadow-card animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-[13px] text-muted font-medium">AI генерирует ситуацию...</span>
      </div>
      <div className="h-4 bg-bg rounded w-3/4 mb-3" />
      <div className="h-4 bg-bg rounded w-full mb-3" />
      <div className="h-4 bg-bg rounded w-5/6" />
    </div>
  );
}

// ─── Day End Screen ───────────────────────────────────────────────────────────

function DayEndScreen({
  day, totalDays, statsBefore, statsAfter, onNext, loadingNext,
}: {
  day: number;
  totalDays: number;
  statsBefore: Stats;
  statsAfter: Stats;
  onNext: () => void;
  loadingNext: boolean;
}) {
  const t = useT();
  const statItems = [
    { label: t.simEnergy, icon: '⚡', color: '#22C55E',  before: statsBefore.energy, after: statsAfter.energy },
    { label: t.simStress, icon: '😤', color: statsAfter.stress > 50 ? '#EF4444' : '#14B8A6', before: statsBefore.stress, after: statsAfter.stress },
    { label: t.simSkills, icon: '✨', color: '#7C5CFA',  before: statsBefore.skills, after: statsAfter.skills },
    { label: t.simMood,   icon: '😊', color: '#4A7CF5',  before: statsBefore.mood,   after: statsAfter.mood },
  ];

  const nextLabel = t.simDayLabels[day]?.split('·')[1]?.trim() ?? '';

  return (
    <div className="bg-white border border-border rounded-2xl p-8 shadow-card animate-scale-in text-center">
      <div className="text-5xl mb-4">{DAY_EMOJIS[day - 1]}</div>
      <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-accent mb-2">
        {t.simDay} {day} {t.simOf} {totalDays}
      </p>
      <h2 className="text-2xl font-extrabold text-text-main mb-1">{t.simDayLabels[day - 1]}</h2>
      <p className="text-muted text-sm mb-8">{t.simCompletedDesc}</p>

      {/* Stats delta grid */}
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

      {/* Week dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: totalDays }, (_, i) => (
          <div key={i} className={`rounded-full transition-all duration-300 ${
            i < day ? 'w-3 h-3 bg-accent'
            : i === day ? 'w-3 h-3 bg-accent-light border-2 border-accent'
            : 'w-2 h-2 bg-border'
          }`} />
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={loadingNext}
        className="bg-accent text-white font-bold px-10 py-4 rounded-xl
          hover:bg-accent-dark hover:scale-105 active:scale-95 transition-all
          shadow-lg shadow-accent/20 text-[16px] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loadingNext ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            {t.simDay} {day + 1}...
          </span>
        ) : (
          `${t.simDay} ${day + 1} · ${nextLabel} →`
        )}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SimulatorPage({ career, onBack, onGoProfessions, onGoHome, onComplete }: SimulatorPageProps) {
  const t = useT();
  const l = useL();
  const [currentDay, setCurrentDay]           = useState(1);
  const [stepInDay,  setStepInDay]            = useState(0);
  const [showDayEnd, setShowDayEnd]           = useState(false);
  const [statsAtDayStart, setStatsAtDayStart] = useState<Stats>({ energy: 80, stress: 20, skills: 30, mood: 70 });

  const [scenario,         setScenario]         = useState<SimulatorScenario | null>(null);
  const [loadingScenario,  setLoadingScenario]  = useState(true);
  const [chosen,           setChosen]           = useState<number | null>(null);
  const [stats,            setStats]            = useState<Stats>({ energy: 80, stress: 20, skills: 30, mood: 70 });
  const [choicesMade,      setChoicesMade]      = useState<string[]>([]);
  const [done,             setDone]             = useState(false);
  const [aiResult,         setAiResult]         = useState<{ insights: string[]; score: number } | null>(null);
  const [loadingComplete,  setLoadingComplete]  = useState(false);
  const completionRef = useInView();

  const careerName = l(career.name);

  const loadScenario = useCallback(async (
    globalStep: number,
    prevChoices: string[],
    currentStats: Stats,
  ) => {
    setLoadingScenario(true);
    setChosen(null);
    try {
      const s = await getSimulatorStep(career.name.ru, globalStep, prevChoices, currentStats, TOTAL_STEPS);
      setScenario(s);
    } catch {
      setScenario(FALLBACK_SCENARIOS[globalStep % STEPS_PER_DAY] ?? FALLBACK_SCENARIOS[0]);
    } finally {
      setLoadingScenario(false);
    }
  }, [career.name.ru]);

  useEffect(() => {
    loadScenario(0, [], stats);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Финальный AI-запрос — вызывается когда все 7 дней пройдены
  const finishSimulation = useCallback((finalStats: Stats, allChoices: string[]) => {
    const score = Math.round(
      (finalStats.energy + (100 - finalStats.stress) + finalStats.skills + finalStats.mood) / 4,
    );

    const saveRecord = (insights: string[], finalScore: number) => {
      const record: SimulatorRecord = {
        id: `sim_${Date.now()}`,
        career: career.name.ru,
        score: finalScore,
        stats: finalStats,
        insights,
        completedAt: new Date().toISOString(),
      };
      onComplete?.(record);
    };

    // Сразу показываем экран с рассчитанным счётом, потом подгружаем AI-инсайты
    setDone(true);
    setLoadingComplete(true);
    setAiResult({ score, insights: [] });

    getSimulatorComplete(career.name.ru, finalStats, allChoices)
      .then((result) => {
        const finalScore = result.score ?? score;
        const finalInsights = result.insights ?? [];
        setAiResult({ score: finalScore, insights: finalInsights });
        saveRecord(finalInsights, finalScore);
      })
      .catch(() => {
        const fallbackInsights = [
          'Ты последовательно управлял энергией на протяжении всей недели — ключевое качество для долгой карьеры.',
          'Твои решения показывают высокую адаптивность к разным типам рабочих ситуаций.',
          'В стрессовые моменты ты сохранял ясность мышления — важное профессиональное качество.',
          'Неделя показала хороший потенциал роста навыков — стоит рассматривать эту профессию серьёзно.',
        ];
        setAiResult({ score, insights: fallbackInsights });
        saveRecord(fallbackInsights, score);
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

    // Захватываем текущие значения до таймаута (избегаем stale closure)
    const snapDay  = currentDay;
    const snapStep = stepInDay;

    setTimeout(() => {
      if (snapStep < STEPS_PER_DAY - 1) {
        // Следующая ситуация в том же дне
        const nextStepInDay = snapStep + 1;
        setStepInDay(nextStepInDay);
        const globalStep = (snapDay - 1) * STEPS_PER_DAY + nextStepInDay;
        loadScenario(globalStep, newChoices, newStats);
      } else if (snapDay < TOTAL_DAYS) {
        // День завершён — показываем экран итогов
        setShowDayEnd(true);
      } else {
        // Вся неделя завершена — финал!
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
    const globalStep = (nextDay - 1) * STEPS_PER_DAY;
    await loadScenario(globalStep, choicesMade, stats);
  };

  const globalStepNum = (currentDay - 1) * STEPS_PER_DAY + stepInDay;
  const progress = ((globalStepNum + (chosen !== null ? 1 : 0)) / TOTAL_STEPS) * 100;
  const finalScore = aiResult?.score ?? Math.round(
    (stats.energy + (100 - stats.stress) + stats.skills + stats.mood) / 4,
  );

  // ─── NavBar ──────────────────────────────────────────────────────────────────
  const NavBar = () => (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border animate-slide-down">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={onGoHome} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
          <span className="text-accent font-bold text-lg">{t.brand}</span>
        </button>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
          <button onClick={onBack} className="hover:text-accent transition-colors">{t.simBackToResults}</button>
          <button onClick={onGoProfessions} className="hover:text-accent transition-colors">{t.simBtnProfessions}</button>
          <span className="text-accent font-semibold border-b-2 border-accent pb-0.5">{t.simHeaderBadge}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onGoHome}
            className="text-sm font-medium text-muted border border-border px-4 py-2 rounded-lg
              hover:border-accent hover:text-accent transition-all duration-200">
            {t.simBtnHome}
          </button>
        </div>
      </div>
    </nav>
  );

  // ─── Экран итогов дня ─────────────────────────────────────────────────────────
  if (showDayEnd) {
    return (
      <div className="min-h-screen bg-bg">
        <NavBar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <DayEndScreen
            day={currentDay}
            totalDays={TOTAL_DAYS}
            statsBefore={statsAtDayStart}
            statsAfter={stats}
            onNext={handleNextDay}
            loadingNext={loadingScenario}
          />
        </div>
      </div>
    );
  }

  // ─── Финальный экран ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-bg">
        <NavBar />
        <div className="max-w-3xl mx-auto px-6 py-12" ref={completionRef.ref}>

          <div className={`bg-white border border-border rounded-2xl p-8 text-center mb-6 shadow-card
            transition-all duration-700 ${completionRef.inView ? 'animate-scale-in' : 'opacity-0 scale-90'}`}>
            <div className="text-3xl mb-2 animate-bounce">🏆</div>
            <h1 className="text-3xl font-extrabold text-text-main mb-2">{t.simCompletedTitle}</h1>
            <p className="text-muted text-[15px] mb-8">
              {t.simCompletedDesc}: {careerName}.
            </p>
            {loadingComplete ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-12 h-12 border-4 border-accent-light border-t-accent rounded-full animate-spin" />
                <p className="text-muted text-sm">AI анализирует твои решения за неделю...</p>
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

          <div className={`bg-white border border-border rounded-2xl p-6 mb-6 shadow-card
            transition-all duration-700 delay-150 ${completionRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-[14px] font-semibold text-text-main mb-5">Параметры после недели</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
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
            <div className="space-y-3.5">
              <AnimatedStatBar label={t.simEnergy} value={stats.energy} color="#22C55E" icon="⚡" delay={0} />
              <AnimatedStatBar label={t.simStress}  value={stats.stress}  color={stats.stress > 50 ? '#EF4444' : '#14B8A6'} icon="😤" delay={100} />
              <AnimatedStatBar label={t.simSkills}  value={stats.skills}  color="#7C5CFA" icon="✨" delay={200} />
              <AnimatedStatBar label={t.simMood}    value={stats.mood}    color="#4A7CF5" icon="😊" delay={300} />
            </div>
          </div>

          <div className={`bg-white border border-border rounded-2xl p-6 mb-6 shadow-card
            transition-all duration-700 delay-300 ${completionRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-[14px] font-semibold text-text-main mb-1">Карьерный путь {careerName}а</h3>
            <p className="text-[12px] text-muted mb-5">Прогноз зарплаты (тыс. сом/мес)</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={GROWTH_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit="к" />
                  <Tooltip
                    contentStyle={{ fontFamily: 'Onest', fontSize: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}
                    formatter={(v) => [`${v} тыс. сом`, '']}
                  />
                  <Line type="monotone" dataKey="you" name="Твоя зарплата"
                    stroke="#4A7CF5" strokeWidth={2.5}
                    dot={{ fill: '#4A7CF5', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="avg" name="Среднее по КР"
                    stroke="#CBD5E1" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`bg-white border border-border rounded-2xl p-6 mb-8 shadow-card
            transition-all duration-700 delay-[450ms] ${completionRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🤖</span>
              <h3 className="text-[14px] font-semibold text-text-main">AI-инсайты по итогам недели</h3>
              <span className="text-[10px] bg-accent-light text-accent px-2 py-0.5 rounded-full font-bold ml-auto">
                Groq / LLaMA
              </span>
            </div>
            {/* Показываем скелетон пока AI грузится и инсайты ещё пустые */}
            {(loadingComplete && (!aiResult?.insights?.length)) ? (
              <div className="space-y-3">
                <p className="text-[12px] text-muted mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin inline-block" />
                  AI анализирует твои 21 решение за неделю...
                </p>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-bg rounded animate-pulse" style={{ width: `${85 - i * 8}%` }} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {(aiResult?.insights ?? []).map((txt, i) => (
                  <div key={i} className="flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
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

          <div className="grid grid-cols-2 gap-3">
            <button onClick={onGoProfessions}
              className="bg-accent text-white font-semibold py-4 rounded-xl text-sm
                hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                shadow-lg shadow-accent/20">
              {t.simBtnProfessions} →
            </button>
            <button onClick={onBack}
              className="bg-bg border border-border text-muted font-semibold py-4 rounded-xl text-sm
                hover:bg-white hover:text-text-main transition-all duration-200">
              {t.simRestartBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Основной экран игры ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg">
      <NavBar />
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header stats card */}
        <div className="bg-white border border-border rounded-2xl p-5 mb-6 shadow-card animate-fade-up">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[17px] font-bold text-text-main">
                {DAY_EMOJIS[currentDay - 1]} {t.simDayLabels[currentDay - 1]}
              </h2>
              <p className="text-[12px] text-muted mt-0.5">
                {t.simStep} {stepInDay + 1} {t.simOf} {STEPS_PER_DAY} · {careerName}
              </p>
            </div>
            <span className="text-[11px] bg-accent-light text-accent font-bold px-2.5 py-1 rounded-full">
              {t.simDay} {currentDay}/{TOTAL_DAYS}
            </span>
          </div>

          {/* Дни-точки (прогресс недели) */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: TOTAL_DAYS }, (_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                i < currentDay - 1 ? 'bg-accent'
                : i === currentDay - 1 ? 'bg-accent/40'
                : 'bg-border'
              }`} />
            ))}
          </div>

          {/* Прогресс внутри дня */}
          <div className="h-1.5 bg-bg rounded-full overflow-hidden mb-4">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4A7CF5, #7C5CFA)' }} />
          </div>

          {/* Параметры */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: t.simEnergy, val: stats.energy, icon: '⚡', color: '#22C55E' },
              { label: t.simStress, val: stats.stress,  icon: '😤', color: stats.stress > 50 ? '#EF4444' : '#14B8A6' },
              { label: t.simSkills, val: stats.skills,  icon: '✨', color: '#7C5CFA' },
              { label: t.simMood,   val: stats.mood,    icon: '😊', color: '#4A7CF5' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="h-1.5 bg-bg rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${s.val}%`, background: s.color }} />
                </div>
                <div className="text-[11px] font-bold" style={{ color: s.color }}>{s.val}%</div>
                <div className="text-[10px] text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario */}
        <div key={`${currentDay}-${stepInDay}`} className="animate-fade-up">
          {loadingScenario ? (
            <LoadingScenario />
          ) : scenario ? (
            <>
              <div className="bg-white border border-border rounded-2xl p-6 mb-5 shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-accent bg-accent-light px-2.5 py-1 rounded-full">
                    {scenario.time}
                  </span>
                  <span className="text-[10px] bg-purple-light text-purple-brand px-2 py-0.5 rounded-full font-semibold ml-auto">
                    🤖 AI-сценарий
                  </span>
                </div>
                <p className="text-[15px] text-text-main leading-relaxed">{scenario.text}</p>
              </div>

              <div className="bg-bg rounded-2xl border border-border p-4 mb-5">
                <p className="text-[12px] font-bold text-muted uppercase tracking-wider mb-3">{t.simChooseAction}:</p>
                <div className="space-y-2.5">
                  {scenario.choices.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(i)}
                      disabled={chosen !== null}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300
                        ${chosen === null
                          ? 'bg-white border-border hover:border-accent hover:bg-accent-light hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                          : chosen === i
                            ? 'bg-accent border-accent text-white scale-[1.01]'
                            : 'bg-white border-border opacity-40 cursor-not-allowed'
                        }`}
                    >
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
            </>
          ) : null}

          {chosen !== null && stepInDay < STEPS_PER_DAY - 1 && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 text-accent bg-accent-light px-4 py-2 rounded-full text-[13px] font-semibold">
                <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                AI готовит следующую ситуацию...
              </div>
            </div>
          )}

          {/* Конец дня (не последний) */}
          {chosen !== null && stepInDay === STEPS_PER_DAY - 1 && currentDay < TOTAL_DAYS && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 text-accent bg-accent-light px-4 py-2 rounded-full text-[13px] font-semibold">
                <span>{DAY_EMOJIS[currentDay - 1]}</span>
                День {currentDay} завершён — считаем итоги...
              </div>
            </div>
          )}

          {/* Конец последнего 7-го дня — переход к финалу */}
          {chosen !== null && stepInDay === STEPS_PER_DAY - 1 && currentDay === TOTAL_DAYS && (
            <div className="text-center animate-fade-in">
              <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
                <div className="text-3xl mb-3">🏆</div>
                <p className="text-[15px] font-bold text-text-main mb-1">Первая рабочая неделя завершена!</p>
                <p className="text-[13px] text-muted mb-4">Подготавливаем итоговый отчёт...</p>
                <div className="flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-accent animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
