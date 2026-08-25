def generate_rewrite_suggestions(
    resume_text: str,
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

        stronger_line = line

        if not line.lower().startswith(
            (
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
        ):
            stronger_line = (
                "Developed " +
                line[0].lower() +
                line[1:]
            )

        relevant_skills = [
            skill
            for skill in matched_skills
            if skill.lower() in line.lower()
        ]

        explanation = (
            "This rewrite strengthens the action-oriented language "
            "while preserving the experience already stated in your resume."
        )

        if relevant_skills:
            explanation += (
                " It also keeps emphasis on relevant skills such as "
                + ", ".join(relevant_skills[:3])
                + "."
            )

        suggestions.append(
            {
                "original": line,
                "suggested": stronger_line,
                "reason": explanation,
            }
        )

    return suggestions