import os
import json
import logging
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

_PROVIDERS: dict[str, dict] = {
    "groq": {
        "env":      "GROQ_API_KEY",
        "base_url": "https://api.groq.com/openai/v1",
        "model":    "llama-3.3-70b-versatile",
    },
    "openai": {
        "env":      "OPENAI_API_KEY",
        "base_url": None,
        "model":    "gpt-4o-mini",
    },
    "gemini": {
        "env":      "GEMINI_API_KEY",
        "base_url": "https://generativelanguage.googleapis.com/openai/",
        "model":    "gemini-2.0-flash",
    },
}

_client: AsyncOpenAI | None = None
_model: str = "gpt-4o-mini"


def get_client() -> AsyncOpenAI:
    global _client, _model
    if _client is not None:
        return _client

    # Явно выбранный провайдер через AI_PROVIDER=groq/openai/gemini
    explicit = os.getenv("AI_PROVIDER", "").strip().lower()
    if explicit and explicit in _PROVIDERS:
        cfg = _PROVIDERS[explicit]
        key = os.getenv(cfg["env"], "").strip()
        if not key:
            raise RuntimeError(
                f"AI_PROVIDER={explicit} но {cfg['env']} не задан"
            )
        logger.info("Using %s (explicit AI_PROVIDER)", explicit)
        kwargs = {"api_key": key}
        if cfg["base_url"]:
            kwargs["base_url"] = cfg["base_url"]
        _client = AsyncOpenAI(**kwargs)
        _model = cfg["model"]
        return _client

    # Авто-определение: первый найденный ключ
    for name, cfg in _PROVIDERS.items():
        key = os.getenv(cfg["env"], "").strip()
        if key:
            logger.info("Using %s (auto-detected)", name)
            kwargs = {"api_key": key}
            if cfg["base_url"]:
                kwargs["base_url"] = cfg["base_url"]
            _client = AsyncOpenAI(**kwargs)
            _model = cfg["model"]
            return _client

    raise RuntimeError(
        "Нужен один из: GROQ_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY"
    )


_INSIGHTS_LANG: dict[str, dict[str, str]] = {
    "ru": {
        "persona":   "Ты — AI-советник по карьере для школьников Кыргызстана.",
        "task":      "Напиши 4 персональных инсайта на русском языке.",
        "rules":     "Каждый — 1–2 предложения, конкретный, практичный. Не начинай со слова «Ты».",
        "context":   "Учитывай реалии Кыргызстана: рынок труда, культуру, возможности.",
        "json_hint": '["инсайт 1", "инсайт 2", "инсайт 3", "инсайт 4"]',
    },
    "en": {
        "persona":   "You are an AI career advisor for high school students in Kyrgyzstan.",
        "task":      "Write 4 personal insights strictly in English.",
        "rules":     "Each insight: 1–2 sentences, specific and practical. Do not start with the word 'You'.",
        "context":   "Consider the realities of Kyrgyzstan: job market, culture, and opportunities.",
        "json_hint": '["insight 1", "insight 2", "insight 3", "insight 4"]',
    },
    "ky": {
        "persona":   "Сен Кыргызстандагы мектеп окуучулары үчүн AI мансап кеңешчисисиң.",
        "task":      "4 жеке инсайт жаз катуу кыргыз тилинде.",
        "rules":     "Ар бири 1–2 сүйлөм, конкреттүү жана практикалык. «Сен» сөзүнөн баштаба.",
        "context":   "Кыргызстандын эмгек рыногун, маданиятын жана мүмкүнчүлүктөрүн эске ал.",
        "json_hint": '["инсайт 1", "инсайт 2", "инсайт 3", "инсайт 4"]',
    },
}

async def generate_ai_insights(
    scores: dict,
    riasec_code: str,
    top_career: str,
    lang: str = "ru",
) -> list[str]:
    lc = _INSIGHTS_LANG.get(lang, _INSIGHTS_LANG["ru"])

    VALUE_LABELS = {
        "autonomy": "autonomy / самостоятельность",
        "impact": "impact / влияние на мир",
        "creativity": "creativity / творчество",
        "security": "stability / стабильность",
        "recognition": "recognition / признание",
        "growth": "growth / развитие",
        "money": "high income / высокий доход",
    }
    sorted_vals = sorted(
        [(k, scores.get(k, 0)) for k in VALUE_LABELS],
        key=lambda x: -x[1],
    )
    top_vals = ", ".join(VALUE_LABELS[k] for k, _ in sorted_vals[:2])
    style = "analytical" if scores.get("analytical", 0) >= scores.get("intuitive", 0) else "intuitive"
    orient = "people-oriented" if scores.get("people", 0) > scores.get("things", 0) else "task-oriented"

    prompt = f"""{lc["persona"]}

Student profile:
- RIASEC code: {riasec_code}
- Best career match: {top_career}
- Top values: {top_vals}
- Thinking style: {style}
- Orientation: {orient}
- RIASEC scores: R={scores.get("R",0):.1f}, I={scores.get("I",0):.1f}, A={scores.get("A",0):.1f}, S={scores.get("S",0):.1f}, E={scores.get("E",0):.1f}, C={scores.get("C",0):.1f}

{lc["task"]}
{lc["rules"]}
{lc["context"]}

Return ONLY a JSON array of strings, no extra text:
{lc["json_hint"]}"""

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


