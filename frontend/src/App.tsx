import { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import learningLottie from './assets/Learning.lottie?url';
import SplashScreen from './components/SplashScreen';
import type { Answers, RankSelection, Career, SimulatorRecord, ApiCareer } from './types';
import { useT } from './i18n/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import ProfessionsPage from './pages/ProfessionsPage';
import SimulatorPage from './pages/SimulatorPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { submitTest, linkSession, apiCareerToCareer } from './utils/api';
import type { SubmitResult, AuthUser } from './utils/api';
import { calcScores, matchCareers } from './utils/scoring';
import { careers as localCareers } from './data/careers';

type AppState = 'landing' | 'test' | 'loading' | 'results' | 'professions' | 'simulator' | 'auth' | 'profile';

const RESTORABLE_STATES: AppState[] = ['results', 'professions', 'simulator', 'auth', 'profile'];

function loadAppState(): AppState {
  try {
    const s = localStorage.getItem('zhol_state') as AppState;
    if (!s || !RESTORABLE_STATES.includes(s)) return 'landing';
    // States that require a saved result
    if (['results', 'professions', 'simulator'].includes(s)) {
      if (!localStorage.getItem('zhol_result')) return 'landing';
    }
    // Simulator also requires a saved career
    if (s === 'simulator' && !localStorage.getItem('zhol_sim_career')) return 'results';
    return s;
  } catch {
    return 'landing';
  }
}

function loadSimCareer(): Career | null {
  try {
    const raw = localStorage.getItem('zhol_sim_career');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('zhol_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadResult(): SubmitResult | null {
  try {
    const raw = localStorage.getItem('zhol_result');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveResult(result: SubmitResult | null) {
  if (result) {
    localStorage.setItem('zhol_result', JSON.stringify(result));
  } else {
    localStorage.removeItem('zhol_result');
  }
}

function loadSimHistory(): SimulatorRecord[] {
  try {
    const raw = localStorage.getItem('zhol_sim_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSimHistory(records: SimulatorRecord[]) {
  // Храним не более 20 последних
  localStorage.setItem('zhol_sim_history', JSON.stringify(records.slice(0, 20)));
}

function careerToApiCareer(career: Career): ApiCareer {
  return {
    name: career.name.ru,
    riasec: career.riasec,
    values: career.values,
    thinking: career.thinking,
    why: career.why.ru,
    salary: career.salary.ru,
    ort: career.ort.ru,
    tags: career.tags.map((t) => t.ru),
    universities: career.universities,
    matchScore: career.matchScore,
  };
}

const fallbackCareer: Career = {
  name: {
    ru: 'Разработчик программного обеспечения',
    en: 'Software Developer',
    ky: 'Программалык камсыздоо иштеп чыгуучусу',
  },
  riasec: ['I', 'R', 'C'],
  values: ['growth', 'autonomy'],
  thinking: 'analytical',
  why: {
    ru: 'Высокий спрос и возможность работать удалённо.',
    en: 'High demand and remote work opportunities.',
    ky: 'Жогорку суроо жана алыстан иштөөгө мүмкүнчүлүк.',
  },
  salary: {
    ru: '60 000–150 000 сом/мес',
    en: '60,000–150,000 KGS/month',
    ky: '60 000–150 000 сом/ай',
  },
  ort: {
    ru: 'Математика, Физика',
    en: 'Mathematics, Physics',
    ky: 'Математика, Физика',
  },
  tags: [
    { ru: 'Высокий спрос', en: 'High demand', ky: 'Жогорку суроо' },
  ],
  universities: ['АУЦА', 'КГТУ'],
};

export default function App() {
  const t = useT();
  const [splash, setSplash] = useState(true);
  const [state, setState] = useState<AppState>(loadAppState);
  const [apiResult, setApiResult] = useState<SubmitResult | null>(loadResult);
  const [localAnswers, setLocalAnswers] = useState<Answers>({});
  const [localRankSels, setLocalRankSels] = useState<Record<string, RankSelection[]>>({});
  const [simCareer, setSimCareer] = useState<Career | null>(loadSimCareer);

  // Persist navigation state so page refresh returns to the same place
  useEffect(() => {
    try { localStorage.setItem('zhol_state', state); } catch { /* ignore */ }
  }, [state]);

  // Persist selected simulator career
  useEffect(() => {
    if (simCareer) {
      try { localStorage.setItem('zhol_sim_career', JSON.stringify(simCareer)); } catch { /* ignore */ }
    } else {
      localStorage.removeItem('zhol_sim_career');
    }
  }, [simCareer]);

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(loadUser);
  const [simHistory, setSimHistory]   = useState<SimulatorRecord[]>(loadSimHistory);
  /** Куда вернуться после авторизации */
  const [authReturnState, setAuthReturnState] = useState<AppState>('results');

  const setResult = (r: SubmitResult | null) => {
    saveResult(r);
    setApiResult(r);
  };

  const topCareers: Career[] = apiResult?.matched_careers?.length
    ? apiResult.matched_careers.map((ac) => apiCareerToCareer(ac, localCareers))
    : [];

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleStart = () => { setState('test'); scrollTop(); };
  const handleResults = () => { setState('results'); scrollTop(); };
  const handleProfessions = () => { setState('professions'); scrollTop(); };
  const handleSimulator = (career: Career) => {
    setSimCareer(career);
    setState('simulator');
    scrollTop();
  };
  const handleRestart = () => {
    setResult(null);
    setLocalAnswers({});
    setLocalRankSels({});
    setSimCareer(null);
    localStorage.removeItem('zhol_state');
    localStorage.removeItem('zhol_sim_career');
    setState('landing');
    scrollTop();
  };

  const handleSimulatorComplete = (record: SimulatorRecord) => {
    const updated = [record, ...simHistory];
    setSimHistory(updated);
    saveSimHistory(updated);
  };

  const handleGoAuth = (returnTo: AppState = 'results') => {
    setAuthReturnState(returnTo);
    setState('auth');
    scrollTop();
  };

  const handleAuthSuccess = async (user: AuthUser, _token: string) => {
    setCurrentUser(user);
    // Если есть текущая сессия — привязываем к аккаунту
    if (apiResult?.session_id && apiResult.session_id !== 'local') {
      try { await linkSession(apiResult.session_id); } catch { /* игнорируем */ }
    }
    setState(authReturnState === 'auth' ? 'profile' : authReturnState);
    scrollTop();
  };

  const handleLogout = () => {
    localStorage.removeItem('zhol_token');
    localStorage.removeItem('zhol_user');
    setCurrentUser(null);
    setState('landing');
    scrollTop();
  };

  const handleGoProfile = () => { setState('profile'); scrollTop(); };

  const handleViewHistoryResult = (result: SubmitResult) => {
    setResult(result);
    setLocalAnswers({});
    setLocalRankSels({});
    setState('results');
    scrollTop();
  };

  const handleFinish = async (
    answers: Answers,
    rankSelections: Record<string, RankSelection[]>,
  ) => {
    setLocalAnswers(answers);
    setLocalRankSels(rankSelections);
    setState('loading');
    scrollTop();

    try {
      const result = await submitTest(answers, rankSelections);
      setResult(result);
      // Если пользователь уже залогинен — сразу привязываем сессию
      if (currentUser && result.session_id !== 'local') {
        try { await linkSession(result.session_id); } catch { /* игнорируем */ }
      }
    } catch {
      const merged: Answers = { ...answers, ...rankSelections };
      const scores = calcScores(merged);
      const careers = matchCareers(scores);
      setResult({
        session_id: 'local',
        riasec_code: careers[0]?.riasec.slice(0, 3).join('') ?? 'ISC',
        scores,
        matched_careers: careers.map(careerToApiCareer),
        insights: [],
      });
    }

    setState('results');
  };

  // ─── Фиксированный переключатель языка — рендерится ОДИН раз здесь ───────────
  const LangWidget = () => (
    <div className="fixed top-4 right-4 z-[9998] print:hidden">
      <LanguageSwitcher />
    </div>
  );

  if (splash) {
    return (
      <>
        <SplashScreen onDone={() => setSplash(false)} />
        <LangWidget />
      </>
    );
  }

  const goHome = () => { setState('landing'); scrollTop(); };

  let page: React.ReactNode;

  if (state === 'landing') {
    page = (
      <LandingPage
        onStart={handleStart}
        hasResult={!!apiResult}
        onGoResults={handleResults}
        onGoProfessions={apiResult ? handleProfessions : undefined}
        currentUser={currentUser}
        onGoAuth={() => handleGoAuth('profile')}
        onGoProfile={handleGoProfile}
      />
    );
  } else if (state === 'auth') {
    page = (
      <AuthPage
        onSuccess={handleAuthSuccess}
        onBack={() => { setState(authReturnState); scrollTop(); }}
        pendingMessage={
          apiResult && apiResult.session_id !== 'local'
            ? t.authPendingMsg
            : undefined
        }
      />
    );
  } else if (state === 'profile') {
    if (!currentUser) { handleGoAuth('profile'); return null; }
    page = (
      <ProfilePage
        user={currentUser}
        onLogout={handleLogout}
        onBack={() => { setState(apiResult ? 'results' : 'landing'); scrollTop(); }}
        onViewResult={handleViewHistoryResult}
        simHistory={simHistory}
      />
    );
  } else if (state === 'loading') {
    page = (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg px-5">
        <div className="w-72 h-72">
          <DotLottieReact src={learningLottie} loop autoplay />
        </div>
        <div className="text-center -mt-4">
          <h2 className="text-2xl font-bold text-text-main mb-2 animate-fade-up">
            {t.loadingTitle}
          </h2>
          <p className="text-muted text-[15px] animate-fade-up-1 max-w-xs mx-auto leading-relaxed">
            {t.loadingDesc}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 animate-fade-up-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-purple-brand animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  } else if (state === 'results') {
    page = (
      <ResultsPage
        answers={localAnswers}
        rankSelections={localRankSels}
        apiResult={apiResult}
        onRestart={handleRestart}
        onGoProfessions={handleProfessions}
        onGoSimulator={handleSimulator}
        currentUser={currentUser}
        onGoAuth={() => handleGoAuth('results')}
        onGoProfile={handleGoProfile}
        onGoHome={goHome}
      />
    );
  } else if (state === 'professions') {
    const careers = topCareers.length > 0 ? topCareers : matchCareers(
      calcScores({ ...localAnswers, ...localRankSels })
    );
    page = (
      <ProfessionsPage
        careers={careers}
        onBack={handleResults}
        onGoSimulator={handleSimulator}
        onGoHome={goHome}
      />
    );
  } else if (state === 'simulator') {
    const career = simCareer ?? topCareers[0] ?? fallbackCareer;
    page = (
      <SimulatorPage
        career={career}
        onBack={handleResults}
        onGoProfessions={handleProfessions}
        onGoHome={goHome}
        onComplete={handleSimulatorComplete}
      />
    );
  } else {
    page = <TestPage onFinish={handleFinish} onGoHome={() => { setState('landing'); scrollTop(); }} />;
  }

  return (
    <>
      {page}
      <LangWidget />
    </>
  );
}
