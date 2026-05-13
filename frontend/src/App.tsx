import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import learningLottie from './assets/Learning.lottie?url';
import SplashScreen from './components/SplashScreen';
import type { Answers, RankSelection, Career } from './types';
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import ProfessionsPage from './pages/ProfessionsPage';
import SimulatorPage from './pages/SimulatorPage';
import { submitTest } from './utils/api';
import type { SubmitResult } from './utils/api';
import { calcScores, matchCareers } from './utils/scoring';

type AppState = 'landing' | 'test' | 'loading' | 'results' | 'professions' | 'simulator';

export default function App() {
  const [splash, setSplash] = useState(true);
  const [state, setState] = useState<AppState>('landing');
  const [apiResult, setApiResult] = useState<SubmitResult | null>(null);
  const [localAnswers, setLocalAnswers] = useState<Answers>({});
  const [localRankSels, setLocalRankSels] = useState<Record<string, RankSelection[]>>({});
  const [simCareer, setSimCareer] = useState<Career | null>(null);

  const topCareers: Career[] = apiResult?.matched_careers?.length
    ? apiResult.matched_careers
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
    setApiResult(null);
    setLocalAnswers({});
    setLocalRankSels({});
    setState('landing');
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
      setApiResult(result);
    } catch {
      const merged: Answers = { ...answers, ...rankSelections };
      const scores = calcScores(merged);
      const careers = matchCareers(scores);
      setApiResult({
        session_id: 'local',
        riasec_code: careers[0]?.riasec.slice(0, 3).join('') ?? 'ISC',
        scores,
        matched_careers: careers as SubmitResult['matched_careers'],
        insights: [],
      });
    }

    setState('results');
  };

  if (splash) {
    return <SplashScreen onDone={() => setSplash(false)} />;
  }

  if (state === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg px-5">
        <div className="w-72 h-72">
          <DotLottieReact
            src={learningLottie}
            loop
            autoplay
          />
        </div>
        <div className="text-center -mt-4">
          <h2 className="text-2xl font-bold text-text-main mb-2 animate-fade-up">
            Анализируем твой профиль...
          </h2>
          <p className="text-muted text-[15px] animate-fade-up-1 max-w-xs mx-auto leading-relaxed">
            Обрабатываем 36 ответов и подбираем профессии специально для тебя
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 animate-fade-up-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-purple-brand animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (state === 'results') {
    return (
      <ResultsPage
        answers={localAnswers}
        rankSelections={localRankSels}
        apiResult={apiResult}
        onRestart={handleRestart}
        onGoProfessions={handleProfessions}
        onGoSimulator={handleSimulator}
      />
    );
  }

  if (state === 'professions') {
    const careers = topCareers.length > 0 ? topCareers : matchCareers(
      calcScores({ ...localAnswers, ...localRankSels })
    );
    return (
      <ProfessionsPage
        careers={careers}
        onBack={handleResults}
        onGoSimulator={handleSimulator}
      />
    );
  }

  if (state === 'simulator') {
    const career = simCareer ?? (topCareers[0] as Career | undefined) ?? {
      name: 'Разработчик программного обеспечения',
      riasec: ['I', 'R', 'C'],
      values: ['growth', 'autonomy'],
      thinking: 'analytical' as const,
      why: 'Высокий спрос и возможность работать удалённо.',
      salary: '60 000–150 000 сом/мес',
      ort: 'Математика, Физика',
      tags: ['Высокий спрос'],
      universities: ['АУЦА', 'КГТУ'],
    };
    return (
      <SimulatorPage
        career={career}
        onBack={handleResults}
        onGoProfessions={handleProfessions}
      />
    );
  }

  return <TestPage onFinish={handleFinish} />;
}
