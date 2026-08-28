from bson import ObjectId

from app.config.database import get_db


class CourseModel:

    collection = get_db()["courses"]

    # =========================
    # GET ALL
    # =========================

    @staticmethod
    def get_all():
        return list(
            CourseModel.collection.find({})
        )

    # =========================
    # GET ONE
    # =========================

    @staticmethod
    def get_by_id(course_id):

        try:
            return CourseModel.collection.find_one({
                "_id": ObjectId(course_id)
            })

        except Exception:
            return None

    # =========================
    # CREATE
    # =========================

    @staticmethod
    def create(course_data):

        result = CourseModel.collection.insert_one(
            course_data
        )

        course_data["_id"] = result.inserted_id

        return course_data

    # =========================
    # UPDATE
    # =========================

    @staticmethod
    def update(course_id, course_data):

        try:

            result = CourseModel.collection.update_one(
                {
                    "_id": ObjectId(course_id)
                },
                {
                    "$set": course_data
                }
            )

            return result.matched_count > 0

        except Exception:
            return False

    # =========================
    # DELETE
    # =========================

    @staticmethod
    def delete(course_id):

        try:

            result = CourseModel.collection.delete_one({
                "_id": ObjectId(course_id)
            })

            return result.deleted_count > 0

        except Exception:
            return False

    # =========================
    # FIND COURSES FOR ROADMAP
    # =========================

    @staticmethod
    def find_matching_courses(keywords):

        if not keywords:
            return []

        conditions = []

        for keyword in keywords:

            keyword = str(keyword).strip()

            if not keyword:
                continue

            conditions.extend([
                {
                    "title": {
                        "$regex": keyword,
                        "$options": "i"
                    }
                },
                {
                    "description": {
                        "$regex": keyword,
                        "$options": "i"
                    }
                },
                {
                    "skills": {
                        "$regex": keyword,
                        "$options": "i"
                    }
                },
                {
                    "topics": {
                        "$regex": keyword,
                        "$options": "i"
                    }
                }
            ])

        if not conditions:
            return []

        return list(
            CourseModel.collection.find({
                "$or": conditions
            })
        )