from datetime import datetime

from app.models.user_model import UserModel
from app.models.course_model import CourseModel
from app.models.roadmap_model import RoadmapModel


class RoadmapService:

    @staticmethod
    def generate(user_id):

        user = UserModel.find_by_id(user_id)

        if not user:
            return None, "User not found"

        profile = user.get("profile", {})

        skills = [
            str(skill).lower().strip()
            for skill in user.get("skills", [])
        ]

        interests = [
            str(item).lower().strip()
            for item in profile.get("interests", [])
        ]

        career_goal = str(
            profile.get("careerGoal", "")
        ).lower().strip()

        experience = str(
            profile.get("experienceLevel", "")
        ).lower().strip()

        courses = CourseModel.get_all()

        scored_courses = []

        for course in courses:

            title = str(
                course.get("title", "")
            ).lower()

            description = str(
                course.get("description", "")
            ).lower()

            course_skills = [
                str(skill).lower().strip()
                for skill in course.get("skills", [])
            ]

            topics = [
                str(topic).lower().strip()
                for topic in course.get("topics", [])
            ]

            text = " ".join([
                title,
                description,
                " ".join(course_skills),
                " ".join(topics)
            ])

            score = 0

            # Existing skills
            for skill in skills:
                if skill in text:
                    score += 5

            # Interests
            for interest in interests:
                if interest in text:
                    score += 4

            # Career goal
            for word in career_goal.split():
                if len(word) > 2 and word in text:
                    score += 3

            # Experience level
            if experience and experience in title:
                score += 2

            if score > 0:
                scored_courses.append({
                    "course": course,
                    "score": score
                })

        # Highest relevance first
        scored_courses.sort(
            key=lambda item: item["score"],
            reverse=True
        )

        selected = scored_courses[:10]

        phases = []

        for index, item in enumerate(selected):

            course = item["course"]

            phases.append({
                "phase": index + 1,
                "title": course.get("title"),
                "description": course.get(
                    "description",
                    ""
                ),
                "courseId": str(
                    course["_id"]
                ),
                "skills": course.get(
                    "skills",
                    []
                ),
                "topics": course.get(
                    "topics",
                    []
                ),
                "score": item["score"],
                "status": (
                    "current"
                    if index == 0
                    else "locked"
                )
            })

        roadmap = {
            "userId": str(user_id),

            "careerGoal": profile.get(
                "careerGoal",
                ""
            ),

            "experienceLevel": profile.get(
                "experienceLevel",
                ""
            ),

            "generatedFrom": {
                "skills": user.get(
                    "skills",
                    []
                ),
                "interests": profile.get(
                    "interests",
                    []
                )
            },

            "phases": phases,

            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        existing = RoadmapModel.get_by_user(
            str(user_id)
        )

        if existing:

            RoadmapModel.update(
                str(user_id),
                roadmap
            )

            roadmap["_id"] = str(
                existing["_id"]
            )

        else:

            RoadmapModel.create(roadmap)

        return roadmap, None

    @staticmethod
    def get(user_id):

        roadmap = RoadmapModel.get_by_user(
            str(user_id)
        )

        if not roadmap:
            return None

        roadmap["_id"] = str(
            roadmap["_id"]
        )

        return roadmap