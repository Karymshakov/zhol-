import { useState } from 'react';
import { register, login } from '../utils/api';
import type { AuthUser } from '../utils/api';

interface AuthPageProps {
  onSuccess: (user: AuthUser, token: string) => void;
  onBack: () => void;
  pendingMessage?: string;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InputField({
  label, type, value, onChange, placeholder, error, hint,
  showToggle, onToggle, showPassword,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  showPassword?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-main mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={showToggle ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border bg-bg text-text-main placeholder-muted
            focus:outline-none transition-colors pr-${showToggle ? '11' : '4'}
            ${error ? 'border-coral-brand focus:border-coral-brand' : 'border-border focus:border-accent'}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-main transition-colors"
            tabIndex={-1}
          >
            <EyeIcon open={!!showPassword} />
          </button>
        )}
      </div>
      {error && <p className="text-[12px] text-coral-brand mt-1">{error}</p>}
      {hint && !error && <p className="text-[12px] text-muted mt-1">{hint}</p>}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 6,
    password.length >= 10,
    /[A-Z]/.test(password) || /[А-Я]/.test(password),
    /[0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['Слабый', 'Слабый', 'Средний', 'Хороший', 'Сильный'];
  const colors = ['bg-coral-brand', 'bg-coral-brand', 'bg-amber-brand', 'bg-amber-brand', 'bg-green-brand'];
  const textColors = ['text-coral-brand', 'text-coral-brand', 'text-amber-brand', 'text-amber-brand', 'text-green-brand'];

  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score] : 'bg-border'
            }`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
}

export default function AuthPage({ onSuccess, onBack, pendingMessage }: AuthPageProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]         = useState(false);

  const switchTab = (t: 'login' | 'register') => {
    setTab(t);
    setFieldErrors({});
    setServerError('');
    setPassword('');
    setConfirm('');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (tab === 'register' && !name.trim()) errs.name = 'Введи имя';
    if (!email.trim()) errs.email = 'Введи email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Некорректный email';
    if (!password) errs.password = 'Введи пароль';
    else if (password.length < 6) errs.password = 'Минимум 6 символов';
    if (tab === 'register' && password && confirm !== password) errs.confirm = 'Пароли не совпадают';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setLoading(true);
    try {
      const result = tab === 'register'
        ? await register(name.trim(), email.trim(), password)
        : await login(email.trim(), password);
      localStorage.setItem('zhol_token', result.access_token);
      localStorage.setItem('zhol_user', JSON.stringify(result.user));
      onSuccess(result.user, result.access_token);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setServerError(msg || 'Что-то пошло не так. Попробуй ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-muted hover:text-text-main transition-colors p-1"
            aria-label="Назад"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-accent font-bold text-lg">Tanda</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md animate-fade-up">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" fill="none" stroke="#4A7CF5" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-main mb-1">
              {tab === 'login' ? 'Войди в аккаунт' : 'Создай аккаунт'}
            </h1>
            <p className="text-sm text-muted">
              {tab === 'login' ? 'Добро пожаловать обратно' : 'Сохраняй результаты и отслеживай прогресс'}
            </p>
            {pendingMessage && (
              <p className="text-sm text-teal-brand bg-teal-light px-4 py-2 rounded-xl mt-3">
                {pendingMessage}
              </p>
            )}
          </div>

          {/* Карточка */}
          <div className="bg-surface rounded-card shadow-card p-6">
            {/* Табы */}
            <div className="flex bg-bg rounded-xl p-1 mb-6">
              {(['login', 'register'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === t ? 'bg-white shadow-sm text-text-main' : 'text-muted hover:text-text-main'
                  }`}
                >
                  {t === 'login' ? 'Войти' : 'Регистрация'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Имя (только регистрация) */}
              {tab === 'register' && (
                <InputField
                  label="Имя"
                  type="text"
                  value={name}
                  onChange={(v) => { setName(v); setFieldErrors((p) => ({ ...p, name: '' })); }}
                  placeholder="Как тебя зовут?"
                  error={fieldErrors.name}
                />
              )}

              {/* Email */}
              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(v) => { setEmail(v); setFieldErrors((p) => ({ ...p, email: '' })); }}
                placeholder="example@mail.com"
                error={fieldErrors.email}
              />

              {/* Пароль */}
              <div>
                <InputField
                  label="Пароль"
                  type="password"
                  value={password}
                  onChange={(v) => { setPassword(v); setFieldErrors((p) => ({ ...p, password: '', confirm: '' })); }}
                  placeholder={tab === 'register' ? 'Минимум 6 символов' : '••••••••'}
                  error={fieldErrors.password}
                  showToggle
                  onToggle={() => setShowPwd((p) => !p)}
                  showPassword={showPwd}
                />
                {tab === 'register' && <PasswordStrength password={password} />}
              </div>

              {/* Подтверждение пароля (только регистрация) */}
              {tab === 'register' && (
                <InputField
                  label="Повтори пароль"
                  type="password"
                  value={confirm}
                  onChange={(v) => { setConfirm(v); setFieldErrors((p) => ({ ...p, confirm: '' })); }}
                  placeholder="••••••••"
                  error={fieldErrors.confirm}
                  hint={confirm && confirm === password ? '✓ Пароли совпадают' : undefined}
                  showToggle
                  onToggle={() => setShowConfirm((p) => !p)}
                  showPassword={showConfirm}
                />
              )}

              {/* Серверная ошибка */}
              {serverError && (
                <div className="flex items-start gap-2.5 bg-coral-light border border-coral-brand/20 px-4 py-3 rounded-xl">
                  <svg className="shrink-0 mt-0.5" width="16" height="16" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm text-coral-brand">{serverError}</p>
                </div>
              )}

              {/* Кнопка сабмита */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-accent text-white font-semibold text-[15px]
                  hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>{tab === 'login' ? 'Входим...' : 'Создаём аккаунт...'}</span>
                  </>
                ) : (
                  tab === 'login' ? 'Войти →' : 'Создать аккаунт →'
                )}
              </button>
            </form>

            {/* Переключалка внизу */}
            <p className="text-center text-sm text-muted mt-5">
              {tab === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button
                onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
                className="text-accent font-medium hover:underline"
              >
                {tab === 'login' ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
