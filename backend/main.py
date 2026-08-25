from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from text_processing import compare_texts
from skill_extraction import compare_skills
from semantic_matching import calculate_semantic_similarity
from recommendations import generate_recommendations


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
        "message": "AI Resume Job Matcher API is running"
    }


@app.post("/analyze")
def analyze_match(request: MatchRequest):

    # ---------------------------------------------------------
    # TEXT ANALYSIS
    # ---------------------------------------------------------

    text_analysis = compare_texts(
        request.resume_text,
        request.job_description,
    )

    # ---------------------------------------------------------
    # SKILL ANALYSIS
    # ---------------------------------------------------------

    skill_analysis = compare_skills(
        request.resume_text,
        request.job_description,
    )

    # ---------------------------------------------------------
    # SEMANTIC AI ANALYSIS
    # ---------------------------------------------------------

    semantic_score = calculate_semantic_similarity(
        request.resume_text,
        request.job_description,
    )

    # ---------------------------------------------------------
    # OVERALL SCORE
    # ---------------------------------------------------------

    skill_match_score = skill_analysis[
        "skill_match_score"
    ]

    overall_match_score = round(
        (skill_match_score * 0.70)
        + (semantic_score * 0.30)
    )

    # ---------------------------------------------------------
    # RECOMMENDATIONS
    # ---------------------------------------------------------

    recommendations = generate_recommendations(
        missing_skills=skill_analysis["missing_skills"],
        skill_match_score=skill_match_score,
        semantic_score=semantic_score,
    )

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    return {
        "message": (
            "Resume and job description "
            "analyzed successfully"
        ),

        **text_analysis,
        **skill_analysis,

        "semantic_score": semantic_score,
        "overall_match_score": overall_match_score,
        "recommendations": recommendations,
    }