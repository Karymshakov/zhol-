import { useState } from 'react';
import type { Career } from '../types';
import { useInView } from '../hooks/useInView';

interface ProfessionsPageProps {
  careers: Career[];
  onBack: () => void;
  onGoSimulator: (career: Career) => void;
}

const CAREER_ICONS: Record<string, string> = {
  'Разработчик программного обеспечения': '💻',
  'Врач / Медицинский работник': '🏥',
  'Учитель / Преподаватель': '📚',
  'Дизайнер (графический / UX)': '🎨',
  'Юрист / Правовед': '⚖️',
  'Предприниматель / Основатель бизнеса': '🚀',
  'Журналист / Медиаспециалист': '📰',
  'Экономист / Финансист': '📊',
  'Агроном / Специалист в АПК': '🌾',
  'Психолог / Консультант': '🧠',
};

const ICON_BG = ['bg-purple-light', 'bg-green-light', 'bg-amber-light', 'bg-accent-light', 'bg-teal-light'];

const TAG_COLORS: Record<string, string> = {
  'Высокий спрос': 'bg-accent-light text-accent',
  'Удалённая работа': 'bg-purple-light text-purple-brand',
  'Социальная значимость': 'bg-green-light text-green-brand',
  'Стабильность': 'bg-teal-light text-teal-brand',
  'Дефицитная профессия': 'bg-amber-light text-amber-brand',
  'Региональная мобильность': 'bg-amber-light text-amber-brand',
  'Рост зарплаты': 'bg-green-light text-green-brand',
  'Весь КР': 'bg-teal-light text-teal-brand',
  'Творческий рост': 'bg-purple-light text-purple-brand',
  'Фриланс': 'bg-accent-light text-accent',
};

const MATCH_COLORS = ['#7C5CFA', '#22C55E', '#F59E0B', '#4A7CF5', '#14B8A6'];

