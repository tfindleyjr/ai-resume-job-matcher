import math
import re
from collections import Counter


def tokenize(text: str) -> list[str]:
    text = text.lower()

    words = re.findall(
        r"[a-z0-9+#.-]+",
        text,
    )

    stop_words = {
        "a",
        "an",
        "and",
        "are",
        "as",
        "at",
        "be",
        "by",
        "for",
        "from",
        "has",
        "have",
        "in",
        "is",
        "it",
        "of",
        "on",
        "or",
        "that",
        "the",
        "this",
        "to",
        "was",
        "were",
        "will",
        "with",
        "you",
        "your",
    }

    return [
        word
        for word in words
        if word not in stop_words
        and len(word) > 1
    ]


def cosine_similarity(
    first_words: list[str],
    second_words: list[str],
) -> float:
    first_counter = Counter(first_words)
    second_counter = Counter(second_words)

    all_words = set(first_counter) | set(second_counter)

    dot_product = sum(
        first_counter[word]
        * second_counter[word]
        for word in all_words
    )

    first_magnitude = math.sqrt(
        sum(
            value ** 2
            for value in first_counter.values()
        )
    )

    second_magnitude = math.sqrt(
        sum(
            value ** 2
            for value in second_counter.values()
        )
    )

    if (
        first_magnitude == 0
        or second_magnitude == 0
    ):
        return 0.0

    return (
        dot_product
        / (
            first_magnitude
            * second_magnitude
        )
    )


def calculate_semantic_similarity(
    resume_text: str,
    job_description: str,
) -> int:
    resume_words = tokenize(
        resume_text
    )

    job_words = tokenize(
        job_description
    )

    similarity = cosine_similarity(
        resume_words,
        job_words,
    )

    semantic_score = round(
        max(
            0,
            min(similarity, 1),
        )
        * 100
    )

    return semantic_score