import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy import text, inspect

from .database import Base, engine
from .routers import test as test_router
from .routers import ai as ai_router
from .routers import users as users_router

load_dotenv()

Base.metadata.create_all(bind=engine)

# Добавляем user_id в существующую таблицу profiles, если его нет
with engine.connect() as conn:
    cols = [c["name"] for c in inspect(engine).get_columns("profiles")]
    if "user_id" not in cols:
        conn.execute(text("ALTER TABLE profiles ADD COLUMN user_id INTEGER"))
        conn.commit()

app = FastAPI(
    title="Жол API",
    description="Карьерная диагностика для школьников Кыргызстана",
    version="1.0.0",
)

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_router.router)
app.include_router(ai_router.router)
app.include_router(users_router.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "zhol-api"}
