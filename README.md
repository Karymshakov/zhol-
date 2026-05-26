# Танда — AI карьерная платформа

## Быстрый старт

### 1. Backend

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Установить зависимости
pip install -r requirements.txt

# Настроить .env
cp .env.example .env
# Открыть .env и вставить свой OPENAI_API_KEY

# Запустить сервер
uvicorn app.main:app --reload
```

> API доступен на `http://localhost:8000`  
> Документация: `http://localhost:8000/docs`

---

### 2. Frontend

```bash
cd frontend

npm install
npm run dev
```

> Сайт открывается на `http://localhost:5173`

---

### .env (backend)

```env
DATABASE_URL=sqlite:///./zhol.db
OPENAI_API_KEY=sk-...          # ← вставить ключ
ALLOWED_ORIGINS=http://localhost:5173
```

---

### Стек

| | |
|---|---|
| Backend | Python + FastAPI |
| Frontend | React + TypeScript + Vite |
| AI | OpenAI GPT-4o-mini |
| БД | SQLite |
