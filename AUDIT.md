# 🔍 Аудит проекта Tanda / Zhol

> Дата: 2026-05-26  
> Проверено: frontend (React/TypeScript) + backend (FastAPI/Python)

---

## 🔴 КРИТИЧЕСКИЕ — ломают функциональность

### 1. Несоответствие имён профессий backend ↔ frontend

**Файлы:** `backend/app/matching.py` · `frontend/src/data/careers.ts` · `frontend/src/utils/api.ts:144`

Backend возвращает одни названия, frontend ищет другие. `apiCareerToCareer()` не находит
6 из 10 профессий и отдаёт fallback (голая русская строка без EN/KY перевода).

| Backend (`matching.py`)                        | Frontend (`careers.ts`)                        | Статус |
|------------------------------------------------|------------------------------------------------|--------|
| Юрист / **Правозащитник**                      | Юрист / **Правовед**                          | ❌     |
| Предприниматель / **Управленец**               | Предприниматель / **Основатель бизнеса**      | ❌     |
| Экономист / **Финансовый аналитик**            | Экономист / **Финансист**                     | ❌     |
| Агроном / Специалист в **сельском хозяйстве**  | Агроном / Специалист в **АПК**                | ❌     |
| Психолог / **Социальный работник**             | Психолог / **Консультант**                    | ❌     |
| Разработчик программного обеспечения           | Разработчик программного обеспечения          | ✅     |

**Последствие:** для 5 профессий в EN/KY режиме пользователь видит пустое название.

**Фикс:** выровнять имена в `backend/app/matching.py` под имена из `frontend/src/data/careers.ts`.

---

### 2. `App.tsx` — `ApiCareer[]` передаётся как `Career[]` без конвертации

**Файл:** `frontend/src/App.tsx:79-82`

```typescript
// ❌ matched_careers имеет тип ApiCareer[], но присваивается Career[]
const topCareers: Career[] = apiResult?.matched_careers?.length
  ? apiResult.matched_careers   // ← ApiCareer[], у которого name: string, а не I18nString!
  : [];
```

Эти `topCareers` передаются в `ProfessionsPage` (строка 265) без вызова `apiCareerToCareer()`.
В результате:
- `career.name.ru` → `undefined` (имя — строка, не объект)
- `l(career.name)` → рендерит пустоту
- `CAREER_ICONS[career.name.ru]` → всегда `'💼'`

`ResultsPage` делает конвертацию правильно (через `apiCareerToCareer`), но `App.tsx` — нет.

**Фикс:**
```typescript
import { apiCareerToCareer } from './utils/api';
import { careers as localCareers } from './data/careers';

const topCareers: Career[] = apiResult?.matched_careers?.length
  ? apiResult.matched_careers.map((ac) => apiCareerToCareer(ac, localCareers))
  : [];
```

---

### 3. Fallback-карьера в симуляторе сломана

**Файл:** `frontend/src/App.tsx:277-287`

```typescript
const career = simCareer ?? (topCareers[0] as Career | undefined) ?? {
  name: 'Разработчик программного обеспечения',  // ❌ нужно { ru, en, ky }
  why: 'Высокий спрос...',                        // ❌ нужно { ru, en, ky }
  salary: '60 000–150 000 сом/мес',               // ❌ нужно { ru, en, ky }
  tags: ['Высокий спрос'],                        // ❌ нужно I18nString[]
  ...
};
```

Если `simCareer === null` и `topCareers` пуст → `SimulatorPage` получает сломанный объект
→ `l(career.name)` возвращает `undefined` → краш или пустой экран.

**Фикс:** заменить на `localCareers[0]` из `frontend/src/data/careers.ts`.

---

### 4. `backend/.env` удалён из репозитория

**Git status:** `D  backend/.env`

Файл со всеми секретами помечен как удалённый. Без него:
- AI инсайты не работают (нет `GROQ_API_KEY`)
- JWT токены подписываются небезопасным дефолтным ключом `"zhol-secret-key-change-in-production"`
- Возможно, нет `DATABASE_URL`

**Фикс:** восстановить `.env`, добавить `.env` в `.gitignore`, создать `.env.example` с пустыми ключами.

---

### 5. Backend — логика `thinking` в `matching.py` сломана

**Файл:** `backend/app/matching.py:120`

