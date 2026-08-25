from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException

from text_processing import compare_texts
from skill_extraction import compare_skills
from semantic_matching import calculate_semantic_similarity
from recommendations import generate_recommendations
from resume_optimization import generate_rewrite_suggestions



app = FastAPI(
    title="AI Resume Job Matcher API",
    description=(
        "Backend API for analyzing resume and "
        "job description compatibility."
    ),
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MatchRequest(BaseModel):
    resume_text: str
    job_description: str


@app.get("/")
def read_root():
    return {
        "message": (
            "AI Resume Job Matcher API is running"
        )
    }


@app.post("/analyze")
def analyze_match(
    request: MatchRequest
):

    if not request.resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Resume text cannot be empty.",
        )

    if not request.job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty.",
        )

    if len(request.resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Resume text is too short to analyze reliably.",
        )

    if len(request.job_description.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Job description is too short to analyze reliably.",
        )

    # ------------------------------------------------
    # TEXT ANALYSIS
    # ------------------------------------------------

    text_analysis = compare_texts(
        request.resume_text,
        request.job_description,
    )

    # ------------------------------------------------
    # SKILL ANALYSIS
    # ------------------------------------------------

    skill_analysis = compare_skills(
        request.resume_text,
        request.job_description,
    )

    # ------------------------------------------------
    # SEMANTIC ANALYSIS
    # ------------------------------------------------

    semantic_score = (
        calculate_semantic_similarity(
            request.resume_text,
            request.job_description,
        )
    )

    # ------------------------------------------------
    # MATCH SCORES
    # ------------------------------------------------

    skill_match_score = skill_analysis[
        "skill_match_score"
    ]

    overall_match_score = round(
        (skill_match_score * 0.70)
        + (semantic_score * 0.30)
    )

    # ------------------------------------------------
    # RECOMMENDATIONS
    # ------------------------------------------------

    recommendations = (
        generate_recommendations(
            missing_skills=skill_analysis[
                "missing_skills"
            ],
            skill_match_score=(
                skill_match_score
            ),
            semantic_score=(
                semantic_score
            ),
        )
    )

    # ------------------------------------------------
    # AI RESUME OPTIMIZATION
    # ------------------------------------------------

    rewrite_suggestions = (
        generate_rewrite_suggestions(
            resume_text=(
                request.resume_text
            ),
            job_description=(
                request.job_description
            ),
            matched_skills=skill_analysis[
                "matched_skills"
            ],
            missing_skills=skill_analysis[
                "missing_skills"
            ],
        )
    )

    # ------------------------------------------------
    # RESPONSE
    # ------------------------------------------------

    return {
        "message": (
            "Resume and job description "
            "analyzed successfully"
        ),

        **text_analysis,
        **skill_analysis,

        "semantic_score": (
            semantic_score
        ),

        "overall_match_score": (
            overall_match_score
        ),

        "recommendations": (
            recommendations
        ),

        "rewrite_suggestions": (
            rewrite_suggestions
        ),
    }