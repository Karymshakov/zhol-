import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { Career } from '../types';
import { useInView } from '../hooks/useInView';

interface SimulatorPageProps {
  career: Career;
  onBack: () => void;
  onGoProfessions: () => void;
}

interface ScenarioStep {
  id: number;
  time: string;
  title: string;
  text: string;
  choices: { emoji: string; text: string; delta: Stats }[];
}

interface Stats {
  energy: number;
  stress: number;
  skills: number;
  mood: number;
}

const SCENARIOS: ScenarioStep[] = [
  {
    id: 1,
    time: '09:00 · День первый в компании',
    title: 'Первый день',
    text: 'Ты — молодой IT-разработчик. Первый день в компании. Тебе показали рабочее место и дали задание — изучить код проекта. Ты видишь тысячи строк кода. С чего начнёшь?',
    choices: [
      { emoji: '📖', text: 'Читаю документацию и комментарии в коде', delta: { energy: -5, stress: -10, skills: 15, mood: 5 } },
      { emoji: '🔍', text: 'Сразу ищу код и смотрю что происходит', delta: { energy: -10, stress: 10, skills: 10, mood: -5 } },
      { emoji: '🤝', text: 'Прошу коллегу объяснить структуру проекта', delta: { energy: 0, stress: -5, skills: 5, mood: 15 } },
    ],
  },
  {
    id: 2,
    time: '11:30 · Стендап митинг',
    title: 'Встреча с командой',
    text: 'Тим-лид проводит стендап. Твоя очередь рассказать о прогрессе, но ты ещё только разбираешься. Все смотрят на тебя.',
    choices: [
      { emoji: '🎯', text: 'Честно говорю: изучаю структуру, есть вопросы', delta: { energy: 5, stress: -15, skills: 5, mood: 10 } },
      { emoji: '💪', text: 'Говорю что всё идёт по плану, скоро результат', delta: { energy: 0, stress: 15, skills: 0, mood: -10 } },
      { emoji: '🙋', text: 'Прошу тим-лида уточнить ожидания по задаче', delta: { energy: 5, stress: -10, skills: 10, mood: 5 } },
    ],
  },
  {
    id: 3,
    time: '16:00 · Первый баг',
    title: 'Кризис: баг в коде',
    text: 'Ты написал первый код, но он падает с ошибкой. Дедлайн через час, коллеги заняты. Что делаешь?',
    choices: [
      { emoji: '🐛', text: 'Открываю дебаггер и методично ищу ошибку', delta: { energy: -15, stress: 10, skills: 20, mood: 5 } },
      { emoji: '💬', text: 'Прошу помощи у senior-разработчика рядом', delta: { energy: -5, stress: -10, skills: 15, mood: 5 } },
      { emoji: '🔄', text: 'Переписываю функцию с нуля по-другому', delta: { energy: -20, stress: 5, skills: 10, mood: -5 } },
    ],
  },
];

const GROWTH_DATA = [
  { year: 'Год 1', salary: 60, avg: 45 },
  { year: 'Год 2', salary: 85, avg: 55 },
  { year: 'Год 3', salary: 110, avg: 65 },
  { year: 'Год 4', salary: 130, avg: 72 },
  { year: 'Год 5', salary: 155, avg: 80 },
];

function CircleScore({ value, delay = 0 }: { value: number; delay?: number }) {
  const [animated, setAnimated] = useState(0);
  const r = 56;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => {
      const step = () => {
        setAnimated((prev) => {
          if (prev >= value) return value;
          return prev + 2;
        });
      };
      const iv = setInterval(step, 20);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (animated / 100) * circ}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4A7CF5" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-text-main">{animated}%</span>
      </div>
    </div>
  );
}

