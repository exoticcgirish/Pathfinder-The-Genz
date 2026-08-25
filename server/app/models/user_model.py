from bson import ObjectId
from app.config.database import get_db


class UserModel:

    collection = get_db()["users"]

    # -------------------------
    # AUTH
    # -------------------------

    @staticmethod
    def create(user_data):

        result = UserModel.collection.insert_one(user_data)

        user_data["_id"] = str(result.inserted_id)

        return user_data

    @staticmethod
    def find_by_email(email):

        return UserModel.collection.find_one({
            "email": email
        })

    # -------------------------
    # USER PROFILE
    # -------------------------

    @staticmethod
    def find_by_id(user_id):

        try:
            return UserModel.collection.find_one({
                "_id": ObjectId(user_id)
            })

        except Exception:
            return None

    @staticmethod
    def update_profile(user_id, profile_data):

        try:

            result = UserModel.collection.update_one(
                {
                    "_id": ObjectId(user_id)
                },
                {
                    "$set": {
                        "profile": profile_data
                    }
                }
            )

            return (
                result.modified_count > 0
                or result.matched_count > 0
            )

        except Exception:
            return False