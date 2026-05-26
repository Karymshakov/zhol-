import { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import learningLottie from '../assets/Learning.lottie?url';
import { useT } from '../i18n/LanguageContext';

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const t = useT();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2600);
    const doneTimer = setTimeout(() => onDone(), 3200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white
        transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-2 animate-fade-up">
        <span className="text-accent font-extrabold text-2xl tracking-tight">Tanda</span>
      </div>

      {/* Lottie */}
      <div className="w-64 h-64 animate-scale-in">
        <DotLottieReact src={learningLottie} loop autoplay />
      </div>

      {/* Tagline for the hackathon project */}
      <div className="text-center -mt-2 animate-fade-up-2">
        <p className="text-[17px] font-bold text-text-main mb-1">{t.splashTagline}</p>
        <p className="text-[13px] text-muted">{t.splashSub}</p>
      </div>

      {/* Dots and fots for my project*/}
      <div className="flex items-center gap-2 mt-8 animate-fade-up-3">
        {[0, 150, 300].map((delay) => (
          <div
            key={delay}
            className="w-2 h-2 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
