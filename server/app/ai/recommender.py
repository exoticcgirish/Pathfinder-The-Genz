from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel


class RecommendationEngine:

    @staticmethod
    def recommend(user_profile, courses, top_n=5):

        if not courses:
            return []


        interests = user_profile.get("interests", [])

        learner_text = " ".join([
            user_profile.get("careerGoal", ""),
            user_profile.get("experienceLevel", ""),
            user_profile.get("learningPreference", ""),
            " ".join(interests)
        ])


        course_texts = []

        for course in courses:

            text = " ".join([
                course.get("title", ""),
                course.get("description", ""),
                " ".join(course.get("skills", [])),
                " ".join(course.get("topics", []))
            ])

            course_texts.append(text)


        documents = [learner_text] + course_texts

        vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            sublinear_tf=True
        )

        matrix = vectorizer.fit_transform(documents)

        user_vector = matrix[0]
        course_vectors = matrix[1:]


        scores = linear_kernel(
            user_vector,
            course_vectors
        ).flatten()


        results = []

        for index, course in enumerate(courses):

            course_copy = course.copy()

            course_copy["score"] = round(
                float(scores[index]) * 100,
                2
            )

            course_copy.pop("_id", None)

            results.append(course_copy)


        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return results[:top_n]