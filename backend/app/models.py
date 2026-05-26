from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)

    # RIASEC scores
    score_r: Mapped[float] = mapped_column(Float, default=0.0)
    score_i: Mapped[float] = mapped_column(Float, default=0.0)
    score_a: Mapped[float] = mapped_column(Float, default=0.0)
    score_s: Mapped[float] = mapped_column(Float, default=0.0)
    score_e: Mapped[float] = mapped_column(Float, default=0.0)
    score_c: Mapped[float] = mapped_column(Float, default=0.0)

    riasec_code: Mapped[str] = mapped_column(String(3), default="")

    # Values
    autonomy: Mapped[float] = mapped_column(Float, default=0.0)
    impact: Mapped[float] = mapped_column(Float, default=0.0)
    creativity: Mapped[float] = mapped_column(Float, default=0.0)
    security: Mapped[float] = mapped_column(Float, default=0.0)
    recognition: Mapped[float] = mapped_column(Float, default=0.0)
    growth: Mapped[float] = mapped_column(Float, default=0.0)
    money: Mapped[float] = mapped_column(Float, default=0.0)

    # Thinking style
    analytical: Mapped[float] = mapped_column(Float, default=0.0)
    intuitive: Mapped[float] = mapped_column(Float, default=0.0)
    systematic: Mapped[float] = mapped_column(Float, default=0.0)
    holistic: Mapped[float] = mapped_column(Float, default=0.0)

    # Context
    depth: Mapped[float] = mapped_column(Float, default=0.0)
    breadth: Mapped[float] = mapped_column(Float, default=0.0)
    people: Mapped[float] = mapped_column(Float, default=0.0)
    things: Mapped[float] = mapped_column(Float, default=0.0)
    structure: Mapped[float] = mapped_column(Float, default=0.0)
    family_influence: Mapped[float] = mapped_column(Float, default=0.0)
    finance_limit: Mapped[float] = mapped_column(Float, default=0.0)
    mobility: Mapped[float] = mapped_column(Float, default=0.0)

    # Raw answers stored as JSON
    raw_answers: Mapped[dict] = mapped_column(JSON, default=dict)

    # Matched careers (top 5 names)
    matched_careers: Mapped[list] = mapped_column(JSON, default=list)

    # AI insights
    ai_insights: Mapped[str | None] = mapped_column(String, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
