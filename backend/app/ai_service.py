import os
import json
from openai import AsyncOpenAI

_client: AsyncOpenAI | None = None


def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        key = os.getenv("OPENAI_API_KEY", "")
        if not key:
            raise RuntimeError("OPENAI_API_KEY не задан")
        _client = AsyncOpenAI(api_key=key)
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
    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=700,
        response_format={"type": "json_object"},
    )
    raw = resp.choices[0].message.content or "[]"
    # model может вернуть {"insights": [...]} или просто [...]
    parsed = json.loads(raw)
    if isinstance(parsed, list):
        return parsed
    return parsed.get("insights", list(parsed.values())[0] if parsed else [])


async def generate_simulator_scenario(
    career: str,
    step: int,
    total_steps: int,
    previous_choices: list[str],
    current_stats: dict,
) -> dict:
    times = ["09:00", "12:30", "17:00"]
    parts = ["Начало рабочего дня", "Середина дня", "Конец дня — итоги"]
    history = f"\nПредыдущие решения ученика: {'; '.join(previous_choices)}" if previous_choices else ""

    prompt = f"""Ты — создатель карьерного симулятора для школьников Кыргызстана.
Профессия: {career}
День: первый рабочий день молодого специалиста
Ситуация {step + 1} из {total_steps}: {times[min(step,2)]} · {parts[min(step,2)]}
Текущие параметры: Энергия={current_stats.get("energy", 80)}%, Стресс={current_stats.get("stress", 20)}%, Навыки={current_stats.get("skills", 30)}%{history}

Создай реалистичную, конкретную ситуацию для профессии «{career}» с тремя вариантами действий.
Ситуация должна быть интересной, обучающей и отражать реальные рабочие моменты.
Каждый вариант по-разному влияет на Энергию, Стресс, Навыки, Настрой (значения от -20 до +20).

Верни ТОЛЬКО валидный JSON (без markdown, без комментариев):
{{
  "time": "{times[min(step,2)]} · краткое название (3-5 слов)",
  "text": "описание ситуации (2-3 предложения, живо и конкретно)",
  "choices": [
    {{"emoji": "🎯", "text": "вариант действия 1", "delta": {{"energy": 0, "stress": 0, "skills": 0, "mood": 0}}}},
    {{"emoji": "💡", "text": "вариант действия 2", "delta": {{"energy": 0, "stress": 0, "skills": 0, "mood": 0}}}},
    {{"emoji": "🤝", "text": "вариант действия 3", "delta": {{"energy": 0, "stress": 0, "skills": 0, "mood": 0}}}}
  ]
}}"""

    client = get_client()
    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.85,
        max_tokens=600,
    )
    raw = resp.choices[0].message.content or "{}"
    # убираем возможные markdown-блоки
    raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(raw)


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
Ученик прошёл симуляцию рабочего дня «{career}».
Итоговые параметры: Энергия={final_stats.get("energy")}%, Стресс={final_stats.get("stress")}%, Навыки={final_stats.get("skills")}%, Настрой={final_stats.get("mood")}%
Решения ученика: {history}
Балл совпадения: {score}%

Напиши 3 персональных инсайта о том, что ученик показал в симуляции.
Каждый инсайт — конкретное наблюдение + вывод о карьерном соответствии.
Верни ТОЛЬКО JSON:
{{"insights": ["инсайт 1", "инсайт 2", "инсайт 3"], "score": {score}}}"""

    client = get_client()
    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=500,
        response_format={"type": "json_object"},
    )
    raw = resp.choices[0].message.content or "{}"
    parsed = json.loads(raw)
    parsed["score"] = score
    return parsed