Backend вычисляет thinking как `"analytical"` или `"intuitive"`, но у 4 профессий задан
`thinking: "holistic"` или `"systematic"`. Эти профессии **никогда** не получают +1 к score
за стиль мышления:

```python
# Вычисляется:
thinking = "analytical" | "intuitive"

# Но у профессий задано:
"Врач"      → "holistic"    # никогда не совпадёт → теряет 1 балл
"Учитель"   → "holistic"    # никогда не совпадёт → теряет 1 балл
"Дизайнер"  → "holistic"    # никогда не совпадёт → теряет 1 балл
"Агроном"   → "systematic"  # никогда не совпадёт → теряет 1 балл
```

**Фикс:** в `matching.py` добавить маппинг `"holistic" → "intuitive"`, `"systematic" → "analytical"`,
либо выровнять значения thinking у профессий.

---

## 🟠 ВЫСОКИЙ приоритет — неправильное поведение

### 6. `CareerCard.tsx` — процент пересчитывается через `Math.random()` при каждом рендере

**Файл:** `frontend/src/components/results/CareerCard.tsx:20`

```typescript
// ❌ Вызывается при каждом ре-рендере → процент скачет при переключении языка
const matchPct = Math.max(40, Math.min(99, 95 - (rank - 1) * 12 + Math.floor(Math.random() * 5)));
```

**Фикс:** обернуть в `useMemo(() => ..., [rank])` или передавать `career.matchScore` напрямую.

---

### 7. `AuthPage.tsx` — полностью не переведена

**Файл:** `frontend/src/pages/AuthPage.tsx`

Весь UI захардкожен на русском — нет ни одного вызова `useT()`.
Пользователи в EN/KY режиме видят полностью русский экран входа.

Захардкоженные строки: `"Войди в аккаунт"`, `"Создай аккаунт"`, `"Имя"`, `"Email"`,
`"Пароль"`, `"Слабый/Средний/Сильный"`, все сообщения об ошибках и кнопки.

---

### 8. AI инсайты всегда на русском

**Файлы:** `backend/app/ai_service.py:57` · `backend/app/routers/test.py:108`

Промпт к AI захардкожен: `"Напиши 4 персональных инсайта на русском"`.
При переключении пользователя на EN/KY инсайты всё равно приходят на русском.

**Фикс:** принимать `lang` параметр с фронта и менять язык промпта.

---

### 9. `GamesSection` — JSX-компоненты созданы вне React-рендера

**Файл:** `frontend/src/pages/ProfessionsPage.tsx:558-562`

```typescript
// ❌ Создаётся один раз при загрузке модуля, state НЕ сбрасывается
const GAMES_META = [
  { component: <GameQuiz /> },   // element создан вне render-цикла
  { component: <GameTruth /> },
  { component: <GameStyle /> },
];
```

Когда пользователь закрывает игру и снова открывает — видит незавершённое состояние,
а не стартовый экран.

**Фикс:** определить `GAMES_META` внутри `GamesSection` или использовать функции-рендереры
`() => <GameQuiz />` вместо `<GameQuiz />`.

---

### 10. `SimulatorPage` — множество захардкоженных русских строк

**Файл:** `frontend/src/pages/SimulatorPage.tsx`

Не переведены:
- `"AI генерирует ситуацию..."` (строка ~149)
- Fallback insights при сбое AI (строки ~310-314)
- `"Параметры после недели"` (~451)
- `"Карьерный путь ... а"`, `"Прогноз зарплаты"` (~476-477)
- `"AI-инсайты по итогам недели"` (~500)
- `"AI анализирует твои 21 решение"` (~513)
- `"День X завершён — считаем итоги..."` (~680)
- `"Первая рабочая неделя завершена!"` (~691)

---

## 🟡 СРЕДНИЙ приоритет — технические долги

### 11. `ProfilePage` — полностью на русском

**Файл:** `frontend/src/pages/ProfilePage.tsx`

Нет `useT()`, все строки захардкожены на русском.
`formatDate` использует `'ru-RU'` локаль независимо от выбранного языка.

---

### 12. `App.tsx` — `LangWidget` определён как компонент внутри компонента

**Файл:** `frontend/src/App.tsx:174`

