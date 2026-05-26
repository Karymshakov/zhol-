import { useState, useEffect, useRef } from 'react';
import type { Career } from '../types';
import { useInView } from '../hooks/useInView';
import { useT, useL, useLanguage } from '../i18n/LanguageContext';
import type { Lang } from '../i18n/translations';

interface ProfessionsPageProps {
  careers: Career[];
  onBack: () => void;
  onGoSimulator: (career: Career) => void;
  onGoHome: () => void;
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
  const t = useT();
  const l = useL();
  const [expanded, setExpanded] = useState(false);
  const icon = CAREER_ICONS[career.name.ru] || '💼';
  const iconBg = ICON_BG[(rank - 1) % ICON_BG.length];
  const firstTag = career.tags[0];
  const tagClass = TAG_COLORS[firstTag?.ru] || 'bg-bg text-muted';

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
            <h3 className="text-[15px] font-bold text-text-main">{l(career.name)}</h3>
            {firstTag && (
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${tagClass}`}>
                {l(firstTag)}
              </span>
            )}
          </div>
          <p className="text-[13px] text-muted leading-snug mb-2 line-clamp-1">{l(career.why)}</p>
          <div className="flex items-center gap-3 text-[12px] text-muted">
            <span>💰 {l(career.salary)}</span>
            <span className="text-green-brand font-semibold">↗ +{Math.floor(matchPct * 1.5)}% {t.profSalaryGrowth}</span>
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
          <span className="text-[10px] text-muted font-medium">{t.profMatch}</span>
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
          <p className="text-[13px] text-muted leading-relaxed mb-4">{l(career.why)}</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 border border-border">
              <p className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">{t.profSalary}</p>
              <p className="text-[13px] font-semibold text-text-main">{l(career.salary)}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-border">
              <p className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1">{t.profOrt}</p>
              <p className="text-[13px] font-semibold text-text-main">{l(career.ort)}</p>
            </div>
          </div>
          {(career.universities ?? []).length > 0 && (
            <div className="bg-white rounded-xl p-3 border border-border mb-4">
              <p className="text-[10px] text-muted uppercase font-bold tracking-wider mb-1.5">🎓 {t.profUniversities}</p>
              <p className="text-[13px] text-text-main">{(career.universities ?? []).join(' · ')}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {career.tags.map((tag) => (
              <span key={tag.ru} className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${TAG_COLORS[tag.ru] || 'bg-bg text-muted'}`}>
                {l(tag)}
              </span>
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onSimulate(); }}
            className="w-full py-3 rounded-xl bg-accent text-white text-sm font-semibold
              hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
              shadow-md shadow-accent/20"
          >
            {t.profSimBtn} {l(career.name).split('/')[0].trim()} →
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
          key={c.name.ru}
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

