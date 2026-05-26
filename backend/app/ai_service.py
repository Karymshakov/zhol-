import os
import json
import logging
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

_client: AsyncOpenAI | None = None
_model: str = "gpt-4o-mini"


def get_client() -> AsyncOpenAI:
    global _client, _model
    if _client is None:
        groq_key = os.getenv("GROQ_API_KEY", "").strip()
        openai_key = os.getenv("OPENAI_API_KEY", "").strip()

        if groq_key:
            logger.info("Using Groq API")
            _client = AsyncOpenAI(
                api_key=groq_key,
                base_url="https://api.groq.com/openai/v1",
            )
            _model = "llama-3.3-70b-versatile"
        elif openai_key:
            logger.info("Using OpenAI API")
            _client = AsyncOpenAI(api_key=openai_key)
            _model = "gpt-4o-mini"
        else:
            raise RuntimeError("Нужен GROQ_API_KEY или OPENAI_API_KEY")

    return _client


async def generate_ai_insights(
    scores: dict,
    riasec_code: str,
    top_career: str,
) -> list[str]:
    VALUE_LABELS = {
        "autonomy": "самостоятельность",
        "impact": "влияние на мир",
        "creativity": "творчество",
        "security": "стабильность",
        "recognition": "признание",
        "growth": "развитие",
        "money": "высокий доход",
    }
    sorted_vals = sorted(
        [(k, scores.get(k, 0)) for k in VALUE_LABELS],
        key=lambda x: -x[1],
    )
    top_vals = ", ".join(VALUE_LABELS[k] for k, _ in sorted_vals[:2])
    style = "аналитический" if scores.get("analytical", 0) >= scores.get("intuitive", 0) else "интуитивный"
    orient = "работа с людьми" if scores.get("people", 0) > scores.get("things", 0) else "работа с задачами"

    prompt = f"""Ты — AI-советник по карьере для школьников Кыргызстана.

Профиль ученика:
- RIASEC-код: {riasec_code}
- Лучшая профессия: {top_career}
- Главные ценности: {top_vals}
- Стиль мышления: {style}
- Ориентация: {orient}
- Баллы RIASEC: R={scores.get("R",0):.1f}, I={scores.get("I",0):.1f}, A={scores.get("A",0):.1f}, S={scores.get("S",0):.1f}, E={scores.get("E",0):.1f}, C={scores.get("C",0):.1f}

Напиши 4 персональных инсайта на русском. Каждый — 1–2 предложения, конкретный, практичный.
Учитывай реалии Кыргызстана: рынок труда, культуру, возможности.
Не начинай каждый инсайт со слова "Ты".
Верни ТОЛЬКО JSON-массив строк, без лишнего текста:
["инсайт 1", "инсайт 2", "инсайт 3", "инсайт 4"]"""

    client = get_client()
    try:
        resp = await client.chat.completions.create(
            model=_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=700,
        )
        raw = resp.choices[0].message.content or "[]"
        raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return parsed
        return parsed.get("insights", list(parsed.values())[0] if parsed else [])
    except Exception as exc:
        logger.error("generate_ai_insights failed: %s", exc, exc_info=True)
        raise


