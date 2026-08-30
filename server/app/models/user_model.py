from bson import ObjectId
from bson.errors import InvalidId

from app.config.database import get_db


class UserModel:

    collection = get_db()["users"]

    # =========================
    # CREATE
    # =========================
    @staticmethod
    def create(user_data):

        result = UserModel.collection.insert_one(
            user_data
        )

        user_data["_id"] = result.inserted_id

        return user_data

    # =========================
    # FIND BY EMAIL
    # =========================
    @staticmethod
    def find_by_email(email):

        if not email:
            return None

        return UserModel.collection.find_one({
            "email": email.strip().lower()
        })

    # =========================
    # FIND BY ID
    # =========================
    @staticmethod
    def find_by_id(user_id):

        try:

            if not ObjectId.is_valid(
                str(user_id)
            ):
                return None

            return UserModel.collection.find_one({
                "_id": ObjectId(str(user_id))
            })

        except (InvalidId, TypeError, ValueError):

            return None

    # =========================
    # UPDATE PROFILE
    # =========================
    @staticmethod
    def update_profile(
        user_id,
        profile_data
    ):

        try:

            if not ObjectId.is_valid(
                str(user_id)
            ):
                return False

            result = UserModel.collection.update_one(
                {
                    "_id": ObjectId(str(user_id))
                },
                {
                    "$set": {
                        "profile": profile_data
                    }
                }
            )

            return result.matched_count > 0

        except Exception as error:

            print(
                "UPDATE PROFILE DATABASE ERROR:",
                error
            )

            return False

    # =========================
    # UPDATE SKILLS
    # Future Step 2 use
    # =========================
    @staticmethod
    def update_skills(
        user_id,
        skills
    ):

        try:

            if not ObjectId.is_valid(
                str(user_id)
            ):
                return False

            result = UserModel.collection.update_one(
                {
                    "_id": ObjectId(str(user_id))
                },
                {
                    "$set": {
                        "skills": skills
                    }
                }
            )

            return result.matched_count > 0

        except Exception as error:

            print(
                "UPDATE SKILLS DATABASE ERROR:",
                error
            )

            return False