// ══════════════════════════════════════════════════════════════
// МИНИ-ИГРА 1 — Угадай профессию
// ══════════════════════════════════════════════════════════════
const QUIZ_DATA: Record<Lang, { clues: string[]; hint: string; options: string[]; answer: number }[]> = {
  ru: [
    { clues: ['💻', '📊', '🔍'], hint: 'Превращает данные в понятные отчёты и графики', options: ['Data Analyst', 'UX Дизайнер', 'Юрист', 'Агроном'], answer: 0 },
    { clues: ['🎨', '📱', '✏️'], hint: 'Создаёт красивые и удобные интерфейсы приложений', options: ['Журналист', 'UX/UI Дизайнер', 'Экономист', 'Врач'], answer: 1 },
    { clues: ['⚖️', '📜', '🏛️'], hint: 'Составляет договоры и защищает права клиентов', options: ['Юрист', 'Учитель', 'Агроном', 'IT-специалист'], answer: 0 },
    { clues: ['🩺', '💊', '🏥'], hint: 'Ставит диагнозы и назначает лечение пациентам', options: ['Журналист', 'Финансист', 'Врач', 'Дизайнер'], answer: 2 },
    { clues: ['🌱', '🚜', '🌾'], hint: 'Занимается земледелием и повышением урожайности', options: ['Психолог', 'Агроном', 'Юрист', 'Разработчик'], answer: 1 },
    { clues: ['🎙️', '📰', '📹'], hint: 'Берёт интервью, пишет статьи и снимает репортажи', options: ['Дизайнер', 'Агроном', 'Журналист', 'Финансист'], answer: 2 },
  ],
  en: [
    { clues: ['💻', '📊', '🔍'], hint: 'Turns data into clear reports and charts', options: ['Data Analyst', 'UX Designer', 'Lawyer', 'Agronomist'], answer: 0 },
    { clues: ['🎨', '📱', '✏️'], hint: 'Creates beautiful and intuitive app interfaces', options: ['Journalist', 'UX/UI Designer', 'Economist', 'Doctor'], answer: 1 },
    { clues: ['⚖️', '📜', '🏛️'], hint: "Drafts contracts and protects clients' rights", options: ['Lawyer', 'Teacher', 'Agronomist', 'IT Specialist'], answer: 0 },
    { clues: ['🩺', '💊', '🏥'], hint: 'Diagnoses conditions and prescribes treatment', options: ['Journalist', 'Economist', 'Doctor', 'Designer'], answer: 2 },
    { clues: ['🌱', '🚜', '🌾'], hint: 'Works with farming and improving crop yields', options: ['Psychologist', 'Agronomist', 'Lawyer', 'Developer'], answer: 1 },
    { clues: ['🎙️', '📰', '📹'], hint: 'Conducts interviews, writes articles and shoots reports', options: ['Designer', 'Agronomist', 'Journalist', 'Economist'], answer: 2 },
  ],
  ky: [
    { clues: ['💻', '📊', '🔍'], hint: 'Маалыматтарды ачык отчёттор жана графиктерге айландырат', options: ['Data Analyst', 'UX Дизайнер', 'Юрист', 'Агроном'], answer: 0 },
    { clues: ['🎨', '📱', '✏️'], hint: 'Колдонмолор үчүн сонун жана ыңгайлуу интерфейстерди жаратат', options: ['Журналист', 'UX/UI Дизайнер', 'Экономист', 'Врач'], answer: 1 },
    { clues: ['⚖️', '📜', '🏛️'], hint: 'Келишимдерди түзөт жана кардарлардын укуктарын коргойт', options: ['Юрист', 'Мугалим', 'Агроном', 'IT-адис'], answer: 0 },
    { clues: ['🩺', '💊', '🏥'], hint: 'Диагноз коёт жана пациенттерге дарылоо дайындайт', options: ['Журналист', 'Финансист', 'Врач', 'Дизайнер'], answer: 2 },
    { clues: ['🌱', '🚜', '🌾'], hint: 'Дыйканчылык жана түшүмдүүлүктү жогорулатуу менен иштейт', options: ['Психолог', 'Агроном', 'Юрист', 'Иштеп чыгуучу'], answer: 1 },
    { clues: ['🎙️', '📰', '📹'], hint: 'Интервью алат, макалалар жазат жана репортаждар тартат', options: ['Дизайнер', 'Агроном', 'Журналист', 'Финансист'], answer: 2 },
  ],
};

const QUIZ_RESULT_MSG: Record<Lang, [string, string, string]> = {
  ru: ['🏆 Отлично! Ты хорошо знаешь профессии.', '👍 Неплохо! Есть куда расти.', '💡 Изучи профессии подробнее ниже.'],
  en: ['🏆 Excellent! You know your careers well.', '👍 Not bad! Room to grow.', '💡 Explore the careers below in more detail.'],
  ky: ['🏆 Мыкты! Кесиптерди жакшы билесиң.', '👍 Жаман эмес! Өсүүгө орун бар.', '💡 Төмөндөгү кесиптерди кеңири изилде.'],
};

const QUIZ_PCT_LABEL: Record<Lang, string> = {
  ru: 'правильных ответов',
  en: 'correct answers',
  ky: 'туура жооп',
};