async def generate_simulator_scenario(
    career: str,
    step: int,       # глобальный шаг: 0-20 (7 дней × 3 ситуации)
    total_steps: int,
    previous_choices: list[str],
    current_stats: dict,
) -> dict:
    STEPS_PER_DAY = 3
    day_num = step // STEPS_PER_DAY + 1          # 1–7
    step_in_day = step % STEPS_PER_DAY           # 0–2
    total_days = total_steps // STEPS_PER_DAY    # 7

    times_in_day = ["09:00", "13:00", "18:00"]
    parts_in_day = ["Утро — начало дня", "День — разгар работы", "Вечер — итоги дня"]

    day_themes = [
        "первый день — ориентация: знакомство с командой, офисом и рабочими процессами",
        "второй день — первое задание: самостоятельная рабочая задача от руководителя",
        "третий день — командная работа: совместный проект с коллегами",
        "четвёртый день — нештатная ситуация: неожиданная проблема требует срочного решения",
        "пятый день — дедлайн: сжатые сроки и давление со стороны руководства",
        "шестой день — обратная связь: встреча один-на-один с руководителем и оценка недели",
        "седьмой день — итог недели: подведение результатов первой рабочей недели и планирование",
    ]

    day_theme = day_themes[min(day_num - 1, 6)]
    time_label = times_in_day[step_in_day]
    part_label = parts_in_day[step_in_day]

    recent = previous_choices[-6:] if previous_choices else []
    history = f"\nПоследние решения ученика: {'; '.join(recent)}" if recent else ""

    prompt = f"""Ты — создатель карьерного симулятора для школьников Кыргызстана.
Профессия: {career}
Рабочая неделя: день {day_num} из {total_days} — {day_theme}
Время: {time_label} · {part_label}
Текущие параметры: Энергия={current_stats.get("energy", 80)}%, Стресс={current_stats.get("stress", 20)}%, Навыки={current_stats.get("skills", 30)}%, Настрой={current_stats.get("mood", 70)}%{history}

Создай реалистичную и живую рабочую ситуацию для профессии «{career}», характерную для {day_theme.split("—")[0].strip()}.
Ситуация должна быть специфична для этой профессии, обучающей и отражать реальные моменты рабочей жизни.
Каждый из 3 вариантов по-разному влияет на Энергию, Стресс, Навыки, Настрой (значения от -20 до +20).

Верни ТОЛЬКО валидный JSON (без markdown, без комментариев):
{{
  "time": "{time_label} · краткое название ситуации (3-5 слов)",
  "text": "описание ситуации (2-3 предложения, живо и конкретно)",
  "choices": [
    {{"emoji": "🎯", "text": "вариант действия 1", "delta": {{"energy": 0, "stress": 0, "skills": 0, "mood": 0}}}},
    {{"emoji": "💡", "text": "вариант действия 2", "delta": {{"energy": 0, "stress": 0, "skills": 0, "mood": 0}}}},
    {{"emoji": "🤝", "text": "вариант действия 3", "delta": {{"energy": 0, "stress": 0, "skills": 0, "mood": 0}}}}
  ]
}}"""

    client = get_client()
    try:
        resp = await client.chat.completions.create(
            model=_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.85,
            max_tokens=600,
        )
        raw = resp.choices[0].message.content or "{}"
        raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(raw)
    except Exception as exc:
        logger.error("generate_simulator_scenario failed: %s", exc, exc_info=True)
        raise


async def generate_simulator_completion(
    career: str,
    final_stats: dict,
    choices_made: list[str],
) -> dict:
    score = round(
        (final_stats.get("energy", 80)
         + (100 - final_stats.get("stress", 20))
         + final_stats.get("skills", 30)
         + final_stats.get("mood", 70)) / 4
    )
    history = "; ".join(choices_made) if choices_made else "нет данных"

    prompt = f"""Ты — AI-советник по карьере для школьников Кыргызстана.
Ученик прошёл 7-дневную симуляцию профессии «{career}» — полную первую рабочую неделю молодого специалиста.
Итоговые параметры после недели: Энергия={final_stats.get("energy")}%, Стресс={final_stats.get("stress")}%, Навыки={final_stats.get("skills")}%, Настрой={final_stats.get("mood")}%
Ключевые решения за неделю: {history}
Итоговый балл совпадения с профессией: {score}%

Напиши 4 развёрнутых персональных инсайта о том, как ученик справился с рабочей неделей в профессии «{career}».
Каждый инсайт — конкретное наблюдение за поведением + вывод о карьерном потенциале.
Учитывай специфику Кыргызстана: рынок труда, культуру, реальные возможности.
Верни ТОЛЬКО JSON:
{{"insights": ["инсайт 1", "инсайт 2", "инсайт 3", "инсайт 4"], "score": {score}}}"""

    client = get_client()
    try:
        resp = await client.chat.completions.create(
            model=_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=650,
        )
        raw = resp.choices[0].message.content or "{}"
        raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        parsed = json.loads(raw)
        parsed["score"] = score
        return parsed
    except Exception as exc:
        logger.error("generate_simulator_completion failed: %s", exc, exc_info=True)
        raise
