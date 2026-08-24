def build_prerequisite_graph():
    return {
        "python": [],
        "statistics": ["python"],
        "machine learning": ["python", "statistics"],
        "deep learning": ["machine learning"],
        "tensorflow": ["python", "deep learning"],
        "nlp": ["machine learning"],
        "neural networks": ["machine learning"],
        "tf-idf": ["python", "nlp"]
    }


def order_skills(skills):
    graph = build_prerequisite_graph()

    skills = [skill.lower().strip() for skill in skills]

    result = []
    visited = set()

    def visit(skill):
        if skill in visited:
            return

        for prerequisite in graph.get(skill, []):
            if prerequisite in skills:
                visit(prerequisite)

        visited.add(skill)

        if skill in skills:
            result.append(skill)

    for skill in skills:
        visit(skill)

    return result