function GameQuiz() {
  const t = useT();
  const { lang } = useLanguage();
  const QUIZ_QUESTIONS = QUIZ_DATA[lang];

  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = QUIZ_QUESTIONS[qIdx];

  useEffect(() => {
    if (!started || finished || selected !== null) return;
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSelect(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [qIdx, started, finished]); // eslint-disable-line

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    clearInterval(timerRef.current!);
    setSelected(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (qIdx + 1 >= QUIZ_QUESTIONS.length) {
      setFinished(true);
    } else {
      setQIdx((i) => i + 1);
      setSelected(null);
    }
  };

  const restart = () => { setQIdx(0); setSelected(null); setScore(0); setFinished(false); setStarted(false); };

  if (!started) return (
    <div className="text-center py-6">
      <div className="text-5xl mb-4">🎯</div>
      <h3 className="text-lg font-bold text-text-main mb-2">{t.quizTitle}</h3>
      <p className="text-sm text-muted mb-5">{t.quizDesc}</p>
      <button onClick={() => setStarted(true)}
        className="bg-accent text-white font-semibold px-6 py-3 rounded-xl hover:bg-accent-dark transition-all">
        {t.gameStartGame}
      </button>
    </div>
  );

  if (finished) {
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    const msgs = QUIZ_RESULT_MSG[lang];
    const msg = score >= 5 ? msgs[0] : score >= 3 ? msgs[1] : msgs[2];
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-3">{score >= 5 ? '🏆' : score >= 3 ? '🎉' : '📚'}</div>
        <p className="text-3xl font-extrabold text-text-main mb-1">{score}/{QUIZ_QUESTIONS.length}</p>
        <p className="text-sm text-muted mb-2">{QUIZ_PCT_LABEL[lang]} ({pct}%)</p>
        <p className="text-sm font-medium text-text-main mb-5">{msg}</p>
        <button onClick={restart}
          className="border border-accent text-accent font-semibold px-6 py-2.5 rounded-xl hover:bg-accent-light transition-all">
          {t.gameRestart}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-muted">{qIdx + 1} / {QUIZ_QUESTIONS.length}</span>
        <div className="flex-1 mx-3 h-1.5 bg-bg rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${((qIdx) / QUIZ_QUESTIONS.length) * 100}%` }} />
        </div>
        <span className={`text-xs font-bold w-7 text-center ${timeLeft <= 5 ? 'text-coral-brand' : 'text-muted'}`}>
          {timeLeft}{t.quizTimeSuffix}
        </span>
      </div>
      {/* Clues */}
      <div className="flex justify-center gap-4 text-4xl mb-4">
        {q.clues.map((c, i) => <span key={i}>{c}</span>)}
      </div>
      <p className="text-center text-sm text-muted mb-5 italic">«{q.hint}»</p>
      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt, i) => {
          let cls = 'border border-border bg-white text-text-main hover:border-accent hover:bg-accent-light';
          if (selected !== null) {
            if (i === q.answer) cls = 'border-green-brand bg-green-light text-green-brand';
            else if (i === selected) cls = 'border-coral-brand bg-coral-light text-coral-brand';
            else cls = 'border-border bg-white text-muted opacity-50';
          }
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border ${cls}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <button onClick={next}
          className="w-full mt-4 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-all">
          {qIdx + 1 >= QUIZ_QUESTIONS.length ? t.gameSeeResult : t.gameNext}
        </button>
      )}
      <div className="flex justify-center gap-1 mt-4">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < qIdx ? 'bg-accent' : i === qIdx ? 'bg-accent-dark scale-125' : 'bg-border'}`} />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// МИНИ-ИГРА 2 — Правда или миф
// ══════════════════════════════════════════════════════════════
const TRUTH_DATA: Record<Lang, { text: string; correct: boolean; explain: string }[]> = {
  ru: [
    { text: 'IT-разработчик в Кыргызстане может зарабатывать от 60 000 сом уже на старте карьеры', correct: true,  explain: '✅ Верно! Junior-разработчики в КР зарабатывают 60–80 тыс. сом.' },
    { text: 'Агрономы востребованы только в сельских районах и не нужны в городе', correct: false, explain: '❌ Миф! Агроспециалисты работают в городских агрохолдингах, лабораториях и экспортных компаниях.' },
    { text: 'Для поступления на юридический факультет АУЦА нужен высокий балл по английскому', correct: true,  explain: '✅ Верно! АУЦА — англоязычный вуз, требует IELTS или SAT.' },
    { text: 'Психологи в КР не могут работать онлайн и принимать иностранных клиентов', correct: false, explain: '❌ Миф! Онлайн-консультации — растущий рынок. Многие психологи работают удалённо.' },
    { text: 'UX-дизайнер и графический дизайнер — одна и та же профессия', correct: false, explain: '❌ Миф! UX — проектирование опыта пользователя, а графический — визуальное оформление.' },
    { text: 'Журналисты в КР всё чаще работают в digital-медиа, а не в печатных изданиях', correct: true,  explain: '✅ Верно! Интернет-медиа и YouTube-каналы активно растут в КР.' },
  ],
  en: [
    { text: 'An IT developer in Kyrgyzstan can earn from 60,000 som at the start of their career', correct: true,  explain: '✅ True! Junior developers in KG earn 60–80k som.' },
    { text: 'Agronomists are only in demand in rural areas and not needed in cities', correct: false, explain: '❌ False! Agricultural specialists work in urban agro-holdings, labs and export companies.' },
    { text: 'You need a high English score to enter the law faculty at AUCA', correct: true,  explain: '✅ True! AUCA is an English-language university requiring IELTS or SAT.' },
    { text: 'Psychologists in KG cannot work online or take foreign clients', correct: false, explain: '❌ False! Online consultations are a growing market. Many psychologists work remotely.' },
    { text: 'UX designer and graphic designer are the same profession', correct: false, explain: '❌ False! UX is about designing user experience; graphic design is about visual presentation.' },
    { text: 'Journalists in KG increasingly work in digital media rather than print publications', correct: true,  explain: '✅ True! Internet media and YouTube channels are actively growing in KG.' },
  ],
  ky: [
    { text: 'КРдагы IT-иштеп чыгуучу мансаптын башынан эле 60 000 сомдон эле алабы', correct: true,  explain: '✅ Туура! КРдагы Junior-иштеп чыгуучулар 60–80 миң сом алышат.' },
    { text: 'Агрономдор кыштактарда гана талап кылынат жана шаарда керек эмес', correct: false, explain: '❌ Жалган! Агро-адистер шаардык агрохолдингтерде, зертханаларда жана экспорт компанияларда иштешет.' },
    { text: 'АУЦАнын юридикалык факультетине кирүү үчүн англис тилинен жогорку балл керек', correct: true,  explain: '✅ Туура! АУЦА — англис тилиндеги университет, IELTS же SAT талап кылат.' },
    { text: 'КРдагы психологдор онлайн иштей жана чет өлкөлүк кардарларды кабыл алабы', correct: false, explain: '❌ Жалган! Онлайн кеңештер — өсүп жаткан рынок. Көптөгөн психологдор алыстан иштешет.' },
    { text: 'UX-дизайнер жана графикалык дизайнер — бир эле кесип', correct: false, explain: '❌ Жалган! UX — колдонуучу тажрыйбасын долбоорлоо, ал эми графикалык — визуалдык беземе.' },
    { text: 'КРдагы журналисттер барган сайын басма эмес, санариптик медиада иштей баштады', correct: true,  explain: '✅ Туура! Интернет-медиа жана YouTube-каналдар КРда активдүү өсүп жатат.' },
  ],
};

const TRUTH_RESULT_MSG: Record<Lang, [string, string, string]> = {
  ru: ['Отличное знание рынка труда КР!', 'Хорошо! Несколько фактов тебя удивили?', 'Рынок труда КР полон неожиданностей!'],
  en: ['Excellent knowledge of the KG job market!', 'Good! Did a few facts surprise you?', "The KG job market is full of surprises!"],
  ky: ['КРдын эмгек рыногун мыкты билесиң!', 'Жакшы! Бир нече факт сени таң калтырдыбы?', 'КРдын эмгек рыногу күтүлбөгөн нерселерге толо!'],
};

const TRUTH_PCT_LABEL: Record<Lang, string> = {
  ru: '% правильно',
  en: '% correct',
  ky: '% туура',
};

function GameTruth() {
  const t = useT();
  const { lang } = useLanguage();
  const TRUTH_STATEMENTS = TRUTH_DATA[lang];

  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const s = TRUTH_STATEMENTS[idx];

  const handle = (ans: boolean) => {
    if (answered !== null) return;
    setAnswered(ans);
    if (ans === s.correct) setScore((v) => v + 1);
  };

  const next = () => {
    if (idx + 1 >= TRUTH_STATEMENTS.length) setFinished(true);
    else { setIdx((i) => i + 1); setAnswered(null); }
  };

  const restart = () => { setIdx(0); setAnswered(null); setScore(0); setFinished(false); setStarted(false); };

  if (!started) return (
    <div className="text-center py-6">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-lg font-bold text-text-main mb-2">{t.truthTitle}</h3>
      <p className="text-sm text-muted mb-5">{t.truthDesc}</p>
      <button onClick={() => setStarted(true)}
        className="bg-green-brand text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all">
        {t.gameStart}
      </button>
    </div>
  );

  if (finished) {
    const pct = Math.round((score / TRUTH_STATEMENTS.length) * 100);
    const msgs = TRUTH_RESULT_MSG[lang];
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-3">{score >= 5 ? '🧠' : score >= 3 ? '👍' : '📖'}</div>
        <p className="text-3xl font-extrabold text-text-main mb-1">{score}/{TRUTH_STATEMENTS.length}</p>
        <p className="text-sm text-muted mb-2">({pct}{TRUTH_PCT_LABEL[lang]})</p>
        <p className="text-sm font-medium text-text-main mb-5">
          {score >= 5 ? msgs[0] : score >= 3 ? msgs[1] : msgs[2]}
        </p>
        <button onClick={restart}
          className="border border-green-brand text-green-brand font-semibold px-6 py-2.5 rounded-xl hover:bg-green-light transition-all">
          {t.gameRestart}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-semibold text-muted">{idx + 1} / {TRUTH_STATEMENTS.length}</span>
        <div className="flex-1 mx-3 h-1.5 bg-bg rounded-full overflow-hidden">
          <div className="h-full bg-green-brand rounded-full transition-all duration-500"
            style={{ width: `${(idx / TRUTH_STATEMENTS.length) * 100}%` }} />
        </div>
        <span className="text-xs font-bold text-green-brand">{score} ✓</span>
      </div>

      <div className="bg-bg rounded-2xl p-5 mb-5 min-h-[80px] flex items-center justify-center">
        <p className="text-[15px] font-semibold text-text-main text-center leading-relaxed">{s.text}</p>
      </div>

      {answered === null ? (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handle(true)}
            className="py-4 rounded-xl border-2 border-green-brand bg-green-light text-green-brand font-bold text-sm hover:bg-green-brand hover:text-white transition-all">
            {t.gameTruthTrue}
          </button>
          <button onClick={() => handle(false)}
            className="py-4 rounded-xl border-2 border-coral-brand bg-coral-light text-coral-brand font-bold text-sm hover:bg-coral-brand hover:text-white transition-all">
            {t.gameTruthFalse}
          </button>
        </div>
      ) : (
        <div>
          <div className={`p-4 rounded-xl mb-3 text-sm font-medium leading-relaxed
            ${answered === s.correct ? 'bg-green-light text-green-brand border border-green-brand/30' : 'bg-coral-light text-coral-brand border border-coral-brand/30'}`}>
            {s.explain}
          </div>
          <button onClick={next}
            className="w-full py-3 rounded-xl bg-green-brand text-white font-semibold text-sm hover:opacity-90 transition-all">
            {idx + 1 >= TRUTH_STATEMENTS.length ? t.gameSeeResult : t.gameTruthNext}
          </button>
        </div>
      )}

      <div className="flex justify-center gap-1 mt-4">
        {TRUTH_STATEMENTS.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i < idx ? 'bg-green-brand' : i === idx ? 'bg-green-brand scale-125' : 'bg-border'}`} />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// МИНИ-ИГРА 3 — Твой стиль работы
