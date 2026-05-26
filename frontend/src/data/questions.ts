import type { Block } from '../types';

export const blocks: Block[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // BLOCK 1 — Interests & Activities
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 1,
    title: {
      ru: 'Блок 1. Интересы и деятельность',
      en: 'Block 1. Interests & Activities',
      ky: '1-блок. Кызыгуулар жана иш-аракеттер',
    },
    desc: {
      ru: 'Какие занятия тебя по-настоящему захватывают? Основано на RIASEC (Holland, 1997) — самой валидированной модели карьерных интересов.',
      en: 'What activities truly engage you? Based on RIASEC (Holland, 1997) — the most validated career interest model.',
      ky: 'Кандай иш-аракеттер сени чынында эле кызыктырат? RIASEC (Holland, 1997) негизинде — мансаптык кызыгуулардын эң ырасталган моделине ылайык.',
    },
    count: {
      ru: 'Вопросы 1–12',
      en: 'Questions 1–12',
      ky: '1–12 суроолор',
    },
    icon: '🎯',
    color: '#e8f0eb',
    doneTitle: {
      ru: '✓ Блок 1 завершён!',
      en: '✓ Block 1 complete!',
      ky: '✓ 1-блок аяктады!',
    },
    doneText: {
      ru: 'Уже виден свой базовый тип интересов. Следующий блок выяснит, что для тебя важно в работе.',
      en: 'Your basic interest type is already visible. The next block will explore what matters most to you at work.',
      ky: 'Негизги кызыгуу түрүң буга чейин эле белгилүү болуп жатат. Кийинки блок жумушта сага эмне маанилүү экенин аныктайт.',
    },
    questions: [
      {
        id: 'q1', type: 'choice',
        text: {
          ru: 'Если бы тебе нужно было провести один день с пользой, что ты выбрал(а) бы охотнее?',
          en: 'If you had to spend one day productively, which would you choose?',
          ky: 'Бир күндү пайдалуу өткөрүшүң керек болсо, эмнени тандайт элең?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Разобрать сломанный механизм — велосипед, технику, мебель — и починить его своими руками',
            en: 'Take apart a broken mechanism — a bicycle, tech, furniture — and fix it with your own hands',
            ky: 'Сынган механизмди — велосипедти, техниканы, мебелди — бузуп, колу менен оңдоо',
          },
          scores: { R: 2 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Изучить, почему этот механизм вообще работает — найти статьи, разобраться в принципах',
            en: 'Study how that mechanism actually works — find articles, understand the principles',
            ky: 'Бул механизм кантип иштеп жаткандыгын изилдөө — макалаларды тапкан, принциптерин түшүнгөн',
          },
          scores: { I: 2 },
        },
      },
      {
        id: 'q2', type: 'choice',
        text: {
          ru: 'Какой тип задачи тебе ближе?',
          en: 'Which type of task is more appealing to you?',
          ky: 'Кайсы тапшырма түрү сага жакыныраак?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Нарисовать, снять видео или написать текст — создать что-то, что можно показать другим',
            en: 'Draw, film a video or write a text — create something you can show others',
            ky: 'Сурот тарткан, видео тарткан же текст жазган — башкаларга көрсөтө тургандай бир нерсе жаратуу',
          },
          scores: { A: 2 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Помочь однокласснику разобраться в теме, которую он не понимает — объяснить, поддержать',
            en: 'Help a classmate understand a topic they\'re struggling with — explain, support',
            ky: 'Синиптешке түшүнүксүз теманы түшүндүрүп берүү — чечмелеп, колдоп',
          },
          scores: { S: 2 },
        },
      },
      {
        id: 'q3', type: 'choice',
        text: {
          ru: 'В школьном проекте тебе предлагают выбрать роль:',
          en: 'In a school project, you are offered to choose a role:',
          ky: 'Мектеп долбоорунда сага роль тандоо сунушталат:',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Лидер — ты распределяешь задачи, ведёшь переговоры с учителем, представляешь результат классу',
            en: 'Leader — you assign tasks, negotiate with the teacher, present the result to the class',
            ky: 'Лидер — тапшырмаларды бөлгөн, мугалим менен сүйлөшкөн, натыйжаны класска тапшырган',
          },
          scores: { E: 2 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Организатор — ты следишь за дедлайнами, ведёшь таблицы, проверяешь, всё ли сделано правильно',
            en: 'Organiser — you track deadlines, maintain tables, check that everything is done correctly',
            ky: 'Уюштуруучу — мөөнөттөрдү байкаган, таблицаларды жүргүзгөн, баары туура жасалганын текшерген',
          },
          scores: { C: 2 },
        },
      },
      {
        id: 'q4', type: 'likert5',
        text: {
          ru: 'Когда я занимаюсь чем-то физическим — строю, конструирую, работаю руками — я чувствую настоящее удовлетворение.',
          en: 'When I do something physical — build, construct, work with my hands — I feel true satisfaction.',
          ky: 'Бир нерсени физикалык жасаганда — куруп, конструкциялап, кол менен иштегенде — мен чыныгы канааттануу сезем.',
        },
        scores: { R: 1 },
      },
      {
        id: 'q5', type: 'likert5',
        text: {
          ru: 'Мне нравится разбираться в сложных вопросах — читать, исследовать, искать закономерности — даже если никто этого не требует.',
          en: 'I enjoy working through complex questions — reading, researching, looking for patterns — even when nobody asks me to.',
          ky: 'Татаал суроолорду изилдегенди жактырам — окуп, изилдеп, мыйзам ченемдерин издеп — бул эч ким талап кылбаса да.',
        },
        scores: { I: 1 },
      },
      {
        id: 'q6', type: 'likert5',
        text: {
          ru: 'Я замечаю красоту в деталях — в музыке, дизайне, кино или архитектуре — и хочу сам(а) что-то создавать.',
          en: 'I notice beauty in details — in music, design, film or architecture — and want to create something myself.',
          ky: 'Мен деталдарда сулуулукту байкайм — музыкада, дизайнда, кинодо же архитектурада — жана өзүм бир нерсе жаратгым келет.',
        },
        scores: { A: 1 },
      },
      {
        id: 'q7', type: 'likert5',
        text: {
          ru: 'Мне важно помогать другим людям — объяснять, поддерживать, работать в команде ради общего результата.',
          en: 'It\'s important for me to help other people — explain, support, work as a team towards a shared result.',
          ky: 'Башка адамдарга жардам берүү маанилүү — чечмелеп, колдоп, жалпы натыйжага жетүү үчүн командада иштеп.',
        },
        scores: { S: 1 },
      },
      {
        id: 'q8', type: 'likert5',
        text: {
          ru: 'Мне нравится убеждать людей, вести за собой и брать ответственность за общий результат.',
          en: 'I enjoy convincing people, leading others and taking responsibility for a shared outcome.',
          ky: 'Адамдарды ынандырган, алардын алдында жүргөн жана жалпы натыйжа үчүн жоопкерчилик алган.',
        },
        scores: { E: 1 },
      },
      {
        id: 'q9', type: 'likert5',
        text: {
          ru: 'Я чувствую себя комфортно, когда есть чёткие правила, инструкции и порядок — мне нравится работать с цифрами, таблицами, системами.',
          en: 'I feel comfortable when there are clear rules, instructions and order — I enjoy working with numbers, tables and systems.',
          ky: 'Аниктеме эрежелер, нускамалар жана тартип болгондо өзүмдү жайлуу сезем — сандар, таблицалар, системалар менен иштегенди жактырам.',
        },
        scores: { C: 1 },
      },
      {
        id: 'q10', type: 'choice',
        text: {
          ru: 'Тебе предлагают две внеклассные активности на выбор:',
          en: 'You are offered two extracurricular activities to choose from:',
          ky: 'Сага эки окуудан тышкаркы иш тандоо сунушталат:',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Участвовать в олимпиаде по математике или физике — решать нестандартные задачи',
            en: 'Participate in a maths or physics olympiad — solve non-standard problems',
            ky: 'Математика же физика олимпиадасына катышуу — стандарттык эмес масалаларды чечүү',
          },
          scores: { I: 2 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Стать организатором школьного мероприятия — договариваться, управлять, убеждать',
            en: 'Become the organiser of a school event — negotiate, manage, persuade',
            ky: 'Мектеп иш-чарасынын уюштуруучусу болуу — макулдашуу, башкаруу, ынандыруу',
          },
          scores: { E: 2 },
        },
      },
      {
        id: 'q11', type: 'choice',
        text: {
          ru: 'Какое из этих занятий тебе было бы интереснее всего попробовать в реальной жизни?',
          en: 'Which of these activities would you most like to try in real life?',
          ky: 'Кайсы иш-аракетти реал жашоодо сынап көргүңүз келет эле?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Написать и опубликовать свою историю, снять короткий фильм или создать свой дизайн-продукт',
            en: 'Write and publish your own story, shoot a short film or create your own design product',
            ky: 'Өзүнүн тарыхын жазып жарыялоо, кыска фильм тартуу же өз дизайн продуктусун жаратуу',
          },
          scores: { A: 2 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Вести учёт бюджета для школьного клуба, составить расписание или заполнять отчёты',
            en: 'Keep the budget for a school club, draw up a schedule or complete reports',
            ky: 'Мектеп клубунун бюджетин эсептеп жүргүзүү, расписание түзүү же отчёттор толтуруу',
          },
          scores: { C: 2 },
        },
      },
      {
        id: 'q12', type: 'choice',
        text: {
          ru: 'Когда ты думаешь о работе мечты, что для тебя важнее?',
          en: 'When you think of your dream job, what matters more to you?',
          ky: 'Кыялыңдагы жумушту ойлогондо, сага эмне маанилүүрөк?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Работать с людьми каждый день — учить, лечить, помогать, консультировать',
            en: 'Working with people every day — teaching, treating, helping, consulting',
            ky: 'Ар күнү адамдар менен иштөө — окутуу, дарылоо, жардам берүү, консультация берүү',
          },
          scores: { S: 2 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Работать с инструментами, природой, техникой или физическими объектами',
            en: 'Working with tools, nature, technology or physical objects',
            ky: 'Куралдар, табигат, техника же физикалык объекттер менен иштөө',
          },
          scores: { R: 2 },
        },
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BLOCK 2 — Values & Motivation
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 2,
    title: {
      ru: 'Блок 2. Ценности и мотивация',
      en: 'Block 2. Values & Motivation',
      ky: '2-блок. Баалуулуктар жана мотивация',
    },
    desc: {
      ru: 'Что для тебя главное в работе? Основано на Work Values Inventory (Super, 1970) и теории самодетерминации (Deci & Ryan, 2000).',
      en: 'What matters most to you at work? Based on the Work Values Inventory (Super, 1970) and self-determination theory (Deci & Ryan, 2000).',
      ky: 'Жумушта сага эмне эң маанилүү? Work Values Inventory (Super, 1970) жана өзүн-өзү аныктоо теориясына (Deci & Ryan, 2000) негизделген.',
    },
    count: {
      ru: 'Вопросы 13–24',
      en: 'Questions 13–24',
      ky: '13–24 суроолор',
    },
    icon: '💎',
    color: '#eeecf8',
    doneTitle: {
      ru: '✓ Блок 2 завершён!',
      en: '✓ Block 2 complete!',
      ky: '✓ 2-блок аяктады!',
    },
    doneText: {
      ru: 'Теперь ясно, что тебя мотивирует. Третий блок поможет понять, как ты думаешь и принимаешь решения.',
      en: 'Now it\'s clear what motivates you. The third block will help understand how you think and make decisions.',
      ky: 'Эмне сени мотивациялаары азыр белгилүү болду. Үчүнчү блок кантип ойлоп, чечим кабыл алганыңды түшүнүүгө жардам берет.',
    },
    questions: [
      {
        id: 'q13', type: 'rank',
        text: {
          ru: 'Выбери 3 самых важных для тебя качества работы (нажимай по очереди — 1-е, 2-е, 3-е место):',
          en: 'Choose the 3 most important qualities of work for you (click in order — 1st, 2nd, 3rd place):',
          ky: 'Жумуштун сен үчүн эң маанилүү 3 сапатын тандоо (кезегинен жана чык — 1-орун, 2-орун, 3-орун):',
        },
        options: [
          { text: { ru: 'Автономия — свобода принимать решения самому(ой)', en: 'Autonomy — freedom to make decisions on your own', ky: 'Автономия — өзүңдүн чечим кабыл алуу эркиндиги' }, val: 'autonomy' },
          { text: { ru: 'Влияние — моя работа реально меняет мир или жизни людей', en: 'Impact — my work genuinely changes the world or people\'s lives', ky: 'Таасир — менин жумушум дүйнөнү же адамдардын жашоосун чынында өзгөртөт' }, val: 'impact' },
          { text: { ru: 'Творчество — я могу создавать новое, выражать себя', en: 'Creativity — I can create something new, express myself', ky: 'Чыгармачылык — мен жаңы нерсе жарата алам, өзүмдү туюндурам' }, val: 'creativity' },
          { text: { ru: 'Стабильность — постоянный доход, безопасность, предсказуемость', en: 'Stability — steady income, security, predictability', ky: 'Туруктуулук — туруктуу киреше, коопсуздук, алдын ала аныктуулук' }, val: 'security' },
          { text: { ru: 'Признание — меня замечают, ценят, я получаю статус', en: 'Recognition — I am noticed, valued, I gain status', ky: 'Таанылуу — мени байкашат, баалашат, мен статус алам' }, val: 'recognition' },
          { text: { ru: 'Развитие — я постоянно учусь, расту, осваиваю новое', en: 'Growth — I am constantly learning, developing, mastering new things', ky: 'Өнүгүү — мен дайыма үйрөнүп, өнүгүп, жаңыны өздөштүрүп жатам' }, val: 'growth' },
        ],
        scores: {},
      },
      {
        id: 'q14', type: 'choice',
        text: {
          ru: 'Представь: тебе предлагают два места работы. Зарплата одинаковая. Что выбираешь?',
          en: 'Imagine: you are offered two job opportunities. The salary is the same. Which do you choose?',
          ky: 'Элестет: сага эки жумуш орду сунушталат. Айлык бирдей. Эмнени тандайсың?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Работа в крупной стабильной организации с чёткими правилами и карьерной лестницей',
            en: 'A large stable organisation with clear rules and a career ladder',
            ky: 'Аниктеме эрежелер жана карьера тепкичи бар ири туруктуу уюм',
          },
          scores: { security: 1, structure: 1 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Небольшая команда с неопределённостью, но возможностью влиять на всё и расти быстрее',
            en: 'A small team with uncertainty, but the ability to influence everything and grow faster',
            ky: 'Анык эместик бар, бирок баарына таасир этүүгө жана тезирээк өсүүгө мүмкүнчүлүгү бар кичинекей команда',
          },
          scores: { autonomy: 1, growth: 1 },
        },
      },
      {
        id: 'q15', type: 'likert5',
        text: {
          ru: 'Для меня важно, чтобы моя работа приносила очевидную пользу обществу — а не просто зарабатывала деньги.',
          en: 'It\'s important to me that my work brings obvious benefit to society — not just earns money.',
          ky: 'Менин жумушум коомго ачык пайда алып келиши маанилүү — акча эле тапканы эмес.',
        },
        scores: { impact: 1 },
      },
      {
        id: 'q16', type: 'likert5',
        text: {
          ru: 'Финансовое вознаграждение — один из главных факторов при выборе профессии для меня.',
          en: 'Financial reward is one of the main factors when choosing a profession for me.',
          ky: 'Каржылык сыйакы — мен үчүн кесип тандоодогу негизги факторлордун бири.',
        },
        scores: { money: 1 },
      },
      {
        id: 'q17', type: 'likert5',
        text: {
          ru: 'Мне важно, чтобы работа давала возможность постоянно учиться — осваивать новые навыки, решать нестандартные задачи.',
          en: 'It\'s important to me that work gives the opportunity to continuously learn — to master new skills, solve non-standard tasks.',
          ky: 'Жумуш дайыма үйрөнүүгө мүмкүнчүлүк берши маанилүү — жаңы көндүмдөрдү өздөштүрүп, стандарттык эмес масалаларды чечүү.',
        },
        scores: { growth: 1 },
      },
      {
        id: 'q18', type: 'choice',
        text: {
          ru: 'Что для тебя важнее в командной работе?',
          en: 'What matters more to you in teamwork?',
          ky: 'Командалык иште сага эмне маанилүүрөк?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Хорошие отношения с коллегами, атмосфера взаимной поддержки и доверия',
            en: 'Good relationships with colleagues, an atmosphere of mutual support and trust',
            ky: 'Кесиптештер менен жакшы мамиле, өз ара колдоо жана ишеним атмосферасы',
          },
          scores: { S: 1, people: 1 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Высокая эффективность команды — чёткие роли, результат, профессионализм',
            en: 'High team efficiency — clear roles, results, professionalism',
            ky: 'Командадан жогорку натыйжалуулук — аниктеме ролдор, натыйжа, кесипкөйлүк',
          },
          scores: { structure: 1, E: 1 },
        },
      },
      {
        id: 'q19', type: 'choice',
        text: {
          ru: 'Если бы тебе пришлось выбирать работу на ближайшие 5 лет, что важнее?',
          en: 'If you had to choose a job for the next 5 years, what matters more?',
          ky: 'Эгер кийинки 5 жыл үчүн жумуш тандашың керек болсо, эмне маанилүүрөк?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Быть экспертом в своей области — глубоко знать одну сферу',
            en: 'Being an expert in your field — deeply knowing one area',
            ky: 'Өз тармагыңдагы эксперт болуу — бир чөйрөнү терең билүү',
          },
          scores: { I: 1, depth: 1 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Быть универсалом — разбираться во многих областях, быть гибким',
            en: 'Being a generalist — understanding many areas, being flexible',
            ky: 'Универсал болуу — көп тармакты түшүнүп, ийкемдүү болуу',
          },
          scores: { A: 1, breadth: 1 },
        },
      },
      {
        id: 'q20', type: 'likert5',
        text: {
          ru: 'Мне важно иметь гибкий график и возможность работать там, где я хочу — офис с 9 до 18 меня бы угнетал.',
          en: 'It\'s important to me to have a flexible schedule and the ability to work wherever I want — an office 9-to-5 would oppress me.',
          ky: 'Ийкемдүү иш графигине жана каалаган жерде иштөөгө мүмкүнчүлүк болушу маанилүү — 9дан 18ге чейин кеңседе иштөө мени мыжыгат эле.',
        },
        scores: { autonomy: 1 },
      },
      {
        id: 'q21', type: 'likert5',
        text: {
          ru: 'Общественное признание и уважение коллег — значимая часть того, чего я хочу достичь в карьере.',
          en: 'Public recognition and the respect of colleagues is a significant part of what I want to achieve in my career.',
          ky: 'Коомдук таанылуу жана кесиптештердин урматы — карьерада жетишкиңи келгеннин маанилүү бөлүгү.',
        },
        scores: { recognition: 1 },
      },
      {
        id: 'q22', type: 'choice',
        text: {
          ru: 'В какой из ситуаций ты чувствовал(а) бы себя наиболее реализованным(ой)?',
          en: 'In which situation would you feel most fulfilled?',
          ky: 'Кайсы жагдайда өзүңдү эң реализованный сезет элең?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Ты придумал(а) и реализовал(а) что-то с нуля — свой проект, свою идею',
            en: 'You thought up and implemented something from scratch — your own project, your own idea',
            ky: 'Нөлдөн бир нерсени ойлоп тапкан жана ишке ашырган — өз долбоорун, өз идеясын',
          },
          scores: { creativity: 1, A: 1 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Ты помог(ла) человеку решить трудную проблему и видишь, что ему стало лучше',
            en: 'You helped a person solve a difficult problem and you can see they are better off',
            ky: 'Адамга кыйын маселени чечүүгө жардам берген жана анын жакшырганын көрүп жатасың',
          },
          scores: { impact: 1, S: 1 },
        },
      },
      {
        id: 'q23', type: 'likert5',
        text: {
          ru: 'Мне важно, чтобы работа имела чёткую структуру — я знаю, что делать и как оценивается результат.',
          en: 'It\'s important to me that work has a clear structure — I know what to do and how the result is evaluated.',
          ky: 'Жумуш аниктеме структурага ие болушу маанилүү — эмне кылышым керек жана натыйжа кантип бааланарын билем.',
        },
        scores: { structure: 1, C: 1 },
      },
      {
        id: 'q24', type: 'likert5',
        text: {
          ru: 'Я готов(а) взять на себя больше ответственности — вести проект, команду — если это даст больше свободы и влияния.',
          en: 'I\'m ready to take on more responsibility — lead a project, a team — if this gives more freedom and influence.',
          ky: 'Көбүрөөк жоопкерчилик алууга даармын — долбоорду, командaны жетектөөгө — эгер бул дагы эркиндик жана таасир берсе.',
        },
        scores: { autonomy: 1, E: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BLOCK 3 — Thinking Style
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 3,
    title: {
      ru: 'Блок 3. Стиль мышления',
      en: 'Block 3. Thinking Style',
      ky: '3-блок. Ой жүгүртүү стили',
    },
    desc: {
      ru: 'Как ты думаешь, принимаешь решения и обрабатываешь информацию? Основано на когнитивных исследованиях (Sternberg, 1999; Riding & Cheema, 1991).',
      en: 'How do you think, make decisions and process information? Based on cognitive research (Sternberg, 1999; Riding & Cheema, 1991).',
      ky: 'Кантип ойлойсуң, чечим кабыл алат жана маалыматты иштетесиң? Когнитивдик изилдөөлөргө негизделген (Sternberg, 1999; Riding & Cheema, 1991).',
    },
    count: {
      ru: 'Вопросы 25–32',
      en: 'Questions 25–32',
      ky: '25–32 суроолор',
    },
    icon: '🧠',
    color: '#e8f0f8',
    doneTitle: {
      ru: '✓ Блок 3 завершён!',
      en: '✓ Block 3 complete!',
      ky: '✓ 3-блок аяктады!',
    },
    doneText: {
      ru: 'Отлично! Теперь понятен свой когнитивный стиль. Последний блок — о твоём контексте и предпочтениях.',
      en: 'Your cognitive style is now clear. The last block is about your context and preferences.',
      ky: 'Когнитивдик стилиң азыр белгилүү болду. Акыркы блок — контекстиң жана артыкчылыктарың жөнүндө.',
    },
    questions: [
      {
        id: 'q25', type: 'choice',
        text: {
          ru: 'Когда ты сталкиваешься с незнакомой задачей, что ты делаешь первым?',
          en: 'When you encounter an unfamiliar task, what do you do first?',
          ky: 'Тааныш эмес тапшырмага туш болгондо, эмне биринчи кыласың?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Стараться разбить её на части, составить план и двигаться шаг за шагом',
            en: 'Try to break it into parts, make a plan and move step by step',
            ky: 'Аны бөлүктөргө бөлүп, план түзүп, кадам-кадам жылууга аракет кылам',
          },
          scores: { analytical: 2, systematic: 2 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Сначала пытаться интуитивно почувствовать общее направление, а детали прорабатывать по ходу',
            en: 'First try to intuitively sense the general direction, then work out the details as I go',
            ky: 'Алгач жалпы багытты интуитивдик сезүүгө аракет кылам, ал эми деталдарды жүрүп иштейм',
          },
          scores: { intuitive: 2, holistic: 2 },
        },
      },
      {
        id: 'q26', type: 'choice',
        text: {
          ru: 'Что тебе ближе при изучении нового материала?',
          en: 'What suits you better when studying new material?',
          ky: 'Жаңы материалды изилдегенде сага эмне жакыныраак?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Читать подробно, разбирая каждый шаг — мне важно понять основы до деталей',
            en: 'Read in detail, working through each step — it\'s important for me to understand the basics before the details',
            ky: 'Ар бир кадамды иштеп, кеңири окуу — деталдарга чейин негиздерди түшүнүү маанилүү',
          },
          scores: { analytical: 1, depth: 1 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Сначала смотреть примеры и общую картину, а потом заполнять пробелы',
            en: 'First look at examples and the big picture, then fill in the gaps',
            ky: 'Алгач мисалдарга жана жалпы сүрөткө карап, анан боштуктарды толтуруу',
          },
          scores: { holistic: 1, breadth: 1 },
        },
      },
      {
        id: 'q27', type: 'likert5',
        text: {
          ru: 'Мне легче работать с данными, цифрами и логикой, чем с людьми и их эмоциями.',
          en: 'I find it easier to work with data, numbers and logic than with people and their emotions.',
          ky: 'Адамдар жана алардын эмоциялары менен иштегенге салыштырганда, маалыматтар, сандар жана логика менен иштегенге женилдейм.',
        },
        scores: { analytical: 1, things: 1 },
      },
      {
        id: 'q28', type: 'likert5',
        text: {
          ru: 'Мне сложно работать, когда нет чёткого плана или правил — неопределённость выбивает меня из колеи.',
          en: 'I find it hard to work when there is no clear plan or rules — uncertainty throws me off.',
          ky: 'Аниктеме план же эрежелер болбогондо иштегенге кыйналам — аныксыздык мени жолдон чыгарат.',
        },
        scores: { systematic: 1, structure: 1 },
      },
      {
        id: 'q29', type: 'choice',
        text: {
          ru: 'Когда ты принимаешь важное решение (например, выбираешь куда поехать на каникулы), ты чаще всего...',
          en: 'When you make an important decision (for example, choosing where to go on holiday), you most often...',
          ky: 'Маанилүү чечим кабыл алгандa (мисалы, каникулда кайда барышты тандаганда), адатта...',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Составляю список плюсов и минусов, сравниваю варианты по критериям',
            en: 'Make a list of pros and cons, compare options by criteria',
            ky: 'Артыкчылыктар жана кемчиликтердин тизмесин түзүп, варианттарды критерийлер боюнча салыштырам',
          },
          scores: { analytical: 2, C: 1 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Прислушиваюсь к ощущению — что больше «откликается», что кажется правильным',
            en: 'Listen to the feeling — what \'resonates\' more, what seems right',
            ky: 'Сезимге кулак салам — эмне дагы «кабылдайт», эмне туура болуп сезилет',
          },
          scores: { intuitive: 2, A: 1 },
        },
      },
      {
        id: 'q30', type: 'choice',
        text: {
          ru: 'В групповом проекте тебе предложили две задачи. Что выберешь?',
          en: 'In a group project you are offered two tasks. Which do you choose?',
          ky: 'Топтук долбоордо сага эки тапшырма сунушталды. Эмнени тандайсың?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Собрать и проанализировать данные, написать часть с выводами и цифрами',
            en: 'Collect and analyse data, write the section with conclusions and figures',
            ky: 'Маалыматтарды чогултуп жана анализдеп, жыйынтыктар жана сандар менен болугун жазуу',
          },
          scores: { analytical: 2, I: 1, things: 1 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Провести интервью с участниками, собрать их мнения, написать текстовую часть',
            en: 'Conduct interviews with participants, gather their opinions, write the text section',
            ky: 'Катышуучулар менен интервью жүргүзүп, алардын пикирлерин чогултуп, текст болугун жазуу',
          },
          scores: { holistic: 1, S: 1, people: 1 },
        },
      },
      {
        id: 'q31', type: 'likert5',
        text: {
          ru: 'Когда у меня есть свободное время, я предпочитаю делать что-то одно глубоко, а не переключаться между разными занятиями.',
          en: 'When I have free time, I prefer to do one thing deeply rather than switching between different activities.',
          ky: 'Бош убактым болгондо, ар башка иш-аракеттер арасында которулганга жем бир нерсени терең жасоону артык көрөм.',
        },
        scores: { depth: 1, systematic: 1 },
      },
      {
        id: 'q32', type: 'likert5',
        text: {
          ru: 'Мне нравится экспериментировать и пробовать новые подходы — даже если результат непредсказуем.',
          en: 'I enjoy experimenting and trying new approaches — even if the result is unpredictable.',
          ky: 'Жаңы ыкмаларды сынап жана эксперимент жүргүзгөндү жактырам — натыйжа алдын ала аныктуу болбосо дагы.',
        },
        scores: { intuitive: 1, creativity: 1, A: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BLOCK 4 — Context & Life Priorities
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 4,
    title: {
      ru: 'Блок 4. Контекст и жизненные приоритеты',
      en: 'Block 4. Context & Life Priorities',
      ky: '4-блок. Контекст жана жашоо артыкчылыктары',
    },
    desc: {
      ru: 'Это важно для учёта твоей реальной ситуации. Ответы помогут адаптировать рекомендации под жизнь в Кыргызстане.',
      en: 'This is important for accounting for your real situation. Answers will help adapt recommendations to life in Kyrgyzstan.',
      ky: 'Бул сенин реалдуу абалыңды эске алуу үчүн маанилүү. Жооптор сунуштарды Кыргызстандагы жашоого ылайыкташтырууга жардам берет.',
    },
    count: {
      ru: 'Вопросы 33–36 + академический профиль',
      en: 'Questions 33–36 + academic profile',
      ky: '33–36 суроолор + академиялык профиль',
    },
    icon: '🌍',
    color: '#fdf2e8',
    doneTitle: {
      ru: '✓ Тест завершён!',
      en: '✓ Test complete!',
      ky: '✓ Тест аяктады!',
    },
    doneText: {
      ru: 'Считаем твой профиль...',
      en: 'Calculating your profile...',
      ky: 'Профилиңди эсептеп жатабыз...',
    },
    questions: [
      {
        id: 'q33', type: 'choice',
        text: {
          ru: 'Мнение семьи о твоей профессии для тебя...',
          en: 'Your family\'s opinion about your profession is...',
          ky: 'Кесип тандоодо үй-бүлөңдүн пикири сен үчүн...',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Очень важно — я буду серьёзно учитывать его при выборе',
            en: 'Very important — I will seriously take it into account when choosing',
            ky: 'Өтө маанилүү — тандоодо аны олуттуу эске алам',
          },
          scores: { family_influence: 2 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Важно, но решение буду принимать самостоятельно, исходя из своих интересов',
            en: 'Important, but I will make the decision independently, based on my own interests',
            ky: 'Маанилүү, бирок чечимди өз кызыгуумдан келип чыгып, өзүм кабыл алам',
          },
          scores: { family_influence: 0 },
        },
      },
      {
        id: 'q34', type: 'choice',
        text: {
          ru: 'Финансовые ограничения при выборе вуза и специальности для тебя...',
          en: 'Financial constraints when choosing a university and programme for you are...',
          ky: 'Университет жана адистикти тандоодо каржылык чектөөлөр сен үчүн...',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Ключевой фактор — нужен грант или доступный вуз в своём городе',
            en: 'A key factor — I need a grant or an affordable university in my city',
            ky: 'Негизги фактор — грант же өз шаарымда жеткиликтүү университет керек',
          },
          scores: { finance_limit: 2 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Не определяющий фактор — смогу учиться, где будет лучшая программа',
            en: 'Not a defining factor — I will be able to study where the best programme is',
            ky: 'Аныктоочу фактор эмес — эң жакшы программа болгон жерде окуй алам',
          },
          scores: { finance_limit: 0 },
        },
      },
      {
        id: 'q35', type: 'choice',
        text: {
          ru: 'Готов(а) ли ты переехать в другой город или страну ради карьеры или учёбы?',
          en: 'Are you ready to move to another city or country for a career or study?',
          ky: 'Карьера же окуу үчүн башка шаарга же өлкөгө көчүүгө даярсыңбы?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Да — хочу попробовать жизнь за пределами своего города',
            en: 'Yes — I want to try life outside my city',
            ky: 'Ооба — шаарымдын чегинен тышкары жашоону сынап көргүм келет',
          },
          scores: { mobility: 2 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Предпочитаю оставаться близко к дому и семье',
            en: 'I prefer to stay close to home and family',
            ky: 'Үйгө жана үй-бүлөмө жакын калуунун артын алам',
          },
          scores: { mobility: 0 },
        },
      },
      {
        id: 'q36', type: 'choice',
        text: {
          ru: 'Когда ты думаешь о своей карьере через 10 лет, что важнее?',
          en: 'When you think about your career in 10 years, what matters more?',
          ky: '10 жылдан кийинки карьераңды ойлогондо, эмне маанилүүрөк?',
        },
        optA: {
          label: { ru: 'Вариант А', en: 'Option A', ky: 'А варианты' },
          text: {
            ru: 'Стабильность и уверенность в завтрашнем дне — хорошая зарплата, надёжное место',
            en: 'Stability and confidence in the future — a good salary, a reliable position',
            ky: 'Туруктуулук жана эртеңкү күнгө ишеним — жакшы айлык, ишенимдүү орун',
          },
          scores: { security: 1, money: 1 },
        },
        optB: {
          label: { ru: 'Вариант Б', en: 'Option B', ky: 'Б варианты' },
          text: {
            ru: 'Рост и возможности — даже если путь будет непростым и с рисками',
            en: 'Growth and opportunities — even if the path is difficult and involves risks',
            ky: 'Өсүм жана мүмкүнчүлүктөр — жол татаал жана тобокелдуулуктары бар болсо да',
          },
          scores: { growth: 1, autonomy: 1 },
        },
      },
    ],
  },
];
