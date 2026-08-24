SKILLS = {
    "python": "Python",
    "java": "Java",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "c++": "C++",
    "c#": "C#",
    "html": "HTML",
    "css": "CSS",

    "react": "React",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "express": "Express",
    "fastapi": "FastAPI",
    "django": "Django",
    "flask": "Flask",

    "sql": "SQL",
    "mysql": "MySQL",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mongodb": "MongoDB",
    "sqlite": "SQLite",

    "aws": "AWS",
    "amazon web services": "AWS",
    "azure": "Azure",
    "google cloud": "Google Cloud",
    "gcp": "Google Cloud",

    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "git": "Git",
    "github": "GitHub",
    "linux": "Linux",

    "rest api": "REST APIs",
    "restful api": "REST APIs",
    "restful apis": "REST APIs",
    "api development": "API Development",

    "machine learning": "Machine Learning",
    "artificial intelligence": "Artificial Intelligence",
    "ai": "Artificial Intelligence",
    "deep learning": "Deep Learning",
    "natural language processing": "Natural Language Processing",
    "nlp": "Natural Language Processing",

    "pandas": "Pandas",
    "numpy": "NumPy",
    "scikit-learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "matplotlib": "Matplotlib",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",

    "data analysis": "Data Analysis",
    "data analytics": "Data Analysis",
    "data visualization": "Data Visualization",
    "statistics": "Statistics",
    "excel": "Excel",
    "power bi": "Power BI",
    "tableau": "Tableau",

    "agile": "Agile",
    "scrum": "Scrum",
    "object oriented programming": "Object-Oriented Programming",
    "oop": "Object-Oriented Programming",

    "data structures": "Data Structures",
    "algorithms": "Algorithms",
    "software development": "Software Development",
    "software engineering": "Software Engineering",
    "testing": "Software Testing",
    "unit testing": "Unit Testing",
    "debugging": "Debugging",
}


def extract_skills(text: str) -> list[str]:
    normalized_text = text.lower()

    found_skills = set()

    for keyword, display_name in SKILLS.items():
        if keyword in normalized_text:
            found_skills.add(display_name)

    return sorted(found_skills)


def compare_skills(
    resume_text: str,
    job_description: str,
) -> dict:
    resume_skills = set(
        extract_skills(resume_text)
    )

    job_skills = set(
        extract_skills(job_description)
    )

    matched_skills = sorted(
        resume_skills.intersection(job_skills)
    )

    missing_skills = sorted(
        job_skills.difference(resume_skills)
    )

    return {
        "resume_skills": sorted(resume_skills),
        "job_skills": sorted(job_skills),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "resume_skill_count": len(resume_skills),
        "job_skill_count": len(job_skills),
        "matched_skill_count": len(matched_skills),
        "missing_skill_count": len(missing_skills),
    }