function CareerRow({ career, rank, matchPct, color, delay, inView, onSimulate }: {
  career: Career;
  rank: number;
  matchPct: number;
  color: string;
  delay: number;
  inView: boolean;
  onSimulate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const icon = CAREER_ICONS[career.name] || '💼';
  const iconBg = ICON_BG[(rank - 1) % ICON_BG.length];
  const firstTag = career.tags[0];
  const tagClass = TAG_COLORS[firstTag] || 'bg-bg text-muted';

  return (
    <div
      className={`bg-white border border-border rounded-2xl overflow-hidden transition-all duration-500
        hover:shadow-lg hover:border-accent/30 cursor-pointer
        ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
      style={{ transitionDelay: `${delay}ms`, transitionProperty: 'opacity, transform, box-shadow, border-color' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-4 p-5">
        {/* Rank */}
        <div className="w-10 text-center flex-shrink-0">
          <span className="text-[13px] font-bold text-muted">#{rank}</span>
        </div>

        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center text-2xl flex-shrink-0
          transition-transform duration-300 hover:scale-110`}>
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <h3 className="text-[15px] font-bold text-text-main">{career.name}</h3>
            {firstTag && (
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${tagClass}`}>
                {firstTag}
              </span>
            )}
          </div>
          <p className="text-[13px] text-muted leading-snug mb-2 line-clamp-1">{career.why}</p>
          <div className="flex items-center gap-3 text-[12px] text-muted">
            <span>💰 {career.salary}</span>
            <span className="text-green-brand font-semibold">↗ +{Math.floor(matchPct * 1.5)}% за 5 лет</span>
          </div>
        </div>

        {/* Match */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-2">
          <span className="text-[22px] font-extrabold" style={{ color }}>{matchPct}%</span>
          <div className="w-16 h-1.5 bg-bg rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: inView ? `${matchPct}%` : '0%', background: color, transitionDelay: `${delay + 300}ms` }}
            />
          </div>
          <span className="text-[10px] text-muted font-medium">совпадение</span>
        </div>

        {/* Chevron */}
        <div className={`text-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4 bg-bg animate-fade-in">
          <p className="text-[13px] text-muted leading-relaxed mb-4">{career.why}</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 border border-border">
              <p className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">Зарплата</p>
              <p className="text-[13px] font-semibold text-text-main">{career.salary}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border">
              <p className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">ОРТ предметы</p>
              <p className="text-[13px] font-semibold text-text-main">{career.ort}</p>
            </div>
          </div>
          {(career.universities ?? []).length > 0 && (
            <div className="bg-white rounded-xl p-3 border border-border mb-4">
              <p className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1.5">🎓 Вузы КР</p>
              <p className="text-[13px] text-text-main">{(career.universities ?? []).join(' · ')}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {career.tags.map((tag) => (
              <span key={tag} className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${TAG_COLORS[tag] || 'bg-bg text-muted'}`}>
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onSimulate(); }}
            className="w-full py-3 rounded-xl bg-accent text-white text-sm font-semibold
              hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
              shadow-md shadow-accent/20"
          >
            🎮 Симулировать день {career.name.split('/')[0].trim()} →
          </button>
        </div>
      )}
    </div>
  );
}

function ListSection({ careers, matchPcts, onSimulate }: {
  careers: Career[];
  matchPcts: number[];
  onSimulate: (c: Career) => void;
}) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="space-y-3">
      {careers.map((c, i) => (
        <CareerRow
          key={c.name}
          career={c}
          rank={i + 1}
          matchPct={matchPcts[i] ?? 50}
          color={MATCH_COLORS[i % MATCH_COLORS.length]}
          delay={i * 80}
          inView={inView}
          onSimulate={() => onSimulate(c)}
        />
      ))}
    </div>
  );
}

export default function ProfessionsPage({ careers, onBack, onGoSimulator }: ProfessionsPageProps) {
  const matchPcts = careers.map((_, i) => Math.max(35, 72 - i * 7));
  const headerRef = useInView();

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border animate-slide-down">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <span className="text-accent font-bold text-lg">Жол</span>
            <span className="text-[11px] text-muted font-medium">• Твой путь</span>
          </button>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <button onClick={onBack} className="hover:text-text-main transition-colors">Профиль</button>
            <span className="text-accent font-semibold border-b-2 border-accent pb-0.5">Исследование</span>
            <span className="text-muted cursor-not-allowed opacity-50">Симулятор</span>
          </div>
          <button
            onClick={onBack}
            className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg
              hover:bg-accent-dark hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Начать путь →
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div
          ref={headerRef.ref}
          className={`text-center mb-12 transition-all duration-700 ${headerRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="inline-flex items-center gap-2 bg-purple-light text-purple-brand rounded-full px-4 py-2 mb-6">
            <span>🔭</span>
            <span className="text-[13px] font-semibold">Исследование профессий</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main mb-4">
            Профессии для тебя
          </h1>
          <p className="text-[16px] text-muted max-w-md mx-auto leading-relaxed">
            AI подобрал карьеры на основе твоего профиля. Нажми на карточку, чтобы узнать больше.
          </p>
        </div>

        {/* Stats row */}
        <div
          className={`grid grid-cols-3 gap-4 mb-10 transition-all duration-700 delay-200 ${headerRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {[
            { icon: '🎯', val: `${matchPcts[0]}%`, label: 'Лучшее совпадение' },
            { icon: '💼', val: `${careers.length}`, label: 'Профессий подобрано' },
            { icon: '📈', val: `${Math.round(matchPcts.reduce((a, b) => a + b, 0) / matchPcts.length)}%`, label: 'Среднее совпадение' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-border rounded-2xl p-5 text-center shadow-card
              hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-2xl font-extrabold text-text-main">{s.val}</p>
              <p className="text-[12px] text-muted font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Career list */}
        <ListSection careers={careers} matchPcts={matchPcts} onSimulate={onGoSimulator} />

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-[13px] text-muted mb-4">Хочешь проверить себя в профессии?</p>
          <button
            onClick={() => onGoSimulator(careers[0])}
            className="bg-gradient-to-r from-accent to-purple-brand text-white font-semibold px-8 py-4 rounded-xl
              hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-accent/25 text-[15px]"
          >
            🎮 Запустить симулятор →
          </button>
        </div>
      </div>
    </div>
  );
}
