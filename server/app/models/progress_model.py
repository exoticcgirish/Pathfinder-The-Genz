from datetime import datetime
from app.config.database import get_db


class ProgressModel:

    @staticmethod
    def create(data):
        db = get_db()

        progress = {
            "userId": data.get("userId"),
            "courseId": data.get("courseId"),
            "courseTitle": data.get("courseTitle"),
            "skill": data.get("skill"),
            "progress": data.get("progress", 0),
            "status": data.get("status", "not_started"),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        result = db["progress"].insert_one(progress)

        progress["_id"] = str(result.inserted_id)

        return progress

    @staticmethod
    def get_all():
        db = get_db()

        progress = list(
            db["progress"].find(
                {},
                {"_id": 0}
            )
        )

        return progress

    @staticmethod
    def get_by_user(user_id):
        db = get_db()

        progress = list(
            db["progress"].find(
                {"userId": user_id},
                {"_id": 0}
            )
        )

        return progress

    @staticmethod
    def update(progress_id, percentage, status):
        from bson import ObjectId

        db = get_db()

        result = db["progress"].update_one(
            {"_id": ObjectId(progress_id)},
            {
                "$set": {
                    "progress": percentage,
                    "status": status,
                    "updatedAt": datetime.utcnow()
                }
            }
        )

        return result.modified_count > 0