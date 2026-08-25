from app.config.database import get_db
from datetime import datetime


class SkillModel:

    @staticmethod
    def add_skill(skill, source="user"):
        db = get_db()

        skill = skill.strip().lower()

        if not skill:
            return False

        db["skills"].update_one(
            {"skill": skill},
            {
                "$set": {
                    "skill": skill,
                    "source": source,
                    "updatedAt": datetime.utcnow()
                },
                "$setOnInsert": {
                    "createdAt": datetime.utcnow()
                }
            },
            upsert=True
        )

        return True

    @staticmethod
    def get_all():
        db = get_db()

        return list(
            db["skills"]
            .find({}, {"_id": 0})
            .sort("skill", 1)
        )

    @staticmethod
    def get_skill_names():
        db = get_db()

        skills = db["skills"].find(
            {},
            {"_id": 0, "skill": 1}
        )

        return [
            item["skill"]
            for item in skills
        ]