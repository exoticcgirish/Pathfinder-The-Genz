from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

from app.ai.recommendation.similarity import skill_similarity
from app.ai.recommendation.ranking import rank_courses
from app.ai.recommendation.skill_gap import calculate_skill_gap


class Recommender:

    @staticmethod
    def recommend(
        user_profile,
        courses,
        required_skills=None,
        top_n=5
    ):

        if not courses:
            return {
                "recommendations": [],
                "skill_gap": {}
            }

        interests = user_profile.get("interests", [])
        career_goal = user_profile.get("careerGoal", "")
        experience = user_profile.get("experienceLevel", "")
        user_skills = user_profile.get("skills", [])

        required_skills = required_skills or []

        # Normalize skills
        user_skills = [
            skill.lower().strip()
            for skill in user_skills
        ]

        required_skills = [
            skill.lower().strip()
            for skill in required_skills
        ]

        # -------------------------
        # Skill Gap
        # -------------------------

        gap = calculate_skill_gap(
            user_skills,
            required_skills
        )

        missing_skills = gap["missing"]

        # -------------------------
        # User text
        # -------------------------

        user_text = " ".join([
            career_goal,
            experience,
            " ".join(interests),
            " ".join(user_skills)
        ])

        # -------------------------
        # Course text
        # -------------------------

        course_texts = []

        for course in courses:

            text = " ".join([
                course.get("title", ""),
                course.get("description", ""),
                " ".join(course.get("skills", [])),
                " ".join(course.get("topics", []))
            ])

            course_texts.append(text)

        # -------------------------
        # TF-IDF
        # -------------------------

        documents = [user_text] + course_texts

        vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            sublinear_tf=True
        )

        matrix = vectorizer.fit_transform(documents)

        user_vector = matrix[0]
        course_vectors = matrix[1:]

        tfidf_scores = linear_kernel(
            user_vector,
            course_vectors
        ).flatten()

        # -------------------------
        # Score courses
        # -------------------------

        results = []

        for index, course in enumerate(courses):

            course_skills = [
                skill.lower().strip()
                for skill in course.get("skills", [])
            ]

            # User skill similarity
            skill_score = skill_similarity(
                user_skills,
                course_skills
            )

            # Missing skill match
            missing_matches = set(
                course_skills
            ).intersection(
                missing_skills
            )

            if missing_skills:
                missing_score = (
                    len(missing_matches)
                    / len(missing_skills)
                )
            else:
                missing_score = 0

            tfidf_score = float(
                tfidf_scores[index]
            )

            # -------------------------
            # Final score
            # -------------------------

            final_score = (
                tfidf_score * 0.50
                +
                skill_score * 0.15
                +
                missing_score * 0.35
            )

            course_copy = course.copy()

            course_copy["score"] = round(
                final_score * 100,
                2
            )

            course_copy["matchedMissingSkills"] = sorted(
                list(missing_matches)
            )

            course_copy.pop("_id", None)

            results.append(course_copy)

        # -------------------------
        # Rank
        # -------------------------

        results = rank_courses(results)

        return {
            "recommendations": results[:top_n],
            "skill_gap": gap
        }