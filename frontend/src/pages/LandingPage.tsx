import heroImg from '../assets/741644ba148b7f7af22523e180e120dadd2c2176.png';
import { useInView } from '../hooks/useInView';

interface LandingPageProps {
  onStart: () => void;
}

const modules = [
  {
    icon: '👤',
    title: 'Профиль',
    tag: 'Старт тут',
    desc: 'Пройди тест из 36 вопросов и получи детальный карьерный профиль по RIASEC, ценностям и когнитивному стилю.',
    stat: '36 вопросов · 20 мин',
    color: 'from-purple-light to-white',
    tagColor: 'bg-purple-light text-purple-brand',
    showBtn: true,
  },
  {
    icon: '🔭',
    title: 'Исследование',
    tag: 'Найди профессию',
    desc: 'Изучи топ-5 профессий, подходящих под твой профиль. Узнай зарплаты, вузы КР и требования ОРТ.',
    stat: '10+ профессий',
    color: 'from-accent-light to-white',
    tagColor: 'bg-accent-light text-accent',
    showBtn: false,
  },
  {
    icon: '🎮',
    title: 'Симулятор',
    tag: 'Скоро',
    desc: 'Проживи рабочий день в выбранной профессии. Прими реальные решения и оцени, твоё ли это призвание.',
    stat: 'AI-симуляция',
    color: 'from-green-light to-white',
    tagColor: 'bg-amber-light text-amber-brand',
    showBtn: false,
  },
];

const steps = [
  { icon: '👤', label: 'Профиль', desc: 'Тест за 20 мин' },
  { icon: '🔭', label: 'Исследование', desc: 'Топ-5 профессий' },
  { icon: '🎮', label: 'Симулятор', desc: 'Рабочий день' },
  { icon: '⭐', label: 'Решение', desc: 'Твой план' },
];

const features = [
  { icon: '🔬', title: 'Научный подход', desc: 'Методики RIASEC (Holland), ценности Шварца и когнитивные стили Стернберга — проверенная база.', color: 'bg-purple-light' },
  { icon: '🌐', title: 'Локальный контекст', desc: 'Данные о зарплатах, вузах КР, баллах ОРТ и рынке труда Кыргызстана — не абстрактные советы.', color: 'bg-accent-light' },
  { icon: '📊', title: 'Развёрнутый отчёт', desc: 'Визуализация RIASEC-профиля, когнитивного стиля, ценностей и карьерных совпадений в одном отчёте.', color: 'bg-green-light' },
  { icon: '🤖', title: 'AI рекомендации', desc: 'Персональные инсайты на основе твоих ответов — понятным языком, без воды и шаблонов.', color: 'bg-amber-light' },
];

