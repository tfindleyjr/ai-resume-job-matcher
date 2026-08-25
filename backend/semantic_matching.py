from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim


MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)


def calculate_semantic_similarity(
    resume_text: str,
    job_description: str,
) -> float:

    resume_embedding = model.encode(
        resume_text,
        convert_to_tensor=True,
    )

    job_embedding = model.encode(
        job_description,
        convert_to_tensor=True,
    )

    similarity = cos_sim(
        resume_embedding,
        job_embedding,
    ).item()

    semantic_score = round(
        max(0, min(similarity, 1)) * 100
    )

    return semantic_score