from app.ai.nlp.text_processor import clean_text


INTENTS = {
    "learning_goal": [
        "learn",
        "study",
        "become",
        "career",
        "roadmap",
        "path"
    ],
    "recommendation": [
        "recommend",
        "suggest",
        "course",
        "courses",
        "resource"
    ],
    "progress": [
        "progress",
        "completed",
        "finish",
        "finished",
        "skill"
    ],
    "roadmap": [
        "roadmap",
        "steps",
        "sequence",
        "path"
    ]
}


def classify_intent(text):

    text = clean_text(text)

    scores = {}

    for intent, keywords in INTENTS.items():

        score = 0

        for keyword in keywords:
            if keyword in text:
                score += 1

        scores[intent] = score

    best_intent = max(scores, key=scores.get)

    if scores[best_intent] == 0:
        best_intent = "learning_goal"

    return {
        "intent": best_intent,
        "scores": scores
    }