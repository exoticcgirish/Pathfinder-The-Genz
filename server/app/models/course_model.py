from app.config.database import get_db


class CourseModel:

    @staticmethod
    def get_all():
        db = get_db()

        return list(
            db["courses"].find(
                {},
                {"_id": 0}
            )
        )

    @staticmethod
    def get_required_skills_for_career(career_goal):
        db = get_db()

        courses = db["courses"].find(
            {},
            {"_id": 0}
        )

        career_words = set(
            career_goal.lower().split()
        )

        matched_courses = []

        for course in courses:

            text = " ".join([
                course.get("title", ""),
                course.get("description", ""),
                " ".join(course.get("skills", [])),
                " ".join(course.get("topics", []))
            ]).lower()

            # Match career words against course content
            if any(
                word in text
                for word in career_words
                if len(word) > 2
            ):
                matched_courses.append(course)

        skills = set()

        for course in matched_courses:
            for skill in course.get("skills", []):
                skills.add(
                    skill.lower().strip()
                )

        return list(skills)