// ══════════════════════════════════════════════════════════════
const WORK_TASKS_DATA: Record<Lang, { emoji: string; label: string; careers: string[] }[]> = {
  ru: [
    { emoji: '💻', label: 'Писать код и разрабатывать приложения',   careers: ['IT', 'Data'] },
    { emoji: '🎨', label: 'Рисовать макеты и прорабатывать дизайн',  careers: ['Design'] },
    { emoji: '📊', label: 'Анализировать цифры и строить графики',    careers: ['Data', 'Finance'] },
    { emoji: '🗣️', label: 'Общаться с людьми и помогать им',          careers: ['Psychology', 'Teaching'] },
    { emoji: '📰', label: 'Писать статьи и рассказывать истории',     careers: ['Journalism'] },
    { emoji: '⚖️', label: 'Изучать законы и составлять документы',    careers: ['Law'] },
    { emoji: '🌱', label: 'Работать с природой и растениями',         careers: ['Agronomy'] },
    { emoji: '🔬', label: 'Исследовать и ставить эксперименты',       careers: ['Science', 'Medicine'] },
    { emoji: '🚀', label: 'Придумывать и запускать новые идеи',       careers: ['Business', 'IT'] },
    { emoji: '🤝', label: 'Вести переговоры и управлять командой',    careers: ['Business', 'Law'] },
  ],
  en: [
    { emoji: '💻', label: 'Write code and build applications',        careers: ['IT', 'Data'] },
    { emoji: '🎨', label: 'Create mockups and develop designs',       careers: ['Design'] },
    { emoji: '📊', label: 'Analyse numbers and build charts',         careers: ['Data', 'Finance'] },
    { emoji: '🗣️', label: 'Talk to people and help them',             careers: ['Psychology', 'Teaching'] },
    { emoji: '📰', label: 'Write articles and tell stories',          careers: ['Journalism'] },
    { emoji: '⚖️', label: 'Study laws and draft documents',           careers: ['Law'] },
    { emoji: '🌱', label: 'Work with nature and plants',              careers: ['Agronomy'] },
    { emoji: '🔬', label: 'Research and run experiments',             careers: ['Science', 'Medicine'] },
    { emoji: '🚀', label: 'Invent and launch new ideas',              careers: ['Business', 'IT'] },
    { emoji: '🤝', label: 'Negotiate and manage teams',               careers: ['Business', 'Law'] },
  ],
  ky: [
    { emoji: '💻', label: 'Код жазуу жана колдонмолорду иштеп чыгуу', careers: ['IT', 'Data'] },
    { emoji: '🎨', label: 'Макеттерди тартуу жана дизайнды иштеп чыгуу', careers: ['Design'] },
    { emoji: '📊', label: 'Сандарды талдоо жана графиктерди куруу',    careers: ['Data', 'Finance'] },
    { emoji: '🗣️', label: 'Адамдар менен сүйлөшүп, аларга жардам берүү', careers: ['Psychology', 'Teaching'] },
    { emoji: '📰', label: 'Макалалар жазуу жана окуяларды айтып берүү', careers: ['Journalism'] },
    { emoji: '⚖️', label: 'Мыйзамдарды изилдөө жана документтерди түзүү', careers: ['Law'] },
    { emoji: '🌱', label: 'Табият жана өсүмдүктөр менен иштөө',        careers: ['Agronomy'] },
    { emoji: '🔬', label: 'Изилдөө жана эксперименттерди жүргүзүү',    careers: ['Science', 'Medicine'] },
    { emoji: '🚀', label: 'Жаңы идеяларды ойлоп тоо жана ишке ашыруу', careers: ['Business', 'IT'] },
    { emoji: '🤝', label: 'Сүйлөшүүлөр жүргүзүү жана команданы башкаруу', careers: ['Business', 'Law'] },
  ],
};

