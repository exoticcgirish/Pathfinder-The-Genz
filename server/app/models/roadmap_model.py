from app.config.database import get_db
from datetime import datetime


class RoadmapModel:

    @staticmethod
    def create(career_goal, user_skills, required_skills, roadmap):

        db = get_db()

        data = {
            "careerGoal": career_goal,
            "userSkills": user_skills,
            "requiredSkills": required_skills,
            "roadmap": roadmap,
            "createdAt": datetime.utcnow()
        }

        result = db["roadmaps"].insert_one(data)

        data["_id"] = result.inserted_id

        return data

    @staticmethod
    def get_all():

        db = get_db()

        return list(db["roadmaps"].find())