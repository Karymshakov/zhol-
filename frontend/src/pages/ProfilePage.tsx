import { useEffect, useState } from 'react';
import { getHistory, getProfile } from '../utils/api';
import type { AuthUser, HistoryItem, SubmitResult } from '../utils/api';
import type { SimulatorRecord } from '../types';

interface ProfilePageProps {
  user: AuthUser;
  onLogout: () => void;
  onBack: () => void;
  onViewResult: (result: SubmitResult) => void;
  simHistory?: SimulatorRecord[];
}

const RIASEC_COLORS: Record<string, string> = {
  R: 'text-amber-brand bg-amber-light',
  I: 'text-purple-brand bg-purple-light',
  A: 'text-coral-brand bg-coral-light',
  S: 'text-teal-brand bg-teal-light',
  E: 'text-accent bg-accent-light',
  C: 'text-green-brand bg-green-light',
};

function CodeBadge({ code }: { code: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {code.split('').map((c, i) => (
        <span key={i} className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${RIASEC_COLORS[c] ?? 'text-muted bg-bg'}`}>
          {c}
        </span>
      ))}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? '#22C55E' : score >= 50 ? '#4A7CF5' : '#F59E0B';
  const r = 18;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#E2E8F0" strokeWidth="4" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (score / 100) * circ}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
}

// ─── Секция результатов симулятора ───────────────────────────────────────────

function SimHistorySection({ records }: { records: SimulatorRecord[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (records.length === 0) {
    return (
      <div className="bg-surface rounded-card shadow-card p-8 text-center">
        <div className="text-3xl mb-3">🎮</div>
        <p className="text-muted text-sm">Симуляций пока нет</p>
        <p className="text-xs text-muted mt-1">Пройди симулятор и результаты появятся здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((rec, i) => {
        const isOpen = expanded === rec.id;
        const careerShort = rec.career.split('/')[0].trim();
        const scoreColor = rec.score >= 70 ? 'text-green-brand bg-green-light'
          : rec.score >= 50 ? 'text-accent bg-accent-light'
          : 'text-amber-brand bg-amber-light';

        return (
          <div key={rec.id} className="bg-surface rounded-card shadow-card overflow-hidden"
            style={{ animationDelay: `${i * 0.05}s` }}>
            {/* Заголовок карточки */}
            <button
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-bg/40 transition-colors"
              onClick={() => setExpanded(isOpen ? null : rec.id)}
            >
              <ScoreRing score={rec.score} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-main truncate">{careerShort}</p>
                <p className="text-xs text-muted mt-0.5">{formatDate(rec.completedAt)}</p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${scoreColor}`}>
                {rec.score >= 70 ? '🎉 Отлично' : rec.score >= 50 ? '👍 Хорошо' : '🤔 Слабо'}
              </span>
              <svg className={`w-4 h-4 text-muted transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Раскрытые детали */}
            {isOpen && (
              <div className="px-5 pb-5 border-t border-border">
                {/* Итоговые параметры */}
                <div className="grid grid-cols-4 gap-3 mt-4 mb-4">
                  {[
                    { label: 'Энергия', val: rec.stats.energy,  icon: '⚡', color: '#22C55E' },
                    { label: 'Стресс',  val: rec.stats.stress,   icon: '😤', color: rec.stats.stress > 50 ? '#EF4444' : '#14B8A6' },
                    { label: 'Навыки',  val: rec.stats.skills,   icon: '✨', color: '#7C5CFA' },
                    { label: 'Настрой', val: rec.stats.mood,     icon: '😊', color: '#4A7CF5' },
                  ].map((s) => (
                    <div key={s.label} className="text-center bg-bg rounded-xl p-3">
                      <div className="text-lg mb-0.5">{s.icon}</div>
                      <div className="text-base font-bold" style={{ color: s.color }}>{s.val}%</div>
                      <div className="text-[10px] text-muted">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* AI-инсайты */}
                {rec.insights.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">🤖 AI-инсайты</p>
                    <div className="space-y-2">
                      {rec.insights.map((txt, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-light flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2 2 4-4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <p className="text-[12px] text-muted leading-relaxed">{txt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProfilePage({ user, onLogout, onBack, onViewResult, simHistory = [] }: ProfilePageProps) {
  const [history, setHistory]           = useState<HistoryItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [loadingSession, setLoadingSession] = useState<string | null>(null);
  const [activeTab, setActiveTab]       = useState<'tests' | 'sim'>('tests');

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const handleView = async (item: HistoryItem) => {
    setLoadingSession(item.session_id);
    try {
      const result = await getProfile(item.session_id);
      onViewResult(result);
    } catch {
      // игнорируем
    } finally {
      setLoadingSession(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-muted hover:text-text-main transition-colors p-1" aria-label="Назад">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={onBack} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
              <span className="text-accent font-bold text-lg">Tanda</span>            
            </button>
          </div>
          <button onClick={onLogout} className="text-sm text-muted hover:text-coral-brand transition-colors font-medium">
            Выйти
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-10">
        {/* Шапка профиля */}
        <div className="animate-fade-up bg-surface rounded-card shadow-card p-6 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center shrink-0">
            <span className="text-accent font-bold text-xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-text-main">{user.name}</h1>
            <p className="text-sm text-muted mt-0.5">{user.email}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[11px] text-muted">Диагностик: <b className="text-text-main">{history.length}</b></span>
            <span className="text-[11px] text-muted">Симуляций: <b className="text-text-main">{simHistory.length}</b></span>
          </div>
        </div>

        {/* Вкладки */}
        <div className="animate-fade-up-1 flex gap-1 bg-bg rounded-xl p-1 mb-6">
          {([
            { key: 'tests', label: '📋 Диагностики', count: history.length },
            { key: 'sim',   label: '🎮 Симулятор',   count: simHistory.length },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-white shadow-sm text-text-main'
                  : 'text-muted hover:text-text-main'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-accent-light text-accent' : 'bg-border text-muted'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Вкладка: Диагностики */}
        {activeTab === 'tests' && (
          <div className="animate-fade-up">
            {loading && <div className="text-center py-12 text-muted">Загрузка...</div>}

            {!loading && history.length === 0 && (
              <div className="bg-surface rounded-card shadow-card p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-bg flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" fill="none" stroke="#64748B" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-muted text-sm">Диагностик пока нет</p>
                <p className="text-xs text-muted mt-1">Пройди тест и сохрани результаты</p>
              </div>
            )}

            <div className="space-y-3">
              {history.map((item, i) => (
                <div key={item.session_id}
                  className="bg-surface rounded-card shadow-card p-5 flex items-center justify-between gap-4"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <CodeBadge code={item.riasec_code} />
                      <span className="text-xs text-muted">{formatDate(item.created_at)}</span>
                    </div>
                    {item.matched_careers.length > 0 && (
                      <p className="text-sm text-text-main font-medium truncate">
                        {item.matched_careers[0]}
                        {item.matched_careers[1] && (
                          <span className="text-muted font-normal">, {item.matched_careers[1]}</span>
                        )}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleView(item)}
                    disabled={loadingSession === item.session_id}
                    className="shrink-0 px-4 py-2 rounded-xl bg-accent-light text-accent text-sm font-semibold hover:bg-accent hover:text-white transition-all disabled:opacity-50"
                  >
                    {loadingSession === item.session_id ? '...' : 'Открыть'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка: Симулятор */}
        {activeTab === 'sim' && (
          <div className="animate-fade-up">
            <SimHistorySection records={simHistory} />
          </div>
        )}
      </div>
    </div>
  );
}
