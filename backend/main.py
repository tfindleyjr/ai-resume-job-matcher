from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from text_processing import compare_texts


app = FastAPI(
    title="AI Resume Job Matcher API",
    description="Backend API for analyzing resume and job description compatibility.",
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
    analysis = compare_texts(
        request.resume_text,
        request.job_description,
    )

    return {
        "message": "Resume and job description analyzed successfully",
        **analysis,
    }