# Языковые инструкции для сценариев симулятора
_SCENARIO_LANG: dict[str, dict[str, str]] = {
    "ru": {
        "lang_note": "Все текстовые поля отвечай строго на русском языке.",
        "intro": "Ты — создатель карьерного симулятора для школьников Кыргызстана.",
    },
    "en": {
        "lang_note": "Write ALL text fields strictly in English. Do not use Russian or Kyrgyz.",
        "intro": "You are a career simulator creator for high school students in Kyrgyzstan.",
    },
    "ky": {
        "lang_note": "Бардык текст талааларын катуу кыргыз тилинде жаз. Орусча же башка тилде жазба.",
        "intro": "Сен Кыргызстандагы мектеп окуучулары үчүн мансаптык симулятордун жаратуучусусуң.",
    },
}

async def generate_simulator_scenario(
    career: str,
    step: int,       # глобальный шаг: 0-20 (7 дней × 3 ситуации)
    total_steps: int,
    previous_choices: list[str],
    current_stats: dict,
    lang: str = "ru",
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

    lc      = _SCENARIO_LANG.get(lang, _SCENARIO_LANG["ru"])
    recent  = previous_choices[-6:] if previous_choices else []
    history = f"\nRecent student decisions: {'; '.join(recent)}" if recent else ""

    prompt = f"""{lc["intro"]}
{lc["lang_note"]}

Career/Profession: {career}
Work week: day {day_num} of {total_days} — {day_theme}
Time slot: {time_label} ({part_label})
Current stats: Energy={current_stats.get("energy", 80)}%, Stress={current_stats.get("stress", 20)}%, Skills={current_stats.get("skills", 30)}%, Mood={current_stats.get("mood", 70)}%{history}

Create a realistic, vivid work situation for the career «{career}» typical for day {day_num}.
The situation must be specific to this profession, educational, and reflect real working moments.
Each of the 3 choices affects Energy, Stress, Skills, Mood differently (values from -20 to +20).

IMPORTANT: {lc["lang_note"]}

Return ONLY valid JSON (no markdown, no comments):
{{
  "time": "{time_label} · short situation title (3-5 words)",
  "text": "situation description (2-3 sentences, vivid and specific)",
  "choices": [
    {{"emoji": "🎯", "text": "action choice 1", "delta": {{"energy": 0, "stress": 0, "skills": 0, "mood": 0}}}},
    {{"emoji": "💡", "text": "action choice 2", "delta": {{"energy": 0, "stress": 0, "skills": 0, "mood": 0}}}},
    {{"emoji": "🤝", "text": "action choice 3", "delta": {{"energy": 0, "stress": 0, "skills": 0, "mood": 0}}}}
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


_COMPLETION_LANG: dict[str, dict[str, str]] = {
    "ru": {
        "persona": "Ты — AI-советник по карьере для школьников Кыргызстана.",
        "task":    "Напиши 4 развёрнутых персональных инсайта на русском языке о том, как ученик справился с рабочей неделей.",
        "rules":   "Каждый инсайт — конкреттное наблюдение за поведением + вывод о карьерном потенциале. Учитывай рынок труда и реалии Кыргызстана.",
        "tmpl":    '"insights": ["инсайт 1", "инсайт 2", "инсайт 3", "инсайт 4"]',
    },
    "en": {
        "persona": "You are an AI career advisor for high school students in Kyrgyzstan.",
        "task":    "Write 4 detailed personal insights strictly in English about how the student handled the work week.",
        "rules":   "Each insight: a concrete behavioral observation + conclusion about career potential. Consider Kyrgyzstan's job market and realities.",
        "tmpl":    '"insights": ["insight 1", "insight 2", "insight 3", "insight 4"]',
    },
    "ky": {
        "persona": "Сен Кыргызстандагы мектеп окуучулары үчүн AI мансап кеңешчисисиң.",
        "task":    "Окуучунун жумуш жумасы кандай өттү деп катуу кыргыз тилинде 4 жеке инсайт жаз.",
        "rules":   "Ар бири жүрүм-турумдагы конкреттүү байкоо + мансап потенциалы тууралуу жыйынтык. Кыргызстандын эмгек рыногун эске ал.",
        "tmpl":    '"insights": ["инсайт 1", "инсайт 2", "инсайт 3", "инсайт 4"]',
    },
}

async def generate_simulator_completion(
    career: str,
    final_stats: dict,
    choices_made: list[str],
    lang: str = "ru",
) -> dict:
    lc = _COMPLETION_LANG.get(lang, _COMPLETION_LANG["ru"])
    score = round(
        (final_stats.get("energy", 80)
         + (100 - final_stats.get("stress", 20))
         + final_stats.get("skills", 30)
         + final_stats.get("mood", 70)) / 4
    )
    history = "; ".join(choices_made) if choices_made else "no data"

    prompt = f"""{lc["persona"]}
The student completed a 7-day simulation of the career «{career}» — a full first work week as a young professional.
Final stats: Energy={final_stats.get("energy")}%, Stress={final_stats.get("stress")}%, Skills={final_stats.get("skills")}%, Mood={final_stats.get("mood")}%
Key decisions during the week: {history}
Final career fit score: {score}%

{lc["task"]}
{lc["rules"]}

Return ONLY valid JSON, no markdown:
{{{lc["tmpl"]}, "score": {score}}}"""

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
