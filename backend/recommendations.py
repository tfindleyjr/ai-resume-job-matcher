def generate_recommendations(
    missing_skills: list[str],
    skill_match_score: int,
    semantic_score: int,
) -> list[dict]:

    recommendations = []

    # ---------------------------------------------------------
    # MISSING SKILL RECOMMENDATIONS
    # ---------------------------------------------------------

    for skill in missing_skills[:5]:
        recommendations.append(
            {
                "title": f"Consider adding {skill}",
                "description": (
                    f"{skill} was detected in the job description "
                    "but was not detected in your resume. "
                    "If you have experience with this skill, "
                    "consider highlighting it in your skills, "
                    "projects, or experience sections."
                ),
                "type": "missing_skill",
            }
        )

    # ---------------------------------------------------------
    # SKILL MATCH RECOMMENDATION
    # ---------------------------------------------------------

    if skill_match_score < 50:
        recommendations.append(
            {
                "title": "Strengthen your technical alignment",
                "description": (
                    "Your resume currently matches fewer than half "
                    "of the technical skills detected in this job. "
                    "Review the job requirements and emphasize any "
                    "relevant technologies or experience you "
                    "already possess."
                ),
                "type": "skill_match",
            }
        )

    elif skill_match_score < 75:
        recommendations.append(
            {
                "title": "Highlight more relevant technical skills",
                "description": (
                    "Your resume shows a solid technical foundation, "
                    "but several skills requested by the employer "
                    "are not clearly represented. Strengthening "
                    "these areas could improve your match."
                ),
                "type": "skill_match",
            }
        )

    else:
        recommendations.append(
            {
                "title": "Strong technical alignment",
                "description": (
                    "Your resume already contains most of the "
                    "technical skills detected in this job. Focus "
                    "on demonstrating those skills through measurable "
                    "projects and accomplishments."
                ),
                "type": "strength",
            }
        )

    # ---------------------------------------------------------
    # SEMANTIC RECOMMENDATION
    # ---------------------------------------------------------

    if semantic_score < 50:
        recommendations.append(
            {
                "title": "Use more job-specific language",
                "description": (
                    "The overall language of your resume differs "
                    "significantly from this job description. "
                    "Consider describing your relevant experience "
                    "using terminology that more closely reflects "
                    "the responsibilities of the position."
                ),
                "type": "semantic",
            }
        )

    elif semantic_score < 75:
        recommendations.append(
            {
                "title": "Improve contextual alignment",
                "description": (
                    "Your resume has moderate similarity to the "
                    "job description. Consider emphasizing projects, "
                    "responsibilities, and accomplishments that are "
                    "most relevant to this specific role."
                ),
                "type": "semantic",
            }
        )

    else:
        recommendations.append(
            {
                "title": "Strong contextual alignment",
                "description": (
                    "The overall meaning of your resume aligns well "
                    "with this job description. Continue focusing on "
                    "specific accomplishments that demonstrate your "
                    "fit for the position."
                ),
                "type": "strength",
            }
        )

    return recommendations