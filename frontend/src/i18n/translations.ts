export type Lang = 'ru' | 'en' | 'ky';

type LangMeta = {
  flagSrc: string;
  name: string;
};

export const LANG_META: Record<Lang, { flagSrc: string; name: string }> = {
  ru: { flagSrc: '/flags/Ru.png', name: 'Русский' },
  en: { flagSrc: '/flags/En.png', name: 'English' },
  ky: { flagSrc: '/flags/Kg.png', name: 'Кыргызча' },
};


export const translations = {
  // ═══════════════════════════════════════════════════════════════════════════
  // РУССКИЙ
  // ═══════════════════════════════════════════════════════════════════════════
  ru: {
    // ─── Common / Nav ─────────────────────────────────────────────────────────
    brand: 'Tanda',
    brandTag: 'платформа',
    signIn: 'Войти',
    myResults: 'Мои результаты →',
    startPath: 'Начать путь →',
    restart: 'Пройти заново',
    backHome: '← На главную',

    // ─── Splash ───────────────────────────────────────────────────────────────
    splashTagline: 'Твой путь начинается здесь',
    splashSub: 'Карьерная диагностика для школьников КР',

    // ─── LandingPage — Nav ────────────────────────────────────────────────────
    navProfile: 'Профиль',
    navExplore: 'Исследование',
    navSimulator: 'Симулятор',

    // ─── LandingPage — Hero ───────────────────────────────────────────────────
    heroBadge: 'AI система самоопределения · КР',
    heroTitle1: 'Твой путь.',
    heroTitle2: 'Твоё будущее.',
    heroDesc: 'AI система карьерной самоопределения для школьников Кыргызстана — один тест, отбор профессий и прогноз будущего.',
    heroSimulation: 'Симуляция',
    heroHasResult: 'У тебя уже есть результат',
    heroHasResultSub: 'Посмотри снова или пройди заново',
    heroViewResult: 'Посмотреть результат →',
    stat1val: '1 200+', stat1label: 'участников',
    stat2val: '48',     stat2label: 'профессий',
    stat3val: 'RIASEC', stat3label: 'методология',

    cardTestDone: 'Тест пройден',
    cardResearcher: 'Исследователь',
    cardTopMatch: 'Топ совпадение',
    cardITdev: 'IT-разработчик',
    cardMatchPct: '84% совпадение',
    cardRiasecProfile: 'RIASEC профиль',

    // ─── Modules ──────────────────────────────────────────────────────────────
    sectionPlatform: 'Платформа',
    modulesTitle: 'Три модуля — один путь',
    modulesDesc: 'Последовательный маршрут, который ведёт тебя от самопознания к осознанному выбору',
    mod0icon: '👤', mod0title: 'Профиль',      mod0tag: 'Старт тут',
    mod0desc: 'Пройди тест из 36 вопросов и получи детальный карьерный профиль по RIASEC, ценностям и когнитивному стилю.',
    mod0stat: '36 вопросов · 20 мин',
    mod0btnResult: 'Смотреть результат →', mod0btnStart: 'Пройти тест →',
    mod1icon: '🔭', mod1title: 'Исследование', mod1tag: 'Найди профессию',
    mod1desc: 'Изучи топ-5 профессий, подходящих под твой профиль. Узнай зарплаты, вузы КР и требования ОРТ.',
    mod1stat: '10+ профессий',
    mod2icon: '🎮', mod2title: 'Симулятор',    mod2tag: 'Скоро',
    mod2desc: 'Проживи рабочий день в выбранной профессии. Прими реальные решения и оцени, твоё ли это призвание.',
    mod2stat: 'AI-симуляция',

    // ─── Steps ────────────────────────────────────────────────────────────────
    sectionHowItWorks: 'Как это работает',
    stepsTitle: 'Четыре шага к ясности',
    stepsDesc: 'Каждый шаг приближает тебя к осознанному карьерному пути',
    step0label: 'Профиль',      step0desc: 'Тест за 20 мин',
    step1label: 'Исследование', step1desc: 'Топ-5 профессий',
    step2label: 'Симулятор',    step2desc: 'Рабочий день',
    step3label: 'Решение',      step3desc: 'Твой план',

    // ─── Features ─────────────────────────────────────────────────────────────
    sectionAdvantages: 'Преимущества',
    featuresTitle: 'Создан для тебя',
    featuresDesc: 'Не просто тест, а инструмент, который учитывает твой контекст, культуру и возможности',
    feat0icon: '🔬', feat0title: 'Научный подход',
    feat0desc: 'Методики RIASEC (Holland), ценности Шварца и когнитивные стили Стернберга — проверенная база.',
    feat1icon: '🌐', feat1title: 'Локальный контекст',
    feat1desc: 'Данные о зарплатах, вузах КР, баллах ОРТ и рынке труда Кыргызстана — не абстрактные советы.',
    feat2icon: '📊', feat2title: 'Развёрнутый отчёт',
    feat2desc: 'Визуализация RIASEC-профиля, когнитивного стиля, ценностей и карьерных совпадений в одном отчёте.',
    feat3icon: '🤖', feat3title: 'AI рекомендации',
    feat3desc: 'Персональные инсайты на основе твоих ответов — понятным языком, без воды и шаблонов.',

    // ─── CTA ──────────────────────────────────────────────────────────────────
    ctaOnPath: 'Ты уже на пути',
    ctaHasResultTitle: 'У тебя уже есть результат 🎉',
    ctaHasResultDesc: 'Посмотри снова или пройди тест заново — иногда второй взгляд открывает новое.',
    ctaViewResult: 'Посмотреть результат →',
    ctaStartToday: 'Начни сегодня',
    ctaReadyTitle: 'Готов начать путь?',
    ctaReadyDesc: 'Тест занимает 20 минут. Результат — конкретные профессии, вузы и следующие шаги.',
    ctaStartFirst: 'Начать первую сессию →',

    // ─── Footer ───────────────────────────────────────────────────────────────
    footerTag: 'платформа карьерного самоопределения',
    footerCopy: 'Хакатон · Кыргызстан · 2026',

    // ─── TestPage ─────────────────────────────────────────────────────────────
    testBadge: 'Тест карьерного профиля',
    testMeta: (blockIdx: number, times: number[]) =>
      `36 вопросов · 4 блока · ~${times[blockIdx]} минут осталось`,
    testBlock: 'Блок', testAnswers: 'ответов',
    testNext: 'Следующий блок →', testFinish: 'Получить результат →',
    testAnswerAll: (answered: number, total: number) => `Ответь на все вопросы (${answered}/${total})`,
    testBack: '← Назад',
    testExitConfirm: 'Прогресс теста не сохранится. Выйти на главную?',

    // ─── Loading ──────────────────────────────────────────────────────────────
    loadingTitle: 'Анализируем твой профиль...',
    loadingDesc: 'Обрабатываем 36 ответов и подбираем профессии специально для тебя',

    // ─── Auth ─────────────────────────────────────────────────────────────────
    authPendingMsg: 'После входа результаты теста будут сохранены в твоём профиле',

    // ─── ResultsPage ──────────────────────────────────────────────────────────
    resultsReady: 'Твой карьерный профиль готов!',
    resultsHolland: 'RIASEC-код · Holland, 1997',
    resultsTabProfile: 'Профиль', resultsTabCareers: 'Профессии',
    resultsSaveBtn: 'Сохранить результаты',
    resultsRestartBtn: '↩ Заново', resultsRestartFull: '↩ Пройти тест заново',
    resultsInterestsTitle: 'Профиль интересов',
    resultsRiasecTitle: 'Детальный RIASEC',
    resultsCognTitle: 'Когнитивный профиль',
    resultsCogn0label: 'Стиль мышления', resultsCogn0analyt: 'Аналитический', resultsCogn0intuit: 'Интуитивный',
    resultsCogn1label: 'Обработка',       resultsCogn1system: 'Системный',      resultsCogn1holistic: 'Целостный',
    resultsCogn2label: 'Главная ценность', resultsCogn3label: 'Вторая ценность',
    resultsCogn4label: 'Ориентация',      resultsCogn4people: 'С людьми',       resultsCogn4things: 'С задачами',
    resultsCogn5label: 'Предпочтение',    resultsCogn5depth: 'Глубина',         resultsCogn5breadth: 'Широта',
    resultsCareersTitle: 'Профессии для тебя', resultsTop: 'Топ',
    resultsInsightsTitle: 'Персональные инсайты', resultsAiThinking: 'AI думает...',
    resultsBtnProfessions: 'Подробнее про профессии →', resultsBtnSimulator: '🎮 Симулятор →',
    riasecR: 'Реалистичный', riasecI: 'Исследователь', riasecA: 'Артистический',
    riasecS: 'Социальный',   riasecE: 'Предприимчивый', riasecC: 'Конвенциональный',

    // ─── ProfessionsPage ──────────────────────────────────────────────────────
    profBackToResults: '← Результаты', profGoHome: 'На главную',
    profHeaderBadge: 'Карьерное исследование', profHeaderTitle: 'Профессии для тебя',
    profHeaderDesc: 'Подобраны на основе твоего RIASEC-профиля, ценностей и когнитивного стиля',
    profMatch: 'совпадение', profSalary: 'Зарплата', profOrt: 'ОРТ', profUniversities: 'Вузы',
    profSimBtn: '🎮 Симулятор',

    // ─── SimulatorPage ────────────────────────────────────────────────────────
    simHeaderBadge: 'Карьерный симулятор',
    simDay: 'День', simOf: 'из', simStep: 'Шаг',
    simEnergy: 'Энергия', simStress: 'Стресс', simSkills: 'Навыки', simMood: 'Настроение',
    simChooseAction: 'Выберите действие',
    simBackToResults: '← Результаты', simBtnProfessions: 'Все профессии', simBtnHome: 'Главная',
    simCompletedTitle: 'Неделя завершена!', simCompletedDesc: 'Ты прожил рабочую неделю в профессии',
    simScoreTitle: 'Итоговый счёт', simFitLabel: 'Подходит ли тебе профессия?',
    simFitGood: 'Отлично подходит!', simFitOk: 'Неплохое совпадение', simFitBad: 'Возможно, не твоё',
    simRestartBtn: 'Пройти снова',
    simDayLabels: [
      'Первый день · Ориентация', 'Второй день · Первое задание',
      'Третий день · Командная работа', 'Четвёртый день · Нештатная ситуация',
      'Пятый день · Дедлайн', 'Шестой день · Обратная связь', 'Седьмой день · Итог недели',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ENGLISH
  // ═══════════════════════════════════════════════════════════════════════════
  en: {
    brand: 'Tanda', brandTag: 'platform',
    signIn: 'Sign In', myResults: 'My Results →', startPath: 'Get Started →',
    restart: 'Retake', backHome: '← Home',

    splashTagline: 'Your journey starts here',
    splashSub: 'Career guidance for students in Kyrgyzstan',

    navProfile: 'Profile', navExplore: 'Explore', navSimulator: 'Simulator',

    heroBadge: 'AI self-determination system · KG',
    heroTitle1: 'Your path.', heroTitle2: 'Your future.',
    heroDesc: 'AI career guidance system for students in Kyrgyzstan — one test, career matching and future forecast.',
    heroSimulation: 'Simulation',
    heroHasResult: 'You already have a result',
    heroHasResultSub: 'Review it or take the test again',
    heroViewResult: 'View Result →',
    stat1val: '1,200+', stat1label: 'participants',
    stat2val: '48',     stat2label: 'careers',
    stat3val: 'RIASEC', stat3label: 'methodology',

    cardTestDone: 'Test complete', cardResearcher: 'Investigative',
    cardTopMatch: 'Top match', cardITdev: 'Software Developer',
    cardMatchPct: '84% match', cardRiasecProfile: 'RIASEC profile',

    sectionPlatform: 'Platform',
    modulesTitle: 'Three modules — one path',
    modulesDesc: 'A step-by-step journey from self-discovery to a confident career choice',
    mod0icon: '👤', mod0title: 'Profile',  mod0tag: 'Start here',
    mod0desc: 'Take a 36-question test and get a detailed career profile based on RIASEC, values and cognitive style.',
    mod0stat: '36 questions · 20 min',
    mod0btnResult: 'View Result →', mod0btnStart: 'Take Test →',
    mod1icon: '🔭', mod1title: 'Explore', mod1tag: 'Find a career',
    mod1desc: 'Discover the top 5 careers that match your profile. Learn about salaries, universities and test requirements.',
    mod1stat: '10+ careers',
    mod2icon: '🎮', mod2title: 'Simulator', mod2tag: 'Coming soon',
    mod2desc: "Live a workday in your chosen career. Make real decisions and see if it's truly your calling.",
    mod2stat: 'AI simulation',

    sectionHowItWorks: 'How it works',
    stepsTitle: 'Four steps to clarity',
    stepsDesc: 'Each step brings you closer to a conscious career path',
    step0label: 'Profile',   step0desc: '20-min test',
    step1label: 'Explore',   step1desc: 'Top-5 careers',
    step2label: 'Simulator', step2desc: 'Work day',
    step3label: 'Decision',  step3desc: 'Your plan',

    sectionAdvantages: 'Advantages',
    featuresTitle: 'Built for you',
    featuresDesc: 'Not just a test — a tool that considers your context, culture and opportunities',
    feat0icon: '🔬', feat0title: 'Science-backed',
    feat0desc: 'RIASEC (Holland), Schwartz values and Sternberg cognitive styles — a validated framework.',
    feat1icon: '🌐', feat1title: 'Local context',
    feat1desc: 'Salary data, Kyrgyz universities, ORT scores and local job market — no abstract advice.',
    feat2icon: '📊', feat2title: 'Detailed report',
    feat2desc: 'RIASEC profile, cognitive style, values and career match visualised in one report.',
    feat3icon: '🤖', feat3title: 'AI recommendations',
    feat3desc: 'Personal insights based on your answers — clear and specific, no filler.',

    ctaOnPath: "You're already on your way",
    ctaHasResultTitle: 'You already have a result 🎉',
    ctaHasResultDesc: 'Review it again or retake the test — a second look often reveals something new.',
    ctaViewResult: 'View Result →',
    ctaStartToday: 'Start today',
    ctaReadyTitle: 'Ready to begin?',
    ctaReadyDesc: 'The test takes 20 minutes. The result — specific careers, universities and next steps.',
    ctaStartFirst: 'Start your first session →',

    footerTag: 'career guidance platform', footerCopy: 'Hackathon · Kyrgyzstan · 2026',

    testBadge: 'Career Profile Test',
    testMeta: (blockIdx: number, times: number[]) =>
      `36 questions · 4 blocks · ~${times[blockIdx]} min left`,
    testBlock: 'Block', testAnswers: 'answers',
    testNext: 'Next block →', testFinish: 'Get results →',
    testAnswerAll: (answered: number, total: number) => `Answer all questions (${answered}/${total})`,
    testBack: '← Back',
    testExitConfirm: 'Test progress will not be saved. Go to home?',

    loadingTitle: 'Analysing your profile...',
    loadingDesc: 'Processing 36 answers and selecting careers just for you',

    authPendingMsg: 'After signing in, your test results will be saved to your profile',

    resultsReady: 'Your career profile is ready!',
    resultsHolland: 'RIASEC code · Holland, 1997',
    resultsTabProfile: 'Profile', resultsTabCareers: 'Careers',
    resultsSaveBtn: 'Save Results',
    resultsRestartBtn: '↩ Retake', resultsRestartFull: '↩ Retake the test',
    resultsInterestsTitle: 'Interest profile',
    resultsRiasecTitle: 'Detailed RIASEC',
    resultsCognTitle: 'Cognitive profile',
    resultsCogn0label: 'Thinking style', resultsCogn0analyt: 'Analytical', resultsCogn0intuit: 'Intuitive',
    resultsCogn1label: 'Processing',     resultsCogn1system: 'Systematic',  resultsCogn1holistic: 'Holistic',
    resultsCogn2label: 'Primary value',  resultsCogn3label: 'Secondary value',
    resultsCogn4label: 'Orientation',    resultsCogn4people: 'People-oriented', resultsCogn4things: 'Task-oriented',
    resultsCogn5label: 'Preference',     resultsCogn5depth: 'Depth',            resultsCogn5breadth: 'Breadth',
    resultsCareersTitle: 'Careers for you', resultsTop: 'Top',
    resultsInsightsTitle: 'Personal insights', resultsAiThinking: 'AI thinking...',
    resultsBtnProfessions: 'Explore careers →', resultsBtnSimulator: '🎮 Simulator →',
    riasecR: 'Realistic', riasecI: 'Investigative', riasecA: 'Artistic',
    riasecS: 'Social',    riasecE: 'Enterprising',  riasecC: 'Conventional',

    profBackToResults: '← Results', profGoHome: 'Home',
    profHeaderBadge: 'Career Exploration', profHeaderTitle: 'Careers for you',
    profHeaderDesc: 'Matched based on your RIASEC profile, values and cognitive style',
    profMatch: 'match', profSalary: 'Salary', profOrt: 'ORT', profUniversities: 'Universities',
    profSimBtn: '🎮 Simulator',

    simHeaderBadge: 'Career Simulator',
    simDay: 'Day', simOf: 'of', simStep: 'Step',
    simEnergy: 'Energy', simStress: 'Stress', simSkills: 'Skills', simMood: 'Mood',
    simChooseAction: 'Choose an action',
    simBackToResults: '← Results', simBtnProfessions: 'All careers', simBtnHome: 'Home',
    simCompletedTitle: 'Week complete!', simCompletedDesc: "You've lived a work week in this career",
    simScoreTitle: 'Final score', simFitLabel: 'Is this career right for you?',
    simFitGood: 'Great fit!', simFitOk: 'Decent match', simFitBad: 'Maybe not for you',
    simRestartBtn: 'Try again',
    simDayLabels: [
      'Day 1 · Orientation', 'Day 2 · First task',
      'Day 3 · Teamwork', 'Day 4 · Unexpected situation',
      'Day 5 · Deadline', 'Day 6 · Feedback', 'Day 7 · Week wrap-up',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // КЫРГЫЗЧА
  // ═══════════════════════════════════════════════════════════════════════════
  ky: {
    brand: 'Tanda', brandTag: 'платформа',
    signIn: 'Кирүү', myResults: 'Менин жыйынтыктарым →', startPath: 'Жолду баштоо →',
    restart: 'Кайра тапшыруу', backHome: '← Башкы бет',

    splashTagline: 'Сенин жолун ушул жерден башталат',
    splashSub: 'Кыргызстандагы окуучулар үчүн мансаптык диагностика',

    navProfile: 'Профиль', navExplore: 'Изилдөө', navSimulator: 'Симулятор',

    heroBadge: 'AI өзүн-өзү аныктоо системасы · КР',
    heroTitle1: 'Сенин жолун.', heroTitle2: 'Сенин келечегиң.',
    heroDesc: 'Кыргызстандагы окуучулар үчүн AI мансаптык багыттоо системасы — бир тест, кесиптерди тандоо жана келечек болжолдоо.',
    heroSimulation: 'Симуляция',
    heroHasResult: 'Сенде жыйынтык бар',
    heroHasResultSub: 'Кайра карап же тест кайра тапшыр',
    heroViewResult: 'Жыйынтыкты көрүү →',
    stat1val: '1 200+', stat1label: 'катышуучу',
    stat2val: '48',     stat2label: 'кесип',
    stat3val: 'RIASEC', stat3label: 'методология',

    cardTestDone: 'Тест аяктады', cardResearcher: 'Изилдөөчү',
    cardTopMatch: 'Эң жакшы дал келүү', cardITdev: 'IT-иштеп чыгуучу',
    cardMatchPct: '84% дал келет', cardRiasecProfile: 'RIASEC профили',

    sectionPlatform: 'Платформа',
    modulesTitle: 'Үч модуль — бир жол',
    modulesDesc: 'Өзүңдү таануудан баштап, аң-сезимдүү тандоого чейин ырааттуу маршрут',
    mod0icon: '👤', mod0title: 'Профиль',   mod0tag: 'Башта ушул жерден',
    mod0desc: '36 суроодон турган тест тапшырып, RIASEC, баалуулуктар жана когнитивдик стиль боюнча кесиптик профиль ал.',
    mod0stat: '36 суроо · 20 мин',
    mod0btnResult: 'Жыйынтыкты көрүү →', mod0btnStart: 'Тест тапшыруу →',
    mod1icon: '🔭', mod1title: 'Изилдөө', mod1tag: 'Кесип тап',
    mod1desc: 'Профилиңе ылайык топ-5 кесипти изилде. КР университеттери, айлык акы жана ОРТ талаптарын бил.',
    mod1stat: '10+ кесип',
    mod2icon: '🎮', mod2title: 'Симулятор', mod2tag: 'Жакында',
    mod2desc: 'Тандаган кесибиңде иш күнүн жашоо. Чыныгы чечимдерди кабыл ал жана бул сенин чакырылышыңбы деп баала.',
    mod2stat: 'AI-симуляция',

    sectionHowItWorks: 'Бул кантип иштейт',
    stepsTitle: 'Айкындыкка төрт кадам',
    stepsDesc: 'Ар бир кадам сени аң-сезимдүү мансаптык жолго жакындатат',
    step0label: 'Профиль',   step0desc: '20 мин тест',
    step1label: 'Изилдөө',   step1desc: 'Топ-5 кесип',
    step2label: 'Симулятор', step2desc: 'Иш күнү',
    step3label: 'Чечим',     step3desc: 'Сенин планың',

    sectionAdvantages: 'Артыкчылыктар',
    featuresTitle: 'Сен үчүн жасалган',
    featuresDesc: 'Жөн гана тест эмес — контекстиңди, маданиятыңды жана мүмкүнчүлүктөрүңдү эске алган курал',
    feat0icon: '🔬', feat0title: 'Илимий ыкма',
    feat0desc: 'RIASEC (Holland), Шварцтын баалуулуктары жана Стернбергдин когнитивдик стилдери — текшерилген база.',
    feat1icon: '🌐', feat1title: 'Жергиликтүү контекст',
    feat1desc: 'КРдагы айлык акы, университеттер, ОРТ баллдары жана эмгек рыногу — абстрактуу кеңеш эмес.',
    feat2icon: '📊', feat2title: 'Кеңири отчёт',
    feat2desc: 'RIASEC-профили, когнитивдик стиль, баалуулуктар жана мансаптык дал келүүлөр бир отчётто.',
    feat3icon: '🤖', feat3title: 'AI сунуштары',
    feat3desc: 'Жоопторуңа негизделген жеке инсайттар — жөнөкөй тилде, ашыкча сөзсүз.',

    ctaOnPath: 'Сен буга чейин жолдо баратасың',
    ctaHasResultTitle: 'Сенде жыйынтык бар 🎉',
    ctaHasResultDesc: 'Кайра кароо же тест кайра тапшыруу — кээде экинчи карагандан жаңы нерсе ачылат.',
    ctaViewResult: 'Жыйынтыкты көрүү →',
    ctaStartToday: 'Бүгүн баштоо',
    ctaReadyTitle: 'Баштоого даярсыңбы?',
    ctaReadyDesc: 'Тест 20 мүнөт созулат. Жыйынтык — конкреттүү кесиптер, университеттер жана кийинки кадамдар.',
    ctaStartFirst: 'Биринчи сессияны баштоо →',

    footerTag: 'мансаптык багыттоо платформасы', footerCopy: 'Хакатон · Кыргызстан · 2026',

    testBadge: 'Мансаптык профиль тести',
    testMeta: (blockIdx: number, times: number[]) =>
      `36 суроо · 4 блок · ~${times[blockIdx]} мүнөт калды`,
    testBlock: 'Блок', testAnswers: 'жооп',
    testNext: 'Кийинки блок →', testFinish: 'Жыйынтык алуу →',
    testAnswerAll: (answered: number, total: number) => `Бардык суроолорго жооп бер (${answered}/${total})`,
    testBack: '← Артка',
    testExitConfirm: 'Тесттин жүрүшү сакталбайт. Башкы бетке чыгасыңбы?',

    loadingTitle: 'Профилиңди талдап жатабыз...',
    loadingDesc: '36 жоопту иштетип, сага атайын кесиптерди тандап жатабыз',

    authPendingMsg: 'Кире электен кийин, тест жыйынтыктары профилиңе сакталат',

    resultsReady: 'Мансаптык профилиң даяр!',
    resultsHolland: 'RIASEC-коду · Holland, 1997',
    resultsTabProfile: 'Профиль', resultsTabCareers: 'Кесиптер',
    resultsSaveBtn: 'Жыйынтыктарды сактоо',
    resultsRestartBtn: '↩ Кайра', resultsRestartFull: '↩ Тест кайра тапшыруу',
    resultsInterestsTitle: 'Кызыгуу профили',
    resultsRiasecTitle: 'Деталдуу RIASEC',
    resultsCognTitle: 'Когнитивдик профиль',
    resultsCogn0label: 'Ой жүгүртүү стили', resultsCogn0analyt: 'Аналитикалык', resultsCogn0intuit: 'Интуитивдик',
    resultsCogn1label: 'Иштетүү',            resultsCogn1system: 'Системалык',    resultsCogn1holistic: 'Жалпы',
    resultsCogn2label: 'Негизги баалуулук',  resultsCogn3label: 'Экинчи баалуулук',
    resultsCogn4label: 'Багыттоо',           resultsCogn4people: 'Адамдар менен', resultsCogn4things: 'Тапшырмалар менен',
    resultsCogn5label: 'Артыкчылык',         resultsCogn5depth: 'Тереңдик',       resultsCogn5breadth: 'Кеңдик',
    resultsCareersTitle: 'Сен үчүн кесиптер', resultsTop: 'Топ',
    resultsInsightsTitle: 'Жеке инсайттар', resultsAiThinking: 'AI ойлонуп жатат...',
    resultsBtnProfessions: 'Кесиптер боюнча кеңири →', resultsBtnSimulator: '🎮 Симулятор →',
    riasecR: 'Реалисттик', riasecI: 'Изилдөөчү', riasecA: 'Артисттик',
    riasecS: 'Социалдык',  riasecE: 'Ишкер',      riasecC: 'Конвенционалдык',

    profBackToResults: '← Жыйынтыктар', profGoHome: 'Башкы бет',
    profHeaderBadge: 'Кесипти изилдөө', profHeaderTitle: 'Сен үчүн кесиптер',
    profHeaderDesc: 'RIASEC-профилиң, баалуулуктарың жана когнитивдик стилиң боюнча тандалган',
    profMatch: 'дал келет', profSalary: 'Айлык акы', profOrt: 'ОРТ', profUniversities: 'Университеттер',
    profSimBtn: '🎮 Симулятор',

    simHeaderBadge: 'Мансаптык симулятор',
    simDay: 'Күн', simOf: 'дан', simStep: 'Кадам',
    simEnergy: 'Энергия', simStress: 'Стресс', simSkills: 'Көндүмдөр', simMood: 'Маанай',
    simChooseAction: 'Аракет тандоо',
    simBackToResults: '← Жыйынтыктар', simBtnProfessions: 'Бардык кесиптер', simBtnHome: 'Башкы бет',
    simCompletedTitle: 'Жума аяктады!', simCompletedDesc: 'Бул кесипте иш жумасын жашадың',
    simScoreTitle: 'Корутунду упай', simFitLabel: 'Бул кесип сага ылайыктуубу?',
    simFitGood: 'Эң сонун ылайык!', simFitOk: 'Жакшы дал келет', simFitBad: 'Балким сен үчүн эмес',
    simRestartBtn: 'Кайра өтүү',
    simDayLabels: [
      '1-күн · Багыттоо', '2-күн · Биринчи тапшырма',
      '3-күн · Команда иши', '4-күн · Күтүлбөгөн жагдай',
      '5-күн · Мөөнөт', '6-күн · Пикир', '7-күн · Жума корутундусу',
    ],
  },
} as const;

export type Translations = typeof translations['ru'];
