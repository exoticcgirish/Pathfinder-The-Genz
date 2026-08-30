from datetime import datetime

from bson import ObjectId

from app.config.database import get_db


class ProgressModel:

    @staticmethod
    def _collection():
        return get_db()["progress"]

    @staticmethod
    def create(data):

        progress = {
            "userId": str(data.get("userId")),
            "courseId": str(data.get("courseId")) if data.get("courseId") else None,
            "courseTitle": data.get("courseTitle"),
            "skill": data.get("skill"),
            "phase": data.get("phase"),
            "progress": int(data.get("progress", 0)),
            "status": data.get("status", "not_started"),
            "completedTopics": data.get("completedTopics", []),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        result = ProgressModel._collection().insert_one(
            progress
        )

        progress["_id"] = str(
            result.inserted_id
        )

        return progress

    @staticmethod
    def find_by_id(progress_id):

        try:
            if not ObjectId.is_valid(str(progress_id)):
                return None

            return ProgressModel._collection().find_one({
                "_id": ObjectId(str(progress_id))
            })

        except Exception as error:

            print(
                "PROGRESS FIND ERROR:",
                error
            )

            return None

    @staticmethod
    def find_by_user_and_course(
        user_id,
        course_id
    ):

        return ProgressModel._collection().find_one({
            "userId": str(user_id),
            "courseId": str(course_id)
        })

    @staticmethod
    def find_by_user_and_phase(
        user_id,
        phase
    ):

        return ProgressModel._collection().find_one({
            "userId": str(user_id),
            "phase": int(phase)
        })

    @staticmethod
    def get_by_user(user_id):

        items = list(
            ProgressModel._collection().find({
                "userId": str(user_id)
            })
        )

        for item in items:

            item["_id"] = str(
                item["_id"]
            )

            if isinstance(
                item.get("createdAt"),
                datetime
            ):
                item["createdAt"] = (
                    item["createdAt"].isoformat()
                )

            if isinstance(
                item.get("updatedAt"),
                datetime
            ):
                item["updatedAt"] = (
                    item["updatedAt"].isoformat()
                )

        return items

    @staticmethod
    def update(
        progress_id,
        percentage,
        status,
        completed_topics=None
    ):

        try:

            if not ObjectId.is_valid(
                str(progress_id)
            ):
                return False

            update_data = {
                "progress": int(percentage),
                "status": status,
                "updatedAt": datetime.utcnow()
            }

            if completed_topics is not None:
                update_data["completedTopics"] = (
                    completed_topics
                )

            result = (
                ProgressModel._collection()
                .update_one(
                    {
                        "_id": ObjectId(
                            str(progress_id)
                        )
                    },
                    {
                        "$set": update_data
                    }
                )
            )

            return (
                result.matched_count > 0
            )

        except Exception as error:

            print(
                "PROGRESS UPDATE ERROR:",
                error
            )

            return False

    @staticmethod
    def upsert_phase_progress(
        user_id,
        phase,
        percentage,
        status
    ):

        result = (
            ProgressModel._collection()
            .update_one(
                {
                    "userId": str(user_id),
                    "phase": int(phase)
                },
                {
                    "$set": {
                        "progress": int(
                            percentage
                        ),
                        "status": status,
                        "updatedAt": datetime.utcnow()
                    },
                    "$setOnInsert": {
                        "userId": str(
                            user_id
                        ),
                        "phase": int(
                            phase
                        ),
                        "createdAt": datetime.utcnow(),
                        "completedTopics": []
                    }
                },
                upsert=True
            )
        )

        return (
            result.acknowledged
        )