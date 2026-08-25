import re
from functools import lru_cache

from transformers import (
    AutoModelForSeq2SeqLM,
    AutoTokenizer,
)


MODEL_NAME = "google/flan-t5-small"


@lru_cache(maxsize=1)
def load_model():
    tokenizer = AutoTokenizer.from_pretrained(
        MODEL_NAME
    )

    model = AutoModelForSeq2SeqLM.from_pretrained(
        MODEL_NAME
    )

    return tokenizer, model


def extract_numbers(text: str) -> set[str]:
    return set(
        re.findall(
            r"\b\d+(?:\.\d+)?%?\b",
            text
        )
    )


def contains_new_missing_skill(
    original: str,
    candidate: str,
    missing_skills: list[str],
) -> bool:

    original_lower = original.lower()
    candidate_lower = candidate.lower()

    for skill in missing_skills:

        skill_lower = skill.lower()

        if (
            skill_lower in candidate_lower
            and skill_lower not in original_lower
        ):
            return True

    return False


def passes_guardrails(
    original: str,
    candidate: str,
    missing_skills: list[str],
) -> bool:

    if not candidate.strip():
        return False

    original_numbers = extract_numbers(
        original
    )

    candidate_numbers = extract_numbers(
        candidate
    )

    # Do not allow the model to invent or alter
    # numerical accomplishments.
    if original_numbers != candidate_numbers:
        return False

    # Do not allow missing job skills to be inserted
    # into a bullet that never mentioned them.
    if contains_new_missing_skill(
        original,
        candidate,
        missing_skills,
    ):
        return False

    # Prevent unusually long hallucinated rewrites.
    if len(candidate) > max(
        len(original) * 2,
        len(original) + 100,
    ):
        return False

    return True


def generate_ai_rewrite(
    original: str,
    job_description: str,
    matched_skills: list[str],
    missing_skills: list[str],
) -> str | None:

    tokenizer, model = load_model()

    matched_text = (
        ", ".join(matched_skills[:8])
        if matched_skills
        else "none"
    )

    prompt = f"""
Rewrite this resume bullet to be more professional,
concise, action-oriented, and relevant to the job.

STRICT RULES:
- Preserve every fact from the original.
- Do not invent numbers.
- Do not invent accomplishments.
- Do not add technologies or skills that are not
  already stated in the original bullet.
- Do not claim experience the candidate did not state.
- Return only one rewritten resume bullet.

Original bullet:
{original}

Relevant skills already present in the resume:
{matched_text}

Job description:
{job_description[:1500]}

Rewritten bullet:
"""

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=1024,
    )

    outputs = model.generate(
        **inputs,
        max_new_tokens=120,
        num_beams=4,
        do_sample=False,
        early_stopping=True,
    )

    candidate = tokenizer.decode(
        outputs[0],
        skip_special_tokens=True,
    ).strip()

    candidate = candidate.strip(
        "\"' "
    )

    if passes_guardrails(
        original,
        candidate,
        missing_skills,
    ):
        return candidate

    return None