import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Lang, type Translations } from './translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getSavedLang(): Lang {
  try {
    const saved = localStorage.getItem('zhol_lang');
    if (saved === 'ru' || saved === 'en' || saved === 'ky') return saved;
  } catch { /* ignore */ }
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith('ky')) return 'ky';
  if (browser.startsWith('ru')) return 'ru';
  return 'ru'; // default
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getSavedLang);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try { localStorage.setItem('zhol_lang', newLang); } catch { /* ignore */ }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}

/** Shorthand — returns only the translations object */
export function useT(): Translations {
  return useLanguage().t;
}
