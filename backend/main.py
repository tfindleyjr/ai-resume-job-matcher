from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()


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
    return {
        "message": "Resume and job description received",
        "resume_length": len(request.resume_text),
        "job_description_length": len(request.job_description),
    }