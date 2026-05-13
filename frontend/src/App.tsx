import { useState } from 'react';
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

  if (state === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }

  if (state === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-5 flex flex-col items-center justify-center min-h-screen">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-accent-light rounded-full" />
          <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-3 border-4 border-purple-light rounded-full" />
          <div className="absolute inset-3 border-4 border-purple-brand border-t-transparent rounded-full animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
        </div>
        <h2 className="text-xl font-bold text-text-main mb-2 animate-fade-up">Считаем твой профиль...</h2>
        <p className="text-muted text-sm animate-fade-up-1">Анализируем 36 ответов и подбираем профессии</p>
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
