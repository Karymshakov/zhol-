import heroImg from '../assets/741644ba148b7f7af22523e180e120dadd2c2176.png';
import { useInView } from '../hooks/useInView';
import { useT } from '../i18n/LanguageContext';

// ─── Декоративные плавающие иконки на фоне секций ────────────
interface FloatItem {
  emoji: string;
  top?: string; bottom?: string;
  left?: string; right?: string;
  size: string;
  anim: string;
  delay: string;
  opacity: number;
  rotate?: string;
}

function FloatingBg({ items }: { items: FloatItem[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={i}
          className={`absolute ${item.anim}`}
          style={{
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            fontSize: item.size,
            animationDelay: item.delay,
            opacity: item.opacity,
            transform: item.rotate ? `rotate(${item.rotate})` : undefined,
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}

interface LandingPageProps {
  onStart: () => void;
  hasResult?: boolean;
  onGoResults?: () => void;
  onGoProfessions?: () => void;
  currentUser?: { name: string } | null;
  onGoAuth?: () => void;
  onGoProfile?: () => void;
}

const MODULE_FLOATS: FloatItem[] = [
  { emoji: '📚', top: '5%',   left: '1%',   size: '3.6rem', anim: 'animate-float-drift',    delay: '0s',   opacity: 0.08 },
  { emoji: '🔭', top: '35%',  left: '0.5%', size: '3rem',   anim: 'animate-float-sway',     delay: '1.4s', opacity: 0.07 },
  { emoji: '🎮', top: '60%',  left: '2%',   size: '3.4rem', anim: 'animate-float-wiggle',   delay: '0.7s', opacity: 0.07 },
  { emoji: '✏️', bottom:'5%', left: '5%',   size: '2.4rem', anim: 'animate-float',          delay: '2s',   opacity: 0.07, rotate: '-15deg' },
  { emoji: '📝', top: '20%',  left: '6%',   size: '2.2rem', anim: 'animate-float-slow',     delay: '1.1s', opacity: 0.06 },
  { emoji: '🌟', top: '78%',  left: '8%',   size: '2rem',   anim: 'animate-float-drift-2',  delay: '0.4s', opacity: 0.07 },
  { emoji: '🎓', top: '8%',   right: '1%',  size: '3.8rem', anim: 'animate-float-reverse',  delay: '0.6s', opacity: 0.08 },
  { emoji: '💡', top: '38%',  right: '1.5%',size: '3.2rem', anim: 'animate-float-slow',     delay: '2.1s', opacity: 0.08 },
  { emoji: '📖', top: '62%',  right: '2%',  size: '3rem',   anim: 'animate-float-sway-slow',delay: '1.7s', opacity: 0.07 },
  { emoji: '🏅', bottom:'6%', right: '4%',  size: '2.6rem', anim: 'animate-float-wiggle',   delay: '0.9s', opacity: 0.07 },
  { emoji: '⭐', top: '22%',  right: '6%',  size: '2rem',   anim: 'animate-float-drift',    delay: '1.5s', opacity: 0.08 },
  { emoji: '🎯', bottom:'20%',right: '7%',  size: '2.4rem', anim: 'animate-float',          delay: '2.4s', opacity: 0.07 },
  { emoji: '✨', top: '2%',   left: '30%',  size: '2rem',   anim: 'animate-float-sway',     delay: '0.3s', opacity: 0.09 },
  { emoji: '💫', top: '2%',   right: '28%', size: '1.8rem', anim: 'animate-float',          delay: '1.8s', opacity: 0.07 },
  { emoji: '🌈', bottom:'2%', left: '25%',  size: '2.2rem', anim: 'animate-float-drift-2',  delay: '1.2s', opacity: 0.06 },
  { emoji: '🚀', bottom:'2%', right: '22%', size: '2.4rem', anim: 'animate-float-wiggle',   delay: '0.6s', opacity: 0.07 },
];

function ModulesSection({ onStart, hasResult, onGoResults }: { onStart: () => void; hasResult?: boolean; onGoResults?: () => void }) {
  const { ref, inView } = useInView();
  const t = useT();

  const modules = [
    {
      icon: t.mod0icon,
      title: t.mod0title,
      tag: t.mod0tag,
      desc: t.mod0desc,
      stat: t.mod0stat,
      color: 'from-purple-light to-white',
      tagColor: 'bg-purple-light text-purple-brand',
      showBtn: true,
    },
    {
      icon: t.mod1icon,
      title: t.mod1title,
      tag: t.mod1tag,
      desc: t.mod1desc,
      stat: t.mod1stat,
      color: 'from-accent-light to-white',
      tagColor: 'bg-accent-light text-accent',
      showBtn: false,
    },
    {
      icon: t.mod2icon,
      title: t.mod2title,
      tag: t.mod2tag,
      desc: t.mod2desc,
      stat: t.mod2stat,
      color: 'from-green-light to-white',
      tagColor: 'bg-amber-light text-amber-brand',
      showBtn: false,
    },
  ];

  return (
    <section id="modules" className="relative py-24 bg-bg" ref={ref}>
      <FloatingBg items={MODULE_FLOATS} />
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'animate-fade-up opacity-100' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">{t.modulesTitle}</h2>
          <p className="text-muted text-[16px] max-w-xl mx-auto">{t.modulesDesc}</p>
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
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center text-2xl">
                  {m.icon}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${m.tagColor}`}>{m.tag}</span>
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">{m.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-5">{m.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted font-medium">{m.stat}</span>
                {m.showBtn && (
                  hasResult ? (
                    <button onClick={onGoResults} className="text-[13px] font-semibold text-accent hover:underline">
                      {t.mod0btnResult}
                    </button>
                  ) : (
                    <button onClick={onStart} className="text-[13px] font-semibold text-accent hover:underline">
                      {t.mod0btnStart}
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS_FLOATS: FloatItem[] = [
  { emoji: '🔬', top: '6%',   left: '1%',   size: '3.8rem', anim: 'animate-float-sway',     delay: '0.5s', opacity: 0.08 },
  { emoji: '🧪', top: '38%',  left: '0.5%', size: '3.2rem', anim: 'animate-float-drift',    delay: '1.8s', opacity: 0.07 },
  { emoji: '⚗️', top: '65%',  left: '2%',   size: '3rem',   anim: 'animate-float-wiggle',   delay: '1s',   opacity: 0.07 },
  { emoji: '📐', bottom:'5%', left: '5%',   size: '2.6rem', anim: 'animate-float-slow',     delay: '0.3s', opacity: 0.07, rotate: '20deg' },
  { emoji: '📏', top: '20%',  left: '5.5%', size: '2.2rem', anim: 'animate-float',          delay: '1.3s', opacity: 0.06, rotate: '-25deg' },
  { emoji: '🔢', top: '80%',  left: '8%',   size: '2rem',   anim: 'animate-float-drift-2',  delay: '2.2s', opacity: 0.07 },
  { emoji: '🧠', top: '5%',   right: '1%',  size: '4rem',   anim: 'animate-float-reverse',  delay: '0.2s', opacity: 0.08 },
  { emoji: '🏆', top: '40%',  right: '1.5%',size: '3.4rem', anim: 'animate-float-slow',     delay: '2.3s', opacity: 0.08 },
  { emoji: '💎', top: '68%',  right: '2%',  size: '3rem',   anim: 'animate-float-sway-slow',delay: '1.5s', opacity: 0.07 },
  { emoji: '🎖️', bottom:'5%', right: '4%',  size: '2.8rem', anim: 'animate-float-drift',    delay: '0.8s', opacity: 0.07 },
  { emoji: '📊', top: '22%',  right: '6%',  size: '2.4rem', anim: 'animate-float-wiggle',   delay: '1.6s', opacity: 0.07 },
  { emoji: '🔑', bottom:'22%',right: '7%',  size: '2.2rem', anim: 'animate-float',          delay: '2.6s', opacity: 0.07, rotate: '-10deg' },
  { emoji: '💡', top: '2%',   left: '28%',  size: '2.4rem', anim: 'animate-float-sway',     delay: '0.9s', opacity: 0.09 },
  { emoji: '⚡', top: '2%',   right: '26%', size: '2rem',   anim: 'animate-float-drift-2',  delay: '1.4s', opacity: 0.07 },
  { emoji: '🌱', bottom:'3%', left: '22%',  size: '2.2rem', anim: 'animate-float',          delay: '0.4s', opacity: 0.07 },
  { emoji: '🎯', bottom:'3%', right: '20%', size: '2.6rem', anim: 'animate-float-wiggle',   delay: '1.9s', opacity: 0.07 },
];

function StepsSection() {
  const { ref, inView } = useInView();
  const t = useT();

  const steps = [
    { icon: '👤', label: t.step0label, desc: t.step0desc },
    { icon: '🔭', label: t.step1label, desc: t.step1desc },
    { icon: '🎮', label: t.step2label, desc: t.step2desc },
    { icon: '⭐', label: t.step3label, desc: t.step3desc },
  ];

  return (
    <section id="steps" className="relative py-24 bg-white" ref={ref}>
      <FloatingBg items={STEPS_FLOATS} />
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'animate-fade-up' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-accent mb-3">{t.sectionHowItWorks}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">{t.stepsTitle}</h2>
          <p className="text-muted text-[16px] max-w-lg mx-auto">{t.stepsDesc}</p>
        </div>
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
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

const FEATURES_FLOATS: FloatItem[] = [
  { emoji: '🌍', top: '5%',   left: '1%',   size: '4rem',   anim: 'animate-float-sway-slow',delay: '0s',   opacity: 0.08 },
  { emoji: '💻', top: '35%',  left: '0.5%', size: '3.4rem', anim: 'animate-float-drift',    delay: '1.6s', opacity: 0.07 },
  { emoji: '🤖', top: '62%',  left: '1.5%', size: '3.6rem', anim: 'animate-float-wiggle',   delay: '0.8s', opacity: 0.08 },
  { emoji: '📊', bottom:'5%', left: '4%',   size: '3rem',   anim: 'animate-float-slow',     delay: '2s',   opacity: 0.07 },
  { emoji: '🧮', top: '18%',  left: '6%',   size: '2.4rem', anim: 'animate-float',          delay: '1.2s', opacity: 0.06 },
  { emoji: '⚙️', top: '80%',  left: '8%',   size: '2.2rem', anim: 'animate-float-drift-2',  delay: '0.5s', opacity: 0.07 },
  { emoji: '🔭', top: '6%',   right: '1%',  size: '3.8rem', anim: 'animate-float-reverse',  delay: '1.1s', opacity: 0.08 },
  { emoji: '🧬', top: '38%',  right: '1.5%',size: '3.2rem', anim: 'animate-float-slow',     delay: '2.2s', opacity: 0.07 },
  { emoji: '🔮', top: '64%',  right: '2%',  size: '3.4rem', anim: 'animate-float-sway',     delay: '1.4s', opacity: 0.07 },
  { emoji: '⭐', bottom:'6%', right: '4%',  size: '2.8rem', anim: 'animate-float-wiggle',   delay: '0.4s', opacity: 0.09 },
  { emoji: '🛰️', top: '20%',  right: '6%',  size: '2.4rem', anim: 'animate-float-drift-2',  delay: '1.8s', opacity: 0.07 },
  { emoji: '💡', bottom:'22%',right: '7%',  size: '2.6rem', anim: 'animate-float',          delay: '2.7s', opacity: 0.07 },
  { emoji: '🧩', top: '2%',   left: '26%',  size: '2.4rem', anim: 'animate-float-sway',     delay: '0.7s', opacity: 0.08 },
  { emoji: '🔐', top: '2%',   right: '24%', size: '2.2rem', anim: 'animate-float-drift',    delay: '1.3s', opacity: 0.07 },
  { emoji: '🌐', bottom:'2%', left: '20%',  size: '2.6rem', anim: 'animate-float-wiggle',   delay: '0.2s', opacity: 0.07 },
  { emoji: '📡', bottom:'2%', right: '18%', size: '2.4rem', anim: 'animate-float-sway-slow',delay: '1.7s', opacity: 0.07 },
];

function FeaturesSection() {
  const { ref, inView } = useInView();
  const t = useT();

  const features = [
    { icon: t.feat0icon, title: t.feat0title, desc: t.feat0desc, color: 'bg-purple-light' },
    { icon: t.feat1icon, title: t.feat1title, desc: t.feat1desc, color: 'bg-accent-light' },
    { icon: t.feat2icon, title: t.feat2title, desc: t.feat2desc, color: 'bg-green-light' },
    { icon: t.feat3icon, title: t.feat3title, desc: t.feat3desc, color: 'bg-amber-light' },
  ];

  return (
    <section id="features" className="relative py-24 bg-bg" ref={ref}>
      <FloatingBg items={FEATURES_FLOATS} />
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'animate-fade-up' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-accent mb-3">{t.sectionAdvantages}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">{t.featuresTitle}</h2>
          <p className="text-muted text-[16px] max-w-lg mx-auto">{t.featuresDesc}</p>
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
              <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center text-2xl flex-shrink-0`}>
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

function CtaSection({ onStart, hasResult, onGoResults }: { onStart: () => void; hasResult?: boolean; onGoResults?: () => void }) {
  const { ref, inView } = useInView();
  const t = useT();

  return (
    <section className="py-24" ref={ref}>
      <div className="max-w-3xl mx-auto px-6">
        <div
          className={`relative overflow-hidden rounded-3xl p-12 text-center text-white shadow-2xl shadow-accent/30 transition-all duration-700
            ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ background: 'linear-gradient(135deg, #4A7CF5 0%, #7C5CFA 100%)' }}
        >
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-blob pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />
          <div className="relative">
            {hasResult ? (
              <>
                <p className="text-[11px] font-bold tracking-[0.18em] uppercase opacity-60 mb-4">{t.ctaOnPath}</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaHasResultTitle}</h2>
                <p className="text-[16px] opacity-80 mb-8 max-w-md mx-auto">{t.ctaHasResultDesc}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button onClick={onGoResults}
                    className="bg-white text-accent font-bold px-8 py-4 rounded-xl hover:bg-accent-light hover:scale-105 active:scale-95 transition-all duration-200 text-[16px] shadow-lg">
                    {t.ctaViewResult}
                  </button>
                  <button onClick={onStart}
                    className="bg-white/20 border border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/30 active:scale-95 transition-all duration-200 text-[16px]">
                    {t.restart}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-[11px] font-bold tracking-[0.18em] uppercase opacity-60 mb-4">{t.ctaStartToday}</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaReadyTitle}</h2>
                <p className="text-[16px] opacity-80 mb-8 max-w-md mx-auto">{t.ctaReadyDesc}</p>
                <button onClick={onStart}
                  className="bg-white text-accent font-bold px-8 py-4 rounded-xl hover:bg-accent-light hover:scale-105 active:scale-95 transition-all duration-200 text-[16px] shadow-lg">
                  {t.ctaStartFirst}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage({ onStart, hasResult, onGoResults, onGoProfessions, currentUser, onGoAuth, onGoProfile }: LandingPageProps) {
  const t = useT();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems: { label: string; action: () => void }[] = [
    { label: t.navProfile,   action: () => hasResult && onGoResults ? onGoResults() : scrollTo('modules') },
    { label: t.navExplore,   action: () => hasResult && onGoProfessions ? onGoProfessions() : scrollTo('steps') },
    { label: t.navSimulator, action: () => scrollTo('features') },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border animate-slide-down">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold text-lg">{t.brand}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            {navItems.map(({ label, action }) => (
              <button key={label} onClick={action}
                className="hover:text-accent transition-colors duration-200 relative group">
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent rounded-full group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {currentUser ? (
              <button onClick={onGoProfile}
                className="flex items-center gap-2 text-sm font-semibold text-accent bg-accent-light px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-all">
                <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
                {currentUser.name}
              </button>
            ) : (
              <button onClick={onGoAuth}
                className="text-sm font-medium text-muted hover:text-accent transition-colors">
                {t.signIn}
              </button>
            )}
            {hasResult ? (
              <button onClick={onGoResults}
                className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-dark hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-accent/20">
                {t.myResults}
              </button>
            ) : (
              <button onClick={onStart}
                className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-dark hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-accent/20">
                {t.startPath}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent" />
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-brand/10 rounded-full blur-2xl animate-float-reverse" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-green-brand animate-pulse" />
              <span className="text-[12px] font-semibold text-white">{t.heroBadge}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 animate-fade-up-1">
              {t.heroTitle1}<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #93C5FD, #C4B5FD)' }}>
                {t.heroTitle2}
              </span>
            </h1>

            <p className="text-[17px] text-white/80 leading-relaxed mb-10 animate-fade-up-2">
              {t.heroDesc}
            </p>

            <div className="mb-12 animate-fade-up-3">
              {hasResult ? (
                <div className="flex flex-col gap-3">
                  <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl px-5 py-3.5 w-fit">
                    <span className="text-xl">🎉</span>
                    <div>
                      <p className="text-white font-semibold text-sm leading-tight">{t.heroHasResult}</p>
                      <p className="text-white/60 text-xs mt-0.5">{t.heroHasResultSub}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={onGoResults}
                      className="bg-white text-accent font-semibold px-8 py-4 rounded-xl hover:bg-accent-light hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-black/20 text-[15px]">
                      {t.heroViewResult}
                    </button>
                    <button onClick={onStart}
                      className="bg-white/15 backdrop-blur-sm border border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/25 active:scale-95 transition-all duration-200 text-[15px]">
                      {t.restart}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <button onClick={onStart}
                    className="bg-accent text-white font-semibold px-8 py-4 rounded-xl hover:bg-accent-dark hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl shadow-accent/40 text-[15px]">
                    {t.startPath}
                  </button>
                  <button className="bg-white/15 backdrop-blur-sm border border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/25 active:scale-95 transition-all duration-200 text-[15px]">
                    {t.heroSimulation}
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 animate-fade-up-4">
              {[
                { val: t.stat1val, label: t.stat1label },
                { val: t.stat2val, label: t.stat2label },
                { val: t.stat3val, label: t.stat3label, accent: true },
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

          {/* Floating UI cards */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
            <div className="animate-float bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-4 w-52">
              <p className="text-[11px] text-muted font-semibold mb-2.5">{t.cardTestDone}</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-brand" />
                <span className="text-[12px] font-medium text-text-main">{t.cardResearcher}</span>
                <span className="ml-auto text-[12px] font-bold text-purple-brand">75%</span>
              </div>
              <div className="w-full h-1.5 bg-bg rounded-full">
                <div className="h-full w-3/4 bg-purple-brand rounded-full" />
              </div>
            </div>
            <div className="animate-float-reverse bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-4 w-48 ml-8">
              <p className="text-[11px] text-muted font-semibold mb-2">{t.cardTopMatch}</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">💻</span>
                <div>
                  <p className="text-[12px] font-semibold text-text-main">{t.cardITdev}</p>
                  <p className="text-[11px] text-green-brand font-bold">{t.cardMatchPct}</p>
                </div>
              </div>
            </div>
            <div className="animate-float-slow bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-4 w-52">
              <p className="text-[11px] text-muted font-semibold mb-2">{t.cardRiasecProfile}</p>
              <div className="flex gap-1.5">
                {[
                  { k: 'R', h: 30, c: '#F59E0B' }, { k: 'I', h: 80, c: '#7C5CFA' },
                  { k: 'A', h: 55, c: '#EF4444' }, { k: 'S', h: 40, c: '#14B8A6' },
                  { k: 'E', h: 65, c: '#4A7CF5' }, { k: 'C', h: 25, c: '#22C55E' },
                ].map((bar) => (
                  <div key={bar.k} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-bg rounded-sm overflow-hidden" style={{ height: 48 }}>
                      <div className="w-full rounded-sm"
                        style={{ height: `${bar.h}%`, background: bar.c, marginTop: `${100 - bar.h}%` }} />
                    </div>
                    <span className="text-[9px] font-bold text-muted">{bar.k}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-float" />
          </div>
        </div>
      </section>

      <ModulesSection onStart={onStart} hasResult={hasResult} onGoResults={onGoResults} />
      <StepsSection />
      <FeaturesSection />
      <CtaSection onStart={onStart} hasResult={hasResult} onGoResults={onGoResults} />

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold">{t.brand}</span>
            <span className="text-[12px] text-muted">{t.footerTag}</span>
          </div>
          <p className="text-[12px] text-muted">{t.footerCopy}</p>
        </div>
      </footer>
    </div>
  );
}
