import re


def extract_numbers(
    text: str,
) -> set[str]:
    return set(
        re.findall(
            r"\b\d+(?:\.\d+)?%?\b",
            text,
        )
    )


def contains_new_missing_skill(
    original: str,
    candidate: str,
    missing_skills: list[str],
) -> bool:
    original_lower = (
        original.lower()
    )

    candidate_lower = (
        candidate.lower()
    )

    for skill in missing_skills:
        skill_lower = skill.lower()

        if (
            skill_lower
            in candidate_lower
            and skill_lower
            not in original_lower
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

    original_numbers = (
        extract_numbers(original)
    )

    candidate_numbers = (
        extract_numbers(candidate)
    )

    if (
        original_numbers
        != candidate_numbers
    ):
        return False

    if contains_new_missing_skill(
        original,
        candidate,
        missing_skills,
    ):
        return False

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
    """
    Production-safe lightweight mode.

    Local generative models are disabled because
    the deployment environment has limited memory.

    Returning None tells resume_optimization.py
    to use the safe deterministic fallback.
    """

    return None