const CAREER_MAP_DATA: Record<Lang, Record<string, { label: string; emoji: string; color: string }>> = {
  ru: {
    IT:         { label: 'IT-разработчик',         emoji: '💻', color: 'text-accent bg-accent-light' },
    Data:       { label: 'Data Analyst',            emoji: '📊', color: 'text-purple-brand bg-purple-light' },
    Design:     { label: 'UX/UI Дизайнер',          emoji: '🎨', color: 'text-coral-brand bg-coral-light' },
    Finance:    { label: 'Финансист',               emoji: '💰', color: 'text-amber-brand bg-amber-light' },
    Psychology: { label: 'Психолог',                emoji: '🧠', color: 'text-teal-brand bg-teal-light' },
    Teaching:   { label: 'Педагог',                 emoji: '📚', color: 'text-green-brand bg-green-light' },
    Journalism: { label: 'Журналист',               emoji: '📰', color: 'text-accent bg-accent-light' },
    Law:        { label: 'Юрист',                   emoji: '⚖️', color: 'text-purple-brand bg-purple-light' },
    Agronomy:   { label: 'Агроном',                 emoji: '🌱', color: 'text-green-brand bg-green-light' },
    Science:    { label: 'Учёный / Исследователь',  emoji: '🔬', color: 'text-teal-brand bg-teal-light' },
    Medicine:   { label: 'Врач',                    emoji: '🩺', color: 'text-coral-brand bg-coral-light' },
    Business:   { label: 'Предприниматель',         emoji: '🚀', color: 'text-amber-brand bg-amber-light' },
  },
  en: {
    IT:         { label: 'IT Developer',            emoji: '💻', color: 'text-accent bg-accent-light' },
    Data:       { label: 'Data Analyst',            emoji: '📊', color: 'text-purple-brand bg-purple-light' },
    Design:     { label: 'UX/UI Designer',          emoji: '🎨', color: 'text-coral-brand bg-coral-light' },
    Finance:    { label: 'Economist / Financier',   emoji: '💰', color: 'text-amber-brand bg-amber-light' },
    Psychology: { label: 'Psychologist',            emoji: '🧠', color: 'text-teal-brand bg-teal-light' },
    Teaching:   { label: 'Teacher / Educator',      emoji: '📚', color: 'text-green-brand bg-green-light' },
    Journalism: { label: 'Journalist',              emoji: '📰', color: 'text-accent bg-accent-light' },
    Law:        { label: 'Lawyer',                  emoji: '⚖️', color: 'text-purple-brand bg-purple-light' },
    Agronomy:   { label: 'Agronomist',              emoji: '🌱', color: 'text-green-brand bg-green-light' },
    Science:    { label: 'Scientist / Researcher',  emoji: '🔬', color: 'text-teal-brand bg-teal-light' },
    Medicine:   { label: 'Doctor',                  emoji: '🩺', color: 'text-coral-brand bg-coral-light' },
    Business:   { label: 'Entrepreneur',            emoji: '🚀', color: 'text-amber-brand bg-amber-light' },
  },
  ky: {
    IT:         { label: 'IT-иштеп чыгуучу',        emoji: '💻', color: 'text-accent bg-accent-light' },
    Data:       { label: 'Data Analyst',            emoji: '📊', color: 'text-purple-brand bg-purple-light' },
    Design:     { label: 'UX/UI Дизайнер',          emoji: '🎨', color: 'text-coral-brand bg-coral-light' },
    Finance:    { label: 'Финансист',               emoji: '💰', color: 'text-amber-brand bg-amber-light' },
    Psychology: { label: 'Психолог',                emoji: '🧠', color: 'text-teal-brand bg-teal-light' },
    Teaching:   { label: 'Мугалим / Педагог',       emoji: '📚', color: 'text-green-brand bg-green-light' },
    Journalism: { label: 'Журналист',               emoji: '📰', color: 'text-accent bg-accent-light' },
    Law:        { label: 'Юрист',                   emoji: '⚖️', color: 'text-purple-brand bg-purple-light' },
    Agronomy:   { label: 'Агроном',                 emoji: '🌱', color: 'text-green-brand bg-green-light' },
    Science:    { label: 'Окумуштуу / Изилдөөчү',  emoji: '🔬', color: 'text-teal-brand bg-teal-light' },
    Medicine:   { label: 'Врач',                    emoji: '🩺', color: 'text-coral-brand bg-coral-light' },
    Business:   { label: 'Ишкер',                   emoji: '🚀', color: 'text-amber-brand bg-amber-light' },
  },
};

