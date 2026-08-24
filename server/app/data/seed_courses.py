from app.config.database import get_db


courses = [

    {
        "title": "Python for Beginners",

        "description":
            "Learn Python programming fundamentals "
            "including variables, loops, functions "
            "and object oriented programming.",

        "skills": [
            "Python",
            "Programming",
            "OOP"
        ],

        "topics": [
            "Python",
            "Programming Fundamentals"
        ],

        "level": "beginner",

        "duration": "6 weeks"
    },

    {
        "title": "Machine Learning Fundamentals",

        "description":
            "Learn supervised learning, unsupervised "
            "learning, regression, classification and "
            "machine learning algorithms.",

        "skills": [
            "Python",
            "Machine Learning",
            "Statistics"
        ],

        "topics": [
            "Machine Learning",
            "Regression",
            "Classification"
        ],

        "level": "intermediate",

        "duration": "8 weeks"
    },

    {
        "title": "Deep Learning with Python",

        "description":
            "Learn neural networks, deep learning, "
            "CNNs, RNNs and model training using Python.",

        "skills": [
            "Python",
            "Deep Learning",
            "Neural Networks",
            "TensorFlow"
        ],

        "topics": [
            "Deep Learning",
            "Neural Networks",
            "TensorFlow"
        ],

        "level": "advanced",

        "duration": "10 weeks"
    },

    {
        "title": "Natural Language Processing",

        "description":
            "Learn NLP, text preprocessing, TF-IDF, "
            "text classification, embeddings and "
            "language models.",

        "skills": [
            "Python",
            "NLP",
            "Machine Learning",
            "TF-IDF"
        ],

        "topics": [
            "NLP",
            "Text Processing",
            "TF-IDF"
        ],

        "level": "intermediate",

        "duration": "8 weeks"
    },

    {
        "title": "Data Structures and Algorithms",

        "description":
            "Learn arrays, linked lists, stacks, queues, "
            "trees, graphs and algorithmic problem solving.",

        "skills": [
            "Java",
            "Data Structures",
            "Algorithms"
        ],

        "topics": [
            "DSA",
            "Algorithms",
            "Problem Solving"
        ],

        "level": "beginner",

        "duration": "10 weeks"
    }

]


def seed():

    db = get_db()

    db.courses.delete_many({})

    db.courses.insert_many(courses)

    print(
        f"Inserted {len(courses)} courses"
    )


if __name__ == "__main__":
    seed()