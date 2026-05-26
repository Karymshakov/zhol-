import type { Career } from '../types';

export const careers: Career[] = [
  {
    name: {
      ru: 'Разработчик программного обеспечения',
      en: 'Software Developer',
      ky: 'Программалык камсыздоо иштеп чыгуучусу',
    },
    riasec: ['I', 'R', 'C'],
    values: ['growth', 'autonomy'],
    thinking: 'analytical',
    why: {
      ru: 'Твой аналитический склад ума, интерес к исследованию и системному мышлению — идеальная основа для разработки. Высокий спрос в КР и возможность работать удалённо.',
      en: 'Your analytical mindset, curiosity and systematic thinking are ideal foundations for development. High demand in KG with options to work remotely.',
      ky: 'Аналитикалык ой жүгүртүүң, кызыгуу жана системалык ойлоо — иштеп чыгуу үчүн идеалдуу негиз. КРда жогорку суроо жана алыстан иштөө мүмкүнчүлүгү.',
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
      { ru: 'Высокий спрос',    en: 'High demand',   ky: 'Жогорку суроо' },
      { ru: 'Удалённая работа', en: 'Remote work',   ky: 'Алыстан иш' },
      { ru: 'Рост зарплаты',    en: 'Salary growth', ky: 'Айлык өсүмү' },
    ],
    universities: ['АУЦА', 'КГТУ им. Раззакова', 'Ош ГУ', 'КРСУ'],
  },
  {
    name: {
      ru: 'Врач / Медицинский работник',
      en: 'Doctor / Healthcare Professional',
      ky: 'Врач / Медициналык кызматкер',
    },
    riasec: ['S', 'I', 'R'],
    values: ['impact', 'security'],
    thinking: 'holistic',
    why: {
      ru: 'Желание помогать людям, стабильность и общественное признание — отличное совпадение. Профессия востребована во всех регионах КР.',
      en: 'A desire to help people, stability and social recognition — a great match. The profession is in demand across all regions of KG.',
      ky: 'Адамдарга жардам берүү каалоосу, туруктуулук жана коомдук таанылуу — жакшы дал келүү. Кесип КРдын бардык аймактарында суранычта.',
    },
    salary: {
      ru: '30 000–80 000 сом/мес',
      en: '30,000–80,000 KGS/month',
      ky: '30 000–80 000 сом/ай',
    },
    ort: {
      ru: 'Биология, Химия, Математика',
      en: 'Biology, Chemistry, Mathematics',
      ky: 'Биология, Химия, Математика',
    },
    tags: [
      { ru: 'Социальная значимость', en: 'Social impact', ky: 'Коомдук маани' },
      { ru: 'Стабильность',          en: 'Stability',     ky: 'Туруктуулук' },
      { ru: 'Весь КР',               en: 'All KG',        ky: 'Бүт КР' },
    ],
    universities: ['КГМА', 'ОшГМА', 'Международный медицинский факультет КРСУ'],
  },
  {
    name: {
      ru: 'Учитель / Преподаватель',
      en: 'Teacher / Educator',
      ky: 'Мугалим / Окутуучу',
    },
    riasec: ['S', 'A', 'E'],
    values: ['impact', 'recognition'],
    thinking: 'holistic',
    why: {
      ru: 'Если тебе важно влиять на людей, передавать знания и видеть результат своей работы — педагогика даёт это ежедневно. Острая нехватка учителей создаёт хорошие карьерные возможности.',
      en: 'If influencing people, sharing knowledge and seeing the results of your work matter to you — education delivers that every day. A critical shortage of teachers creates strong career opportunities.',
      ky: 'Эгер адамдарга таасир этүү, билимди берүү жана жумушуңдун натыйжасын көрүү маанилүү болсо — педагогика буны ар күнү берет. Мугалимдердин курч жетишпей жатышы жакшы мансаптык мүмкүнчүлүктөр жаратат.',
    },
    salary: {
      ru: '25 000–50 000 сом/мес',
      en: '25,000–50,000 KGS/month',
      ky: '25 000–50 000 сом/ай',
    },
    ort: {
      ru: 'Кыргызский язык, История, Русский язык',
      en: 'Kyrgyz, History, Russian',
      ky: 'Кыргыз тили, Тарых, Орус тили',
    },
    tags: [
      { ru: 'Социальная значимость',    en: 'Social impact',       ky: 'Коомдук маани' },
      { ru: 'Дефицитная профессия',     en: 'In-demand profession', ky: 'Жетишпей жаткан кесип' },
      { ru: 'Региональная мобильность', en: 'Regional mobility',   ky: 'Аймактык мобилдүүлүк' },
    ],
    universities: ['КНУ им. Баласагына', 'ОшГУ', 'ИГУ', 'Педагогический институт'],
  },
  {
    name: {
      ru: 'Дизайнер (графический / UX)',
      en: 'Designer (Graphic / UX)',
      ky: 'Дизайнер (графикалык / UX)',
    },
    riasec: ['A', 'I', 'E'],
    values: ['creativity', 'autonomy'],
    thinking: 'holistic',
    why: {
      ru: 'Твоё стремление к творческому самовыражению плюс системное мышление — редкое сочетание, которое ценится в дизайне. Растущий рынок в КР и возможность фриланса.',
      en: 'Your drive for creative self-expression combined with systematic thinking is a rare combination that design values. A growing market in KG with freelance options.',
      ky: 'Чыгармачылык өзүн-өзү туюндуруу жана системалык ойлоонун айкалышы — дизайнда баалуу сейрек кездешүүчү сапат. КРда өсүп жаткан рынок жана фриланс мүмкүнчүлүктөрү.',
    },
    salary: {
      ru: '40 000–100 000 сом/мес',
      en: '40,000–100,000 KGS/month',
      ky: '40 000–100 000 сом/ай',
    },
    ort: {
      ru: 'Математика (базовый)',
      en: 'Mathematics (basic)',
      ky: 'Математика (негизги)',
    },
    tags: [
      { ru: 'Творческая свобода',     en: 'Creative freedom',    ky: 'Чыгармачылык эркиндик' },
      { ru: 'Фриланс',                en: 'Freelance',           ky: 'Фриланс' },
      { ru: 'Международный рынок',    en: 'International market', ky: 'Эл аралык рынок' },
    ],
    universities: ['КГТУ Архитектура', 'Академия художеств КР', 'АУЦА'],
  },
  {
    name: {
      ru: 'Юрист / Правозащитник',
      en: 'Lawyer / Legal Advocate',
      ky: 'Юрист / Укуктук коргоочу',
    },
    riasec: ['E', 'S', 'C'],
    values: ['recognition', 'impact'],
    thinking: 'analytical',
    why: {
      ru: 'Сильные навыки убеждения, внимание к деталям и желание влиять на справедливость — хорошая основа. Высокая конкуренция, но также высокий социальный статус в КР.',
      en: 'Strong persuasion skills, attention to detail and a desire to influence justice — a solid foundation. High competition but also high social status in KG.',
      ky: 'Ынандыруу жөндөмдүүлүгү, деталдарга көңүл буруу жана адилеттикке таасир этүү каалоосу — жакшы негиз. КРда жогорку атаандашуу, бирок жогорку коомдук статус.',
    },
    salary: {
      ru: '35 000–120 000 сом/мес',
      en: '35,000–120,000 KGS/month',
      ky: '35 000–120 000 сом/ай',
    },
    ort: {
      ru: 'История, Кыргызский язык, Обществознание',
      en: 'History, Kyrgyz, Social Studies',
      ky: 'Тарых, Кыргыз тили, Коомтаануу',
    },
    tags: [
      { ru: 'Высокий статус',      en: 'High status',       ky: 'Жогорку статус' },
      { ru: 'Конкурентная сфера',  en: 'Competitive field', ky: 'Атаандаштуу чөйрө' },
      { ru: 'Государство и НКО',   en: 'Government & NGO',  ky: 'Мамлекет жана НКО' },
    ],
    universities: ['КНУ Юрфак', 'КРСУ Юрфак', 'Академия МВД КР'],
  },
  {
    name: {
      ru: 'Предприниматель / Управленец',
      en: 'Entrepreneur / Manager',
      ky: 'Ишкер / Башкаруучу',
    },
    riasec: ['E', 'C', 'I'],
    values: ['autonomy', 'growth', 'money'],
    thinking: 'holistic',
    why: {
      ru: 'Ты хочешь сам(а) принимать решения и видеть прямую связь между усилиями и результатом. Предпринимательство требует терпения, но даёт максимальную свободу.',
      en: 'You want to make your own decisions and see a direct link between effort and results. Entrepreneurship requires patience but offers maximum freedom.',
      ky: 'Сен өз чечимдериңди өзүң кабыл алгыңды жана аракет менен натыйжанын ортосундагы түздөн-түз байланышты көргүңдү каалайсың. Ишкердик сабырдуулукту талап кылат, бирок максималдуу эркиндик берет.',
    },
    salary: {
      ru: 'Переменная, от 0 до 500 000+ сом',
      en: 'Variable, 0 to 500,000+ KGS',
      ky: 'Өзгөрмөлүү, 0 дан 500 000+ сомго чейин',
    },
    ort: {
      ru: 'Математика, Обществознание',
      en: 'Mathematics, Social Studies',
      ky: 'Математика, Коомтаануу',
    },
    tags: [
      { ru: 'Максимальная автономия',   en: 'Maximum autonomy',   ky: 'Максималдуу автономия' },
      { ru: 'Высокий риск / доход',     en: 'High risk / reward', ky: 'Жогорку тобокел / киреше' },
      { ru: 'Любой город',              en: 'Any city',           ky: 'Каалаган шаар' },
    ],
    universities: ['АУЦА Бизнес', 'КРСУ МВА', 'АУМ КР'],
  },
  {
    name: {
      ru: 'Журналист / Медиаспециалист',
      en: 'Journalist / Media Specialist',
      ky: 'Журналист / Медиа адис',
    },
    riasec: ['A', 'S', 'E'],
    values: ['creativity', 'impact'],
    thinking: 'intuitive',
    why: {
      ru: 'Если тебе важно рассказывать истории, влиять на общественное мнение и работать с людьми — медиа предоставляет эту возможность. Цифровые медиа в КР активно развиваются.',
      en: 'If storytelling, influencing public opinion and working with people matter to you — media provides that opportunity. Digital media in KG is actively growing.',
      ky: 'Эгер истории айтып берүү, коомдук пикирге таасир этүү жана адамдар менен иштөө маанилүү болсо — медиа бул мүмкүнчүлүктү берет. КРдагы санариптик медиа активдүү өсүп жатат.',
    },
    salary: {
      ru: '25 000–70 000 сом/мес',
      en: '25,000–70,000 KGS/month',
      ky: '25 000–70 000 сом/ай',
    },
    ort: {
      ru: 'Кыргызский язык, Русский язык',
      en: 'Kyrgyz, Russian',
      ky: 'Кыргыз тили, Орус тили',
    },
    tags: [
      { ru: 'Творчество',       en: 'Creativity',       ky: 'Чыгармачылык' },
      { ru: 'Социальное влияние', en: 'Social influence', ky: 'Коомдук таасир' },
      { ru: 'Бишкек',           en: 'Bishkek',          ky: 'Бишкек' },
    ],
    universities: ['КНУ Факультет журналистики', 'КРСУ', 'МУК'],
  },
  {
    name: {
      ru: 'Экономист / Финансовый аналитик',
      en: 'Economist / Financial Analyst',
      ky: 'Экономист / Каржы аналитиги',
    },
    riasec: ['C', 'I', 'E'],
    values: ['money', 'security'],
    thinking: 'analytical',
    why: {
      ru: 'Точность, аналитика и работа с числами — твоя стихия. Финансовая грамотность в КР ценится всё больше как в госсекторе, так и в банках.',
      en: 'Accuracy, analytics and working with numbers are your element. Financial literacy in KG is increasingly valued in both the public sector and banks.',
      ky: 'Так болуу, аналитика жана сандар менен иштөө сенин стихияң. КРда каржылык сабаттуулук мамлекеттик секторда да, банктарда да барган сайын баалана баштады.',
    },
    salary: {
      ru: '40 000–100 000 сом/мес',
      en: '40,000–100,000 KGS/month',
      ky: '40 000–100 000 сом/ай',
    },
    ort: {
      ru: 'Математика, Обществознание',
      en: 'Mathematics, Social Studies',
      ky: 'Математика, Коомтаануу',
    },
    tags: [
      { ru: 'Стабильный рынок',     en: 'Stable market',        ky: 'Туруктуу рынок' },
      { ru: 'Государство и бизнес', en: 'Government & business', ky: 'Мамлекет жана бизнес' },
      { ru: 'Рост зарплаты',        en: 'Salary growth',        ky: 'Айлык өсүмү' },
    ],
    universities: ['КГЭУ', 'БГУ Экономика', 'АУЦА', 'КРСУ'],
  },
  {
    name: {
      ru: 'Агроном / Специалист в сельском хозяйстве',
      en: 'Agronomist / Agricultural Specialist',
      ky: 'Агроном / Айыл чарба адиси',
    },
    riasec: ['R', 'I', 'C'],
    values: ['impact', 'security'],
    thinking: 'systematic',
    why: {
      ru: 'Если тебе близка природа, конкретный результат и работа, важная для страны — агрономия недооценена, но критически важна для экономики КР. Государственная поддержка отрасли.',
      en: 'If you connect with nature, tangible results and work that matters for the country — agronomy is undervalued but critically important for KG\'s economy. Government support for the sector.',
      ky: 'Эгер табигат, конкреттүү натыйжа жана өлкө үчүн маанилүү иш жакын болсо — агрономия баасыздандырылган, бирок КРдын экономикасы үчүн маанилүү. Тармактын мамлекеттик колдоосу бар.',
    },
    salary: {
      ru: '25 000–60 000 сом/мес',
      en: '25,000–60,000 KGS/month',
      ky: '25 000–60 000 сом/ай',
    },
    ort: {
      ru: 'Биология, Химия',
      en: 'Biology, Chemistry',
      ky: 'Биология, Химия',
    },
    tags: [
      { ru: 'Стратегическая отрасль', en: 'Strategic sector',  ky: 'Стратегиялык тармак' },
      { ru: 'Весь КР',                en: 'All KG',            ky: 'Бүт КР' },
      { ru: 'Гранты и поддержка',     en: 'Grants & support',  ky: 'Гранттар жана колдоо' },
    ],
    universities: ['КГАУ', 'Ошский технологический университет', 'Аграрный факультет ИГУ'],
  },
  {
    name: {
      ru: 'Психолог / Социальный работник',
      en: 'Psychologist / Social Worker',
      ky: 'Психолог / Социалдык иш кызматкери',
    },
    riasec: ['S', 'A', 'I'],
    values: ['impact', 'growth'],
    thinking: 'holistic',
    why: {
      ru: 'Желание понять людей, помочь им и видеть внутреннее изменение — психология даёт это каждый день. Дефицитная профессия в КР с растущим спросом.',
      en: 'The desire to understand people, help them and witness inner change — psychology provides that every day. An in-demand profession in KG with growing demand.',
      ky: 'Адамдарды түшүнүү, аларга жардам берүү жана ички өзгөрүүнү байкоо каалоосу — психология буну ар күнү берет. КРда адистердин курч жетишпегендиги жана суроонун өсүшү.',
    },
    salary: {
      ru: '25 000–70 000 сом/мес',
      en: '25,000–70,000 KGS/month',
      ky: '25 000–70 000 сом/ай',
    },
    ort: {
      ru: 'Биология, История',
      en: 'Biology, History',
      ky: 'Биология, Тарых',
    },
    tags: [
      { ru: 'Острая нехватка специалистов', en: 'Acute specialist shortage', ky: 'Адистердин курч жетишпегендиги' },
      { ru: 'Растущий спрос',               en: 'Growing demand',            ky: 'Өсүп жаткан суроо' },
      { ru: 'НКО и госсектор',              en: 'NGO & public sector',       ky: 'НКО жана мамлекеттик сектор' },
    ],
    universities: ['КНУ Психфак', 'КРСУ', 'Бишкекский гуманитарный ун-т'],
  },
];
