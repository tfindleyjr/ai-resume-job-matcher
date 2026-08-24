import re


STOP_WORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "been",
    "being",
    "but",
    "by",
    "for",
    "from",
    "had",
    "has",
    "have",
    "he",
    "her",
    "his",
    "i",
    "in",
    "into",
    "is",
    "it",
    "its",
    "of",
    "on",
    "or",
    "our",
    "she",
    "that",
    "the",
    "their",
    "them",
    "they",
    "this",
    "to",
    "was",
    "we",
    "were",
    "will",
    "with",
    "you",
    "your",
}


def clean_text(text: str) -> str:
    text = text.lower()

    text = re.sub(r"https?://\S+", " ", text)

    text = re.sub(r"\S+@\S+", " ", text)

    text = re.sub(r"[^a-z0-9+#.\s-]", " ", text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()


def tokenize_text(text: str) -> list[str]:
    cleaned_text = clean_text(text)

    words = cleaned_text.split()

    useful_words = [
        word
        for word in words
        if word not in STOP_WORDS and len(word) > 1
    ]

    return useful_words


def unique_words(text: str) -> set[str]:
    return set(tokenize_text(text))


def compare_texts(
    resume_text: str,
    job_description: str,
) -> dict:
    resume_tokens = tokenize_text(resume_text)
    job_tokens = tokenize_text(job_description)

    resume_unique = set(resume_tokens)
    job_unique = set(job_tokens)

    shared_words = sorted(
        resume_unique.intersection(job_unique)
    )

    missing_words = sorted(
        job_unique.difference(resume_unique)
    )

    return {
        "resume_word_count": len(resume_tokens),
        "job_word_count": len(job_tokens),
        "resume_unique_word_count": len(resume_unique),
        "job_unique_word_count": len(job_unique),
        "shared_word_count": len(shared_words),
        "shared_words": shared_words[:25],
        "missing_words": missing_words[:25],
    }