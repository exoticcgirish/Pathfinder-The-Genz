from datetime import datetime

from app.config.database import get_db


class ChatModel:

    @staticmethod
    def _collection():
        return get_db()["chats"]

    @staticmethod
    def create(
        user_id,
        message,
        response,
        context_snapshot=None
    ):

        data = {
            "userId": str(user_id),
            "message": message,
            "response": response,
            "contextSnapshot": (
                context_snapshot or {}
            ),
            "createdAt": datetime.utcnow()
        }

        result = (
            ChatModel
            ._collection()
            .insert_one(data)
        )

        data["_id"] = str(
            result.inserted_id
        )

        return data

    @staticmethod
    def get_by_user(
        user_id,
        limit=50
    ):

        chats = list(
            ChatModel
            ._collection()
            .find(
                {
                    "userId": str(
                        user_id
                    )
                }
            )
            .sort(
                "createdAt",
                1
            )
            .limit(
                int(limit)
            )
        )

        result = []

        for chat in chats:

            result.append({
                "id": str(
                    chat["_id"]
                ),
                "userId": chat.get(
                    "userId"
                ),
                "message": chat.get(
                    "message",
                    ""
                ),
                "response": chat.get(
                    "response",
                    ""
                ),
                "createdAt": (
                    chat.get(
                        "createdAt"
                    ).isoformat()
                    if isinstance(
                        chat.get(
                            "createdAt"
                        ),
                        datetime
                    )
                    else chat.get(
                        "createdAt"
                    )
                )
            })

        return result

    @staticmethod
    def get_recent_by_user(
        user_id,
        limit=6
    ):

        chats = list(
            ChatModel
            ._collection()
            .find(
                {
                    "userId": str(
                        user_id
                    )
                },
                {
                    "_id": 0,
                    "message": 1,
                    "response": 1,
                    "createdAt": 1
                }
            )
            .sort(
                "createdAt",
                -1
            )
            .limit(
                int(limit)
            )
        )

        chats.reverse()

        return chats

    @staticmethod
    def clear_by_user(
        user_id
    ):

        result = (
            ChatModel
            ._collection()
            .delete_many({
                "userId": str(
                    user_id
                )
            })
        )

        return result.deleted_count