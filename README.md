# AI Resume & Job Matcher

An AI-powered full-stack application that analyzes a resume against a job description, identifies matching and missing skills, calculates compatibility scores, and provides recommendations for improving the resume.

## Live Demo

**Frontend:**   https://airesume-ten-opal.vercel.app
**Backend API:** https://ai-resume-job-matcher-lwgt.onrender.com

---

## Overview

The AI Resume & Job Matcher was built to help job seekers understand how closely their resume aligns with a specific job posting.

Instead of simply searching for exact keywords, the application combines text processing, skill extraction, semantic similarity, and AI-assisted resume optimization to provide a more detailed analysis.

Users can upload a PDF resume or manually enter resume text, paste a job description, and receive an analysis showing how well their experience matches the position.

---

## Features

### Resume Upload

- Upload a resume as a PDF
- Automatically extract resume text
- Manually edit or paste resume content
- File validation and upload handling

### Job Description Analysis

Users can paste a job description directly into the application for comparison against their resume.

### Match Scoring

The application calculates multiple indicators to determine how closely a resume matches a position.

Analysis includes:

- Overall match score
- Skill match score
- Semantic similarity
- Keyword overlap
- Matched skills
- Missing skills

### Skill Extraction

The backend analyzes both documents to identify relevant technical and professional skills.

This allows the application to determine which job requirements already appear in the resume and which may be missing.

### Semantic Matching

The application uses Natural Language Processing to compare the meaning of resume content with the job description rather than relying entirely on exact keyword matches.

### Resume Recommendations

Based on the analysis, users receive suggestions for improving their resume and increasing its relevance to the target position.

### AI Resume Rewriting

The application can generate improved versions of resume bullets while using safeguards designed to prevent the AI from inventing:

- Skills
- Accomplishments
- Experience
- Numerical results

The goal is to improve wording while preserving the candidate's original information.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Uvicorn

### AI / Machine Learning

- Hugging Face Transformers
- Sentence Transformers
- Natural Language Processing
- Semantic similarity
- Text embeddings
- Skill extraction

### Deployment

- Vercel — Frontend
- Render — Backend
- GitHub — Version control and source code

---

## System Architecture

```text
                         USER
                           │
                           ▼
                ┌─────────────────────┐
                │   Next.js Frontend  │
                │      (Vercel)       │
                └──────────┬──────────┘
                           │
                     HTTP / REST API
                           │
                           ▼
                ┌─────────────────────┐
                │   FastAPI Backend   │
                │      (Render)       │
                └──────────┬──────────┘
                           │
              ┌────────────┼─────────────┐
              │            │             │
              ▼            ▼             ▼
        Skill         Semantic       Resume
      Extraction      Matching      Optimization
              │            │             │
              └────────────┼─────────────┘
                           │
                           ▼
                  Match Analysis
                           │
                           ▼
                Recommendations &
                 Rewrite Suggestions
```

---

## Project Structure

```text
ai-resume-job-matcher/
│
├── backend/
│   ├── main.py
│   ├── ai_rewriter.py
│   ├── recommendations.py
│   ├── resume_optimization.py
│   ├── semantic_matching.py
│   ├── skill_extraction.py
│   ├── text_processing.py
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── AnalysisDetails.tsx
│   │   ├── JobDescriptionInput.tsx
│   │   ├── MatchScoreSection.tsx
│   │   ├── RecommendationsSection.tsx
│   │   ├── ResumeInput.tsx
│   │   └── RewriteSuggestion.tsx
│   │
│   ├── types/
│   │   └── analysis.ts
│   │
│   └── package.json
│
└── README.md
```

---

## How It Works

### 1. Resume Input

The user uploads a PDF resume or manually enters resume text.

### 2. Job Description Input

The user provides the description of the position they want to evaluate.

### 3. Frontend Request

The Next.js frontend sends the resume and job description to the FastAPI backend.

```text
POST /analyze
```

### 4. Text Processing

The backend prepares and normalizes the text for analysis.

### 5. Skill Extraction

