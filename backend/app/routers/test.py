import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Any
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Profile
from ..scoring import calc_scores, get_riasec_code
from ..matching import match_careers

router = APIRouter(prefix="/api", tags=["test"])


class SubmitPayload(BaseModel):
    answers: dict[str, Any]
    session_id: str | None = None


class ProfileResponse(BaseModel):
    session_id: str
    riasec_code: str
    scores: dict[str, float]
    matched_careers: list[dict[str, Any]]
    insights: list[str]


@router.post("/submit-test", response_model=ProfileResponse)
def submit_test(payload: SubmitPayload, db: Session = Depends(get_db)):
    session_id = payload.session_id or str(uuid.uuid4())
    scores = calc_scores(payload.answers)
    code = get_riasec_code(scores)
    careers = match_careers(scores)

    insights = _generate_insights(scores)

    profile = Profile(
        session_id=session_id,
        score_r=scores["R"], score_i=scores["I"], score_a=scores["A"],
        score_s=scores["S"], score_e=scores["E"], score_c=scores["C"],
        riasec_code=code,
        autonomy=scores["autonomy"], impact=scores["impact"],
        creativity=scores["creativity"], security=scores["security"],
        recognition=scores["recognition"], growth=scores["growth"],
        money=scores["money"],
        analytical=scores["analytical"], intuitive=scores["intuitive"],
        systematic=scores["systematic"], holistic=scores["holistic"],
        depth=scores["depth"], breadth=scores["breadth"],
        people=scores["people"], things=scores["things"],
        structure=scores["structure"],
        family_influence=scores["family_influence"],
        finance_limit=scores["finance_limit"],
        mobility=scores["mobility"],
        raw_answers=payload.answers,
        matched_careers=[c["name"] for c in careers],
    )

    existing = db.query(Profile).filter(Profile.session_id == session_id).first()
    if existing:
        db.delete(existing)
        db.flush()

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return ProfileResponse(
        session_id=session_id,
        riasec_code=code,
        scores=scores,
        matched_careers=careers,
        insights=insights,
    )


@router.get("/profile/{session_id}", response_model=ProfileResponse)
def get_profile(session_id: str, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.session_id == session_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    scores = {
        "R": profile.score_r, "I": profile.score_i, "A": profile.score_a,
        "S": profile.score_s, "E": profile.score_e, "C": profile.score_c,
        "autonomy": profile.autonomy, "impact": profile.impact,
        "creativity": profile.creativity, "security": profile.security,
        "recognition": profile.recognition, "growth": profile.growth,
        "money": profile.money, "analytical": profile.analytical,
        "intuitive": profile.intuitive, "systematic": profile.systematic,
        "holistic": profile.holistic, "depth": profile.depth,
        "breadth": profile.breadth, "people": profile.people,
        "things": profile.things, "structure": profile.structure,
        "family_influence": profile.family_influence,
        "finance_limit": profile.finance_limit, "mobility": profile.mobility,
    }
    careers = match_careers(scores)
    insights = _generate_insights(scores)

    return ProfileResponse(
        session_id=session_id,
        riasec_code=profile.riasec_code,
        scores=scores,
        matched_careers=careers,
        insights=insights,
    )


def _generate_insights(scores: dict[str, float]) -> list[str]:
    insights = []

    if scores.get("autonomy", 0) > scores.get("security", 0):
        insights.append("Ты ценишь свободу и самостоятельность больше стабильности — тебе подойдёт среда, где есть пространство для инициативы, а не жёсткая иерархия.")
    else:
        insights.append("Для тебя важна предсказуемость и надёжность — ты лучше раскроешься в структурированной среде с чёткими ожиданиями.")

    if scores.get("impact", 0) > scores.get("money", 0):
        insights.append("Тебя мотивирует смысл работы, а не только заработок — это признак, что профессии с выраженным социальным вкладом дадут тебе глубокую удовлетворённость.")

    if scores.get("analytical", 0) >= scores.get("intuitive", 0):
        insights.append("Твой стиль мышления аналитический — ты сильнее в работе с данными, логикой и структурой, чем с неопределёнными задачами без чётких критериев.")
    else:
        insights.append("Твой стиль мышления интуитивный — ты хорошо видишь большую картину и справляешься с неопределённостью, что ценно в творческих и предпринимательских ролях.")

    if scores.get("S", 0) > scores.get("R", 0) and scores.get("S", 0) > scores.get("I", 0):
        insights.append("Ты ориентирован(а) на людей — тебе важен человеческий контакт в работе. Изолированная или исключительно техническая среда скорее всего тебя утомит.")

    if scores.get("family_influence", 0) > 1:
        insights.append("Мнение семьи важно для тебя — это нормально. Результаты этого теста помогут тебе показать семье объективные данные в поддержку своего выбора.")

    if scores.get("finance_limit", 0) > 1:
        insights.append("Финансовые ограничения — реальный фактор для тебя. В рекомендациях выше учтены профессии с государственными грантами и доступными вузами в КР.")

    return insights