function GameStyle() {
  const t = useT();
  const { lang } = useLanguage();
  const WORK_TASKS = WORK_TASKS_DATA[lang];
  const CAREER_MAP = CAREER_MAP_DATA[lang];

  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<string[] | null>(null);
  const MAX = 4;

  const toggle = (i: number) => {
    if (result) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) { next.delete(i); }
      else if (next.size < MAX) { next.add(i); }
      return next;
    });
  };

  const getResult = () => {
    const counts: Record<string, number> = {};
    selected.forEach((i) => {
      WORK_TASKS[i].careers.forEach((c) => { counts[c] = (counts[c] || 0) + 1; });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    setResult(sorted.slice(0, 3).map(([k]) => k));
  };

  const restart = () => { setSelected(new Set()); setResult(null); setStarted(false); };

  if (!started) return (
    <div className="text-center py-6">
      <div className="text-5xl mb-4">⚡</div>
      <h3 className="text-lg font-bold text-text-main mb-2">{t.styleTitle}</h3>
      <p className="text-sm text-muted mb-5">{t.styleDesc}</p>
      <button onClick={() => setStarted(true)}
        className="bg-purple-brand text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all">
        {t.gameStart}
      </button>
    </div>
  );

  if (result) {
    return (
      <div className="py-2">
        <p className="text-center text-sm font-semibold text-text-main mb-4">{t.gameBasedOnTasks}</p>
        <div className="space-y-2 mb-5">
          {result.map((key, i) => {
            const c = CAREER_MAP[key];
            if (!c) return null;
            return (
              <div key={key} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm ${c.color}`}>
                <span className="text-xl">{c.emoji}</span>
                <span>{c.label}</span>
                {i === 0 && <span className="ml-auto text-[11px] font-bold opacity-70">{t.gameBestFit}</span>}
              </div>
            );
          })}
        </div>
        <button onClick={restart}
          className="w-full border border-purple-brand text-purple-brand font-semibold py-2.5 rounded-xl hover:bg-purple-light transition-all text-sm">
          {t.gameTryAgain}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">{t.gameChoose4}</p>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all
          ${selected.size === MAX ? 'bg-purple-brand text-white' : 'bg-purple-light text-purple-brand'}`}>
          {selected.size} / {MAX}
        </span>
      </div>
      <div className="space-y-2 mb-4">
        {WORK_TASKS.map((task, i) => {
          const isSelected = selected.has(i);
          const isDisabled = !isSelected && selected.size >= MAX;
          return (
            <button key={i} onClick={() => toggle(i)} disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all border
                ${isSelected ? 'border-purple-brand bg-purple-light text-purple-brand font-semibold scale-[1.01]'
                  : isDisabled ? 'border-border bg-white text-muted opacity-40 cursor-not-allowed'
                  : 'border-border bg-white text-text-main hover:border-purple-brand hover:bg-purple-light'}`}>
              <span className="text-xl flex-shrink-0">{task.emoji}</span>
              <span>{task.label}</span>
              {isSelected && <span className="ml-auto text-purple-brand">✓</span>}
            </button>
          );
        })}
      </div>
      <button onClick={getResult} disabled={selected.size < MAX}
        className="w-full py-3 rounded-xl bg-purple-brand text-white font-semibold text-sm
          hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
        {selected.size < MAX ? t.gamePickMore(MAX - selected.size) : t.gamePickResult}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Обёртка — секция с тремя играми
// ══════════════════════════════════════════════════════════════
const GAMES_META = [
  { id: 'quiz',  icon: '🎯', color: 'bg-accent-light text-accent border-accent/20',               activeColor: 'bg-accent text-white',       component: <GameQuiz /> },
  { id: 'truth', icon: '✅', color: 'bg-green-light text-green-brand border-green-brand/20',      activeColor: 'bg-green-brand text-white',  component: <GameTruth /> },
  { id: 'style', icon: '⚡', color: 'bg-purple-light text-purple-brand border-purple-brand/20',  activeColor: 'bg-purple-brand text-white', component: <GameStyle /> },
];

function GamesSection() {
  const t = useT();
  const { ref, inView } = useInView();
  const [active, setActive] = useState<string | null>(null);

  const GAMES = [
    { ...GAMES_META[0], label: t.gameQuizLabel },
    { ...GAMES_META[1], label: t.gameTruthLabel },
    { ...GAMES_META[2], label: t.gameStyleLabel },
  ];

  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-amber-light text-amber-brand rounded-full px-4 py-2 mb-4">
          <span>🎮</span>
          <span className="text-[13px] font-semibold">{t.gamesLabel}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-2">{t.gamesTitle}</h2>
        <p className="text-muted text-sm max-w-md mx-auto">{t.gamesDesc}</p>
      </div>

      {/* Game tabs */}
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        {GAMES.map((g) => (
          <button key={g.id} onClick={() => setActive(active === g.id ? null : g.id)}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border font-semibold text-sm transition-all duration-200
              ${active === g.id ? g.activeColor + ' border-transparent shadow-lg scale-[1.02]' : g.color + ' hover:scale-[1.01]'}`}>
            <span className="text-2xl">{g.icon}</span>
            <span>{g.label}</span>
            <span className={`ml-auto transition-transform ${active === g.id ? 'rotate-180' : ''}`}>▾</span>
          </button>
        ))}
      </div>

      {/* Active game panel */}
      {active && (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-card animate-fade-up">
          {GAMES.find((g) => g.id === active)?.component}
        </div>
      )}
    </div>
  );
}

export default function ProfessionsPage({ careers, onBack, onGoSimulator, onGoHome }: ProfessionsPageProps) {
  const t = useT();
  const matchPcts = careers.map((_, i) => Math.max(35, 72 - i * 7));
  const headerRef = useInView();

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border animate-slide-down">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onGoHome} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <span className="text-accent font-bold text-lg">{t.brand}</span>
          </button>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <button onClick={onBack} className="hover:text-accent transition-colors">{t.profBackToResults}</button>
            <span className="text-accent font-semibold border-b-2 border-accent pb-0.5">{t.navExplore}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onGoHome}
              className="text-sm font-medium text-muted border border-border px-4 py-2 rounded-lg
                hover:border-accent hover:text-accent transition-all duration-200"
            >
              {t.profGoHome}
            </button>
          </div>
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
            <span className="text-[13px] font-semibold">{t.profHeaderBadge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main mb-4">
            {t.profHeaderTitle}
          </h1>
          <p className="text-[16px] text-muted max-w-md mx-auto leading-relaxed">
            {t.profHeaderDesc}
          </p>
        </div>

        {/* Stats row */}
        <div
          className={`grid grid-cols-3 gap-4 mb-10 transition-all duration-700 delay-200 ${headerRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {[
            { icon: '🎯', val: `${matchPcts[0]}%`, label: t.profBestMatch },
            { icon: '💼', val: `${careers.length}`, label: t.profCareersCount },
            { icon: '📈', val: `${Math.round(matchPcts.reduce((a, b) => a + b, 0) / matchPcts.length)}%`, label: t.profAvgMatch },
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

        {/* Divider */}
        <div className="my-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[12px] text-muted font-semibold uppercase tracking-widest">{t.profTestYourself}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Mini-games */}
        <GamesSection />

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-[13px] text-muted mb-4">{t.profWantToTest}</p>
          <button
            onClick={() => onGoSimulator(careers[0])}
            className="bg-gradient-to-r from-accent to-purple-brand text-white font-semibold px-8 py-4 rounded-xl
              hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-accent/25 text-[15px]"
          >
            {t.profLaunchSim}
          </button>
        </div>
      </div>
    </div>
  );
}
