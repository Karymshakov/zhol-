from typing import Any

QUESTIONS_META: dict[str, dict[str, Any]] = {
    "q1":  {"type": "choice", "optA": {"R": 2}, "optB": {"I": 2}},
    "q2":  {"type": "choice", "optA": {"A": 2}, "optB": {"S": 2}},
    "q3":  {"type": "choice", "optA": {"E": 2}, "optB": {"C": 2}},
    "q4":  {"type": "likert5", "scores": {"R": 1}},
    "q5":  {"type": "likert5", "scores": {"I": 1}},
    "q6":  {"type": "likert5", "scores": {"A": 1}},
    "q7":  {"type": "likert5", "scores": {"S": 1}},
    "q8":  {"type": "likert5", "scores": {"E": 1}},
    "q9":  {"type": "likert5", "scores": {"C": 1}},
    "q10": {"type": "choice", "optA": {"I": 2}, "optB": {"E": 2}},
    "q11": {"type": "choice", "optA": {"A": 2}, "optB": {"C": 2}},
    "q12": {"type": "choice", "optA": {"S": 2}, "optB": {"R": 2}},
    "q13": {"type": "rank"},
    "q14": {"type": "choice", "optA": {"security": 1, "structure": 1}, "optB": {"autonomy": 1, "growth": 1}},
    "q15": {"type": "likert5", "scores": {"impact": 1}},
    "q16": {"type": "likert5", "scores": {"money": 1}},
    "q17": {"type": "likert5", "scores": {"growth": 1}},
    "q18": {"type": "choice", "optA": {"S": 1, "people": 1}, "optB": {"structure": 1, "E": 1}},
    "q19": {"type": "choice", "optA": {"I": 1, "depth": 1}, "optB": {"A": 1, "breadth": 1}},
    "q20": {"type": "likert5", "scores": {"autonomy": 1}},
    "q21": {"type": "likert5", "scores": {"recognition": 1}},
    "q22": {"type": "choice", "optA": {"creativity": 1, "A": 1}, "optB": {"impact": 1, "S": 1}},
    "q23": {"type": "likert5", "scores": {"structure": 1, "C": 1}},
    "q24": {"type": "likert5", "scores": {"autonomy": 1, "E": 1}},
    "q25": {"type": "choice", "optA": {"analytical": 2, "systematic": 2}, "optB": {"intuitive": 2, "holistic": 2}},
    "q26": {"type": "choice", "optA": {"analytical": 1, "depth": 1}, "optB": {"holistic": 1, "breadth": 1}},
    "q27": {"type": "likert5", "scores": {"analytical": 1, "things": 1}},
    "q28": {"type": "likert5", "scores": {"systematic": 1, "structure": 1}},
    "q29": {"type": "choice", "optA": {"analytical": 2, "C": 1}, "optB": {"intuitive": 2, "A": 1}},
    "q30": {"type": "choice", "optA": {"analytical": 2, "I": 1, "things": 1}, "optB": {"holistic": 1, "S": 1, "people": 1}},
    "q31": {"type": "likert5", "scores": {"depth": 1, "systematic": 1}},
    "q32": {"type": "likert5", "scores": {"intuitive": 1, "creativity": 1, "A": 1}},
    "q33": {"type": "choice", "optA": {"family_influence": 2}, "optB": {"family_influence": 0}},
    "q34": {"type": "choice", "optA": {"finance_limit": 2}, "optB": {"finance_limit": 0}},
    "q35": {"type": "choice", "optA": {"mobility": 2}, "optB": {"mobility": 0}},
    "q36": {"type": "choice", "optA": {"security": 1, "money": 1}, "optB": {"growth": 1, "autonomy": 1}},
}

SCORE_KEYS = [
    "R", "I", "A", "S", "E", "C",
    "autonomy", "impact", "creativity", "security", "recognition", "growth", "money",
    "analytical", "intuitive", "systematic", "holistic",
    "depth", "breadth", "people", "things", "structure",
    "family_influence", "finance_limit", "mobility",
]


def calc_scores(answers: dict[str, Any]) -> dict[str, float]:
    scores: dict[str, float] = {k: 0.0 for k in SCORE_KEYS}

    for qid, ans in answers.items():
        meta = QUESTIONS_META.get(qid)
        if not meta:
            continue

        if meta["type"] == "likert5" and isinstance(ans, (int, float)):
            for k, v in meta.get("scores", {}).items():
                scores[k] = scores.get(k, 0) + ans * v

        elif meta["type"] == "choice" and ans in ("A", "B"):
            opt_key = "optA" if ans == "A" else "optB"
            for k, v in meta.get(opt_key, {}).items():
                scores[k] = scores.get(k, 0) + v

        elif meta["type"] == "rank" and isinstance(ans, list):
            for idx, item in enumerate(ans[:3]):
                val = item.get("val") if isinstance(item, dict) else None
                if val:
                    weight = 3 - idx
                    scores[val] = scores.get(val, 0) + weight

    return scores


def get_riasec_code(scores: dict[str, float]) -> str:
    riasec = ["R", "I", "A", "S", "E", "C"]
    sorted_keys = sorted(riasec, key=lambda k: scores.get(k, 0), reverse=True)
    return "".join(sorted_keys[:3])
