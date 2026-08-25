from app.config.database import get_db
from datetime import datetime


class ChatModel:

    @staticmethod
    def create(user_id, message, response):
        db = get_db()

        data = {
            "userId": user_id,
            "message": message,
            "response": response,
            "createdAt": datetime.utcnow()
        }

        result = db["chats"].insert_one(data)
        data["_id"] = result.inserted_id

        return data

    @staticmethod
    def get_by_user(user_id):
        db = get_db()

        return list(
            db["chats"].find(
                {"userId": user_id},
                {"_id": 0}
            ).sort("createdAt", 1)
        )