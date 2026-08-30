import re


SKILLS = [
    "python",
    "java",
    "javascript",
    "c++",
    "react",
    "node.js",
    "node",
    "express",
    "mongodb",
    "mysql",
    "sql",
    "html",
    "css",
    "git",
    "github",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "statistics",
    "data science",
    "data analysis",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "nlp",
    "natural language processing",
    "computer vision",
    "neural networks",
    "docker",
    "aws",
    "azure",
    "flask",
    "django"
]


def extract_skills(text):

    text = text.lower()

    found_skills = []

    for skill in SKILLS:

        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text):
            found_skills.append(skill)

    return list(dict.fromkeys(found_skills))