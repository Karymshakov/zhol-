import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANG_META, type Lang } from '../i18n/translations';

const LANGS: Lang[] = ['ru', 'en', 'ky'];


/**
 * Dropdown-переключатель языка.
 * Рендерится ОДИН раз в App.tsx как fixed-элемент — не нужно добавлять в каждую страницу.
 */
export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Закрыть по клику снаружи
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Закрыть по Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const current = LANG_META[lang];

  return (
    <div ref={ref} className="relative z-[9998]">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl
          border text-sm font-semibold
          transition-all duration-200 select-none
          ${open
            ? 'bg-accent text-white border-accent shadow-lg shadow-accent/25'
            : 'bg-white text-muted border-border hover:border-accent hover:text-accent hover:bg-accent-light'
          }
        `}
      >
        <img src={current.flagSrc} alt={current.name} className="w-5 h-5 object-cover"/>
        <span className="hidden sm:inline">{current.name}</span>
        {/* Chevron */}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className={`
            absolute right-0 top-full mt-2
            w-44 bg-white rounded-2xl border border-border
            shadow-xl shadow-black/10 overflow-hidden
            animate-fade-up
          `}
        >
          {LANGS.map((l) => {
            const meta = LANG_META[l];
            const isActive = l === lang;
            return (
              <button
                key={l}
                role="option"
                aria-selected={isActive}
                onClick={() => { setLang(l); setOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  text-sm font-medium text-left
                  transition-colors duration-150
                  ${isActive
                    ? 'bg-accent-light text-accent font-semibold'
                    : 'text-text-main hover:bg-bg'
                  }
                `}
              >
                <img src={meta.flagSrc} alt={meta.name} className="w-5 h-5 object-cover"/>
                <span className="flex-1">{meta.name}</span>
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