function ModulesSection({ onStart }: { onStart: () => void }) {
  const { ref, inView } = useInView();
  return (
    <section className="py-24 bg-bg" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'animate-fade-up opacity-100' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-accent mb-3">Платформа</p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Три модуля — один путь</h2>
          <p className="text-muted text-[16px] max-w-xl mx-auto">Последовательный маршрут, который ведёт тебя от самопознания к осознанному выбору</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((m, i) => (
            <div
              key={i}
              className={`bg-gradient-to-b ${m.color} border border-border rounded-2xl p-7 shadow-card
                hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-default
                ${inView ? `animate-scale-in-${i}` : 'opacity-0 scale-90'}`}
              style={inView ? { animationDelay: `${i * 0.12}s` } : {}}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center text-2xl
                  group-hover:scale-110 transition-transform">
                  {m.icon}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${m.tagColor}`}>{m.tag}</span>
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">{m.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-5">{m.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted font-medium">{m.stat}</span>
                {m.showBtn && (
                  <button onClick={onStart} className="text-[13px] font-semibold text-accent hover:underline">
                    Пройти тест →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'animate-fade-up' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-accent mb-3">Как это работает</p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Четыре шага к ясности</h2>
          <p className="text-muted text-[16px] max-w-lg mx-auto">Каждый шаг приближает тебя к осознанному карьерному пути</p>
        </div>
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Connector */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-accent via-purple-brand to-green-brand opacity-20 pointer-events-none" />
          {steps.map((s, i) => (
            <div
              key={i}
              className={`text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="relative inline-flex mb-5">
                <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center text-2xl
                  hover:bg-accent hover:scale-110 transition-all duration-300 cursor-default group">
                  <span className="group-hover:scale-125 transition-transform duration-300">{s.icon}</span>
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
              </div>
              <h4 className="font-bold text-text-main mb-1">{s.label}</h4>
              <p className="text-[13px] text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-24 bg-bg" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'animate-fade-up' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-accent mb-3">Преимущества</p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Создан для тебя</h2>
          <p className="text-muted text-[16px] max-w-lg mx-auto">
            Не просто тест, а инструмент, который учитывает твой контекст, культуру и возможности
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className={`bg-white border border-border rounded-2xl p-7 shadow-card flex gap-5
                hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms`, transitionProperty: 'opacity, transform' }}
            >
              <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center text-2xl flex-shrink-0
                group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <div>
                <h4 className="font-bold text-text-main mb-2">{f.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ onStart }: { onStart: () => void }) {
  const { ref, inView } = useInView();
  return (
    <section className="py-24" ref={ref}>
      <div className="max-w-3xl mx-auto px-6">
        <div
          className={`relative overflow-hidden rounded-3xl p-12 text-center text-white shadow-2xl shadow-accent/30 transition-all duration-700
            ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{
            background: 'linear-gradient(135deg, #4A7CF5 0%, #7C5CFA 100%)',
            backgroundSize: '200% 200%',
          }}
        >
          {/* Animated blobs inside CTA */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-blob pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />

          <div className="relative">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase opacity-60 mb-4">Начни сегодня</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Готов начать путь?</h2>
            <p className="text-[16px] opacity-80 mb-8 max-w-md mx-auto">
              Тест занимает 20 минут. Результат — конкретные профессии, вузы и следующие шаги.
            </p>
            <button
              onClick={onStart}
              className="bg-white text-accent font-bold px-8 py-4 rounded-xl hover:bg-accent-light hover:scale-105
                active:scale-95 transition-all duration-200 text-[16px] shadow-lg"
            >
              Начать первую сессию →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border animate-slide-down">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold text-lg">Жол</span>
            <span className="text-[11px] text-muted font-medium bg-bg px-2 py-0.5 rounded-full">платформа</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            {['Профиль', 'Исследование', 'Симулятор'].map((item) => (
              <span key={item} className="hover:text-accent cursor-pointer transition-colors duration-200 relative group">
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent rounded-full group-hover:w-full transition-all duration-300" />
              </span>
            ))}
          </div>
          <button
            onClick={onStart}
            className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg
              hover:bg-accent-dark hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-accent/20"
          >
            Начать путь →
          </button>
        </div>
      </nav>

      {/* ───── HERO — full-bleed background image ───── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay: dark on left for text, transparent on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent" />
        </div>

        {/* Animated particles overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-brand/10 rounded-full blur-2xl animate-float-reverse" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30
              rounded-full px-4 py-2 mb-8 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-green-brand animate-pulse" />
              <span className="text-[12px] font-semibold text-white">AI система самоопределения · КР</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 animate-fade-up-1">
              Твой путь.<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #93C5FD, #C4B5FD)' }}>
                Твоё будущее.
              </span>
            </h1>

            <p className="text-[17px] text-white/80 leading-relaxed mb-10 animate-fade-up-2">
              AI система карьерной самоопределения для школьников Кыргызстана — один тест, отбор профессий и прогноз будущего.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-12 animate-fade-up-3">
              <button
                onClick={onStart}
                className="bg-accent text-white font-semibold px-8 py-4 rounded-xl
                  hover:bg-accent-dark hover:scale-105 active:scale-95
                  transition-all duration-200 shadow-xl shadow-accent/40 text-[15px]"
              >
                Начать путь →
              </button>
              <button className="bg-white/15 backdrop-blur-sm border border-white/40 text-white
                font-semibold px-8 py-4 rounded-xl hover:bg-white/25 active:scale-95
                transition-all duration-200 text-[15px]">
                Симуляция
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 animate-fade-up-4">
              {[
                { val: '1 200+', label: 'участников' },
                { val: '48', label: 'профессий' },
                { val: 'RIASEC', label: 'методология', accent: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px h-10 bg-white/20" />}
                  <div>
                    <p className={`text-2xl font-bold ${s.accent ? 'text-accent' : 'text-white'}`}>{s.val}</p>
                    <p className="text-[12px] text-white/60 font-medium">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating UI cards (right side) */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
            <div className="animate-float bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-4 w-52">
              <p className="text-[11px] text-muted font-semibold mb-2.5">Тест пройден</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-brand" />
                <span className="text-[12px] font-medium text-text-main">Исследователь</span>
                <span className="ml-auto text-[12px] font-bold text-purple-brand">75%</span>
              </div>
              <div className="w-full h-1.5 bg-bg rounded-full">
                <div className="h-full w-3/4 bg-purple-brand rounded-full" />
              </div>
            </div>

            <div className="animate-float-reverse bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-4 w-48 ml-8">
              <p className="text-[11px] text-muted font-semibold mb-2">Топ совпадение</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">💻</span>
                <div>
                  <p className="text-[12px] font-semibold text-text-main">IT-разработчик</p>
                  <p className="text-[11px] text-green-brand font-bold">84% совпадение</p>
                </div>
              </div>
            </div>

            <div className="animate-float-slow bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-4 w-52">
              <p className="text-[11px] text-muted font-semibold mb-2">RIASEC профиль</p>
              <div className="flex gap-1.5">
                {[
                  { k: 'R', h: 30, c: '#F59E0B' }, { k: 'I', h: 80, c: '#7C5CFA' },
                  { k: 'A', h: 55, c: '#EF4444' }, { k: 'S', h: 40, c: '#14B8A6' },
                  { k: 'E', h: 65, c: '#4A7CF5' }, { k: 'C', h: 25, c: '#22C55E' },
                ].map((bar) => (
                  <div key={bar.k} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-bg rounded-sm overflow-hidden" style={{ height: 48 }}>
                      <div
                        className="w-full rounded-sm mt-auto"
                        style={{ height: `${bar.h}%`, background: bar.c, marginTop: `${100 - bar.h}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-muted">{bar.k}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-float" />
          </div>
        </div>
      </section>

      <ModulesSection onStart={onStart} />
      <StepsSection />
      <FeaturesSection />
      <CtaSection onStart={onStart} />

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold">Жол</span>
            <span className="text-[12px] text-muted">платформа карьерного самоопределения</span>
          </div>
          <p className="text-[12px] text-muted">Хакатон · Кыргызстан · 2026</p>
        </div>
      </footer>
    </div>
  );
}