Skills appearing in the resume and job description are identified and compared.

### 6. Semantic Analysis

Sentence embeddings are used to evaluate similarity between the resume and job description.

This allows the system to recognize related concepts even when the wording is different.

### 7. Match Calculation

The system combines multiple analysis techniques to produce compatibility information.

### 8. Recommendations

The application identifies areas where the resume could better align with the position.

### 9. AI-Assisted Rewriting

Resume bullets can be rewritten to improve clarity and relevance while guardrails attempt to preserve the factual information contained in the original resume.

---

## API

The backend is built using FastAPI.

### Health Check

```http
GET /
```

Used to verify that the API is running.

### Analyze Resume

```http
POST /analyze
```

Analyzes resume content against a supplied job description.

Example request:

```json
{
  "resume_text": "Software developer with experience building web applications...",
  "job_description": "We are seeking a software developer with experience in..."
}
```

The API returns analysis data that can include match scores, skills, recommendations, and optimization information.

---

## Running Locally

### Clone the Repository

```bash
git clone YOUR-GITHUB-REPOSITORY-URL
cd ai-resume-job-matcher
```

### Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it.

macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

The backend will run locally on:

```text
http://localhost:8000
```

FastAPI documentation will be available at:

```text
http://localhost:8000/docs
```

---

## Frontend Setup

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:3000
```

---

## Production Deployment

The application uses separate frontend and backend deployments.

```text
GitHub Repository
       │
       ├───────────────┐
       │               │
       ▼               ▼
    Vercel           Render
       │               │
       ▼               ▼
   Next.js          FastAPI
   Frontend         Backend
       │               ▲
       └──── API ───────┘
```

The frontend uses the environment variable:

```env
NEXT_PUBLIC_API_URL=
```

to determine the backend API address.

---

## Challenges & Solutions

### Connecting Separate Frontend and Backend Applications

The project uses a Next.js frontend and Python FastAPI backend running as separate services.

The solution was to build a REST API communication layer between the applications and configure CORS for frontend requests.

### Semantic Matching

Exact keyword matching alone does not always recognize related experience.

Sentence embeddings were introduced to compare the semantic meaning of resume and job-description text.

### AI Hallucination

AI-generated resume content creates the risk of inventing experience or accomplishments.

Guardrails were implemented to help prevent rewritten bullets from introducing unsupported skills, numerical achievements, or experience.

### Production Deployment

Running machine-learning dependencies in a cloud environment introduced memory and deployment constraints.

The backend architecture and dependencies were adjusted to make deployment more suitable for a resource-constrained cloud service.

---

## What I Learned

Building this project provided hands-on experience with:

- Full-stack application architecture
- REST API development
- Python backend development
- React and Next.js frontend development
- TypeScript
- API integration
- Natural Language Processing
- Text embeddings
- Semantic similarity
- AI model integration
- Prompt engineering
- AI output guardrails
- Environment variables
- CORS
- Git and GitHub
- Cloud deployment
- Debugging production applications

One of the biggest lessons from this project was learning how an AI feature fits into a complete software system. The project required more than implementing a model—it required designing the frontend experience, building the API, processing data, handling errors, managing dependencies, and deploying multiple services.

---

## Future Improvements

Potential improvements include:

- User accounts and authentication
- Resume analysis history
- Multiple resume storage
- Job application tracking
- ATS-focused scoring
- Resume section detection
- More advanced NLP models
- AI-generated cover letters
- Job recommendation features
- Resume export functionality
- Database integration
- Analytics dashboard

---

## Purpose

This project was developed as a portfolio project demonstrating skills across:

**Software Engineering • Full-Stack Development • Artificial Intelligence • Machine Learning • Natural Language Processing • API Development • Cloud Deployment**

---

## Author

**Trenton Findley Jr.**

Computer Science Graduate Student  
Kentucky State University

Portfolio: https://trenton-portfolio-5uie447oh-tfindleyjrs-projects.vercel.app

GitHub: https://github.com/tfindleyjr