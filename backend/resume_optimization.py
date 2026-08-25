from ai_rewriter import generate_ai_rewrite


ACTION_VERBS = (
    "developed",
    "built",
    "created",
    "implemented",
    "designed",
    "analyzed",
    "managed",
    "led",
    "optimized",
    "engineered",
)


def create_rule_based_rewrite(
    line: str,
) -> str:

    if line.lower().startswith(
        ACTION_VERBS
    ):
        return line

    if len(line) <= 1:
        return line

    return (
        "Developed "
        + line[0].lower()
        + line[1:]
    )


def generate_rewrite_suggestions(
    resume_text: str,
    job_description: str,
    matched_skills: list[str],
    missing_skills: list[str],
) -> list[dict]:

    suggestions = []

    lines = [
        line.strip()
        for line in resume_text.splitlines()
        if line.strip()
    ]

    candidate_lines = [
        line
        for line in lines
        if len(line) >= 25
    ]

    for line in candidate_lines[:5]:

        fallback_rewrite = (
            create_rule_based_rewrite(
                line
            )
        )

        ai_rewrite = generate_ai_rewrite(
            original=line,
            job_description=job_description,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
        )

        if ai_rewrite:
            suggested = ai_rewrite

            source = "ai"

            explanation = (
                "A generative language model improved "
                "the wording while guardrails checked "
                "that the rewrite did not introduce "
                "new skills or numerical claims."
            )

        else:
            suggested = fallback_rewrite

            source = "rule_based"

            explanation = (
                "The AI-generated rewrite did not pass "
                "the factual guardrails, so the system "
                "used a safer rule-based rewrite instead."
            )

        suggestions.append(
            {
                "original": line,
                "suggested": suggested,
                "reason": explanation,
                "source": source,
            }
        )

    return suggestions