function StatBar({ label, value, color, icon, delay = 0 }: {
  label: string; value: number; color: string; icon: string; delay?: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay + 300);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
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

export default function SimulatorPage({ career, onBack, onGoProfessions }: SimulatorPageProps) {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({ energy: 80, stress: 20, skills: 30, mood: 70 });
  const [done, setDone] = useState(false);
  const completionRef = useInView();

  const scenario = SCENARIOS[step];
  const totalSteps = SCENARIOS.length;
  const progress = ((step + (chosen !== null ? 1 : 0)) / totalSteps) * 100;

  const careerName = career.name.split('/')[0].trim();
  const finalScore = Math.round((stats.energy + (100 - stats.stress) + stats.skills + stats.mood) / 4);

  const handleChoice = (idx: number) => {
    if (chosen !== null) return;
    setChosen(idx);
    const d = scenario.choices[idx].delta;
    setStats((s) => ({
      energy: Math.max(0, Math.min(100, s.energy + d.energy)),
      stress: Math.max(0, Math.min(100, s.stress + d.stress)),
      skills: Math.max(0, Math.min(100, s.skills + d.skills)),
      mood: Math.max(0, Math.min(100, s.mood + d.mood)),
    }));
    setTimeout(() => {
      if (step < totalSteps - 1) {
        setStep((s) => s + 1);
        setChosen(null);
      } else {
        setDone(true);
      }
    }, 1400);
  };

  const StatPill = ({ label, val, icon }: { label: string; val: number; icon: string }) => {
    const color = label === 'Стресс' ? (val > 50 ? '#EF4444' : '#22C55E') : val > 60 ? '#22C55E' : '#F59E0B';
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="text-base">{icon}</div>
        <div className="text-[16px] font-bold" style={{ color }}>{val}%</div>
        <div className="text-[11px] text-muted font-medium">{label}</div>
      </div>
    );
  };

  if (done) {
    const insights = [
      'Ты управляешь энергией грамотно — ключое качество для любой профессии',
      `Ты справлялся со стрессом по-своему — это редкий и ценный навык`,
      'Ты быстро учился — за 3 задания ты вырос профессионально',
    ];

    return (
      <div className="min-h-screen bg-bg">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
          <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2">
              <span className="text-accent font-bold text-lg">Жол</span>
              <span className="text-[11px] text-muted">• Твой путь</span>
            </button>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
              <button onClick={onBack} className="hover:text-text-main transition-colors">Профиль</button>
              <button onClick={onGoProfessions} className="hover:text-text-main transition-colors">Исследование</button>
              <span className="text-accent font-semibold border-b-2 border-accent pb-0.5">Симулятор</span>
            </div>
            <button onClick={onGoProfessions} className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-dark transition-all">
              Начать путь →
            </button>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12" ref={completionRef.ref}>
          {/* Done hero */}
          <div
            className={`bg-white border border-border rounded-2xl p-8 text-center mb-6 shadow-card
              transition-all duration-700 ${completionRef.inView ? 'animate-scale-in' : 'opacity-0 scale-90'}`}
          >
            <div className="text-3xl mb-2 animate-bounce">🏁</div>
            <h1 className="text-3xl font-extrabold text-text-main mb-2">День завершён!</h1>
            <p className="text-muted text-[15px] mb-8">
              Ты прожил один рабочий день {careerName}а. Вот что мы узнали о тебе.
            </p>

            <CircleScore value={finalScore} />

            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-[14px]
              ${finalScore >= 70 ? 'bg-green-light text-green-brand' : finalScore >= 50 ? 'bg-accent-light text-accent' : 'bg-amber-light text-amber-brand'}`}>
              {finalScore >= 70 ? '🎉 Отличное совпадение!' : finalScore >= 50 ? '👍 Хорошее совпадение' : '🤔 Стоит рассмотреть другие профессии'}
            </div>

            {finalScore >= 60 && (
              <p className="text-[14px] text-muted mt-3 max-w-sm mx-auto">
                IT-профессия похоже подходит тебе — ты держал энергию, не терял концентрацию и быстро справлялся за порог стрессовой ситуации
              </p>
            )}
          </div>

          {/* Stats */}
          <div
            className={`bg-white border border-border rounded-2xl p-6 mb-6 shadow-card
              transition-all duration-700 delay-150 ${completionRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="grid grid-cols-3 gap-6 mb-6">
              <StatPill label="Энергия" val={stats.energy} icon="⚡" />
              <StatPill label="Стресс" val={stats.stress} icon="😤" />
              <StatPill label="Навыки" val={stats.skills} icon="✨" />
            </div>
            <div className="space-y-3.5">
              <StatBar label="Энергия" value={stats.energy} color="#22C55E" icon="⚡" delay={0} />
              <StatBar label="Стресс" value={stats.stress} color={stats.stress > 50 ? '#EF4444' : '#14B8A6'} icon="😤" delay={100} />
              <StatBar label="Навыки" value={stats.skills} color="#7C5CFA" icon="✨" delay={200} />
              <StatBar label="Настрой" value={stats.mood} color="#4A7CF5" icon="😊" delay={300} />
            </div>
          </div>

          {/* Career path chart */}
          <div
            className={`bg-white border border-border rounded-2xl p-6 mb-6 shadow-card
              transition-all duration-700 delay-300 ${completionRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h3 className="text-[15px] font-semibold text-text-main mb-1">Карьерный путь {careerName}а</h3>
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
                  <ReferenceLine y={80} stroke="#E2E8F0" strokeDasharray="4 4" />
                  <Line
                    type="monotone" dataKey="salary" name="Твоя зарплата"
                    stroke="#4A7CF5" strokeWidth={2.5} dot={{ fill: '#4A7CF5', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone" dataKey="avg" name="Среднее по КР"
                    stroke="#E2E8F0" strokeWidth={2} strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights */}
          <div
            className={`bg-white border border-border rounded-2xl p-6 mb-8 shadow-card
              transition-all duration-700 delay-[450ms] ${completionRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h3 className="text-[15px] font-semibold text-text-main mb-4">Инсайты о тебе</h3>
            <div className="space-y-2.5">
              {insights.map((txt, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[13px] text-muted leading-relaxed">{txt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onGoProfessions}
              className="bg-accent text-white font-semibold py-4 rounded-xl text-sm
                hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                shadow-lg shadow-accent/20"
            >
              Посмотреть мои профессии →
            </button>
            <button
              onClick={onBack}
              className="bg-bg border border-border text-muted font-semibold py-4 rounded-xl text-sm
                hover:bg-white hover:text-text-main transition-all duration-200"
            >
              Пройти тест снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border animate-slide-down">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2">
            <span className="text-accent font-bold text-lg">Жол</span>
            <span className="text-[11px] text-muted">• Твой путь</span>
          </button>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <button onClick={onBack} className="hover:text-text-main transition-colors">Профиль</button>
            <button onClick={onGoProfessions} className="hover:text-text-main transition-colors">Исследование</button>
            <span className="text-accent font-semibold border-b-2 border-accent pb-0.5">Симулятор</span>
          </div>
          <button onClick={onGoProfessions} className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-dark transition-all">
            Начать путь →
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header card */}
        <div className="bg-white border border-border rounded-2xl p-5 mb-6 shadow-card animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[17px] font-bold text-text-main">День {careerName}а</h2>
              <p className="text-[12px] text-muted">Задание {step + 1} из {totalSteps}</p>
            </div>
            <span className="text-[13px] font-bold text-accent bg-accent-light px-3 py-1 rounded-full">
              День 1/3
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-bg rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4A7CF5, #7C5CFA)' }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Энергия', val: stats.energy, icon: '⚡', color: '#22C55E' },
              { label: 'Стресс', val: stats.stress, icon: '😤', color: stats.stress > 50 ? '#EF4444' : '#14B8A6' },
              { label: 'Навыки', val: stats.skills, icon: '✨', color: '#7C5CFA' },
              { label: 'Настрой', val: stats.mood, icon: '😊', color: '#4A7CF5' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="h-1 bg-bg rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.val}%`, background: s.color }} />
                </div>
                <div className="text-[11px] font-bold" style={{ color: s.color }}>{s.val}%</div>
                <div className="text-[10px] text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scenario */}
        <div key={step} className="animate-fade-up">
          <div className="bg-white border border-border rounded-2xl p-6 mb-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-accent bg-accent-light px-2.5 py-1 rounded-full">
                {scenario.time}
              </span>
            </div>
            <p className="text-[15px] text-text-main leading-relaxed">{scenario.text}</p>
          </div>

          <div className="bg-bg rounded-2xl border border-border p-4 mb-5">
            <p className="text-[12px] font-bold text-muted uppercase tracking-wider mb-3">Твой выбор:</p>
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
                  <span className="text-xl">{c.emoji}</span>
                  <span className={`text-[14px] font-medium ${chosen === i ? 'text-white' : 'text-text-main'}`}>
                    {c.text}
                  </span>
                  {chosen === i && (
                    <svg className="ml-auto w-5 h-5 text-white" fill="none" viewBox="0 0 20 20">
                      <path d="M5 10l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {chosen !== null && step < totalSteps - 1 && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 text-green-brand bg-green-light px-4 py-2 rounded-full text-[13px] font-semibold">
                <div className="w-3 h-3 border-2 border-green-brand border-t-transparent rounded-full animate-spin" />
                Переходим к следующей ситуации...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