```typescript
// ❌ Новый тип компонента при каждом рендере App → unmount/remount LanguageSwitcher
const LangWidget = () => (
  <div className="fixed top-4 right-4 z-[9998]">
    <LanguageSwitcher />
  </div>
);
```

**Фикс:** вынести `LangWidget` на уровень модуля или инлайнить JSX напрямую в return.

---

### 13. Небезопасный дефолтный `SECRET_KEY`

**Файл:** `backend/app/auth.py:13`

```python
SECRET_KEY = os.getenv("SECRET_KEY", "zhol-secret-key-change-in-production")
```

Если переменная не задана — JWT подписывается публично известным ключом.

**Фикс:**
```python
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not set")
```

---

### 14. Нет защиты от брутфорса на `/api/auth/login`

**Файл:** `backend/app/routers/users.py`

Нет rate limiting, нет задержки при неверном пароле, нет блокировки после N попыток.

**Фикс:** добавить `slowapi` или `fastapi-limiter`.

---

### 15. Формула роста зарплаты — фейковые данные

**Файл:** `frontend/src/pages/ProfessionsPage.tsx:94`

```typescript
// matchPct диапазон: 35–72 → рост зарплаты: 52%–108% за 5 лет (нереалистично)
↗ +{Math.floor(matchPct * 1.5)}% {t.profSalaryGrowth}
```

---

### 16. Устаревшие константы не удалены из `scoring.ts`

**Файл:** `frontend/src/utils/scoring.ts:87-100`

```typescript
// Не используются нигде — заменены на t.riasecR/t.valueLabels
export const RIASEC_NAMES: Record<string, string> = { R: 'Реалист', ... };
export const VALUE_LABELS: Record<string, string> = { autonomy: 'Автономия', ... };
```

---

## 📊 Итоговая таблица

| #  | Проблема                                              | Файл                        | Приоритет     |
|----|-------------------------------------------------------|-----------------------------|---------------|
| 1  | Несоответствие имён профессий backend ↔ frontend      | `matching.py` ↔ `careers.ts`| 🔴 Критично   |
| 2  | `ApiCareer[]` передаётся как `Career[]` без конвертации | `App.tsx:79`              | 🔴 Критично   |
| 3  | Fallback-карьера симулятора с plain-строками          | `App.tsx:277`               | 🔴 Критично   |
| 4  | `backend/.env` удалён (нет API-ключей)                | `.env`                      | 🔴 Критично   |
| 5  | Логика `thinking` в matching сломана                  | `matching.py:120`           | 🔴 Критично   |
| 6  | `matchPct` пересчитывается через `Math.random()`      | `CareerCard.tsx:20`         | 🟠 Высокий    |
| 7  | `AuthPage` не переведена                              | `AuthPage.tsx`              | 🟠 Высокий    |
| 8  | AI инсайты всегда на русском                          | `ai_service.py:57`          | 🟠 Высокий    |
| 9  | JSX-компоненты игр созданы вне render-цикла           | `ProfessionsPage.tsx:558`   | 🟠 Высокий    |
| 10 | SimulatorPage — много захардкоженных русских строк    | `SimulatorPage.tsx`         | 🟠 Высокий    |
| 11 | ProfilePage не переведена                             | `ProfilePage.tsx`           | 🟡 Средний    |
| 12 | `LangWidget` как inline-компонент                     | `App.tsx:174`               | 🟡 Средний    |
| 13 | Небезопасный дефолтный SECRET_KEY                     | `auth.py:13`                | 🟡 Средний    |
| 14 | Нет защиты от брутфорса на /login                     | `users.py`                  | 🟡 Средний    |
| 15 | Фейковая формула роста зарплаты                       | `ProfessionsPage.tsx:94`    | 🟡 Средний    |
| 16 | Устаревшие экспорты RIASEC_NAMES/VALUE_LABELS         | `scoring.ts:87`             | 🟡 Низкий     |

---

## ⚡ Быстрые победы (5–10 минут каждая)

1. **#2 — App.tsx конвертация** — добавить `.map((ac) => apiCareerToCareer(ac, localCareers))` в одну строку
2. **#1 — Имена профессий** — исправить 5 строк в `matching.py`
3. **#6 — Math.random()** — обернуть в `useMemo`
4. **#12 — LangWidget** — вынести за пределы `App`
5. **#13 — SECRET_KEY** — добавить проверку при старте
