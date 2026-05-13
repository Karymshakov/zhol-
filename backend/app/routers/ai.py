from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..ai_service import (
    generate_ai_insights,
    generate_simulator_scenario,
    generate_simulator_completion,
)

router = APIRouter(prefix="/api/ai", tags=["ai"])


class InsightsRequest(BaseModel):
    scores: dict[str, float]
    riasec_code: str
    top_career: str


class SimulatorStepRequest(BaseModel):
    career: str
    step: int
    total_steps: int = 3
    previous_choices: list[str] = []
    current_stats: dict[str, int] = {}


class SimulatorCompleteRequest(BaseModel):
    career: str
    final_stats: dict[str, int]
    choices_made: list[str] = []


@router.post("/insights")
async def get_ai_insights(req: InsightsRequest):
    try:
        insights = await generate_ai_insights(req.scores, req.riasec_code, req.top_career)
        return {"insights": insights}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI недоступен: {e}")


@router.post("/simulator/step")
async def get_simulator_step(req: SimulatorStepRequest):
    try:
        scenario = await generate_simulator_scenario(
            req.career, req.step, req.total_steps,
            req.previous_choices, req.current_stats,
        )
        return scenario
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI недоступен: {e}")


@router.post("/simulator/complete")
async def get_simulator_complete(req: SimulatorCompleteRequest):
    try:
        result = await generate_simulator_completion(
            req.career, req.final_stats, req.choices_made,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI недоступен: {e}")
