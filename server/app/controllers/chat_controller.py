from flask import (
    request,
    jsonify
)

from flask_jwt_extended import (
    get_jwt_identity
)

from app.services.chat_service import (
    ChatService
)


class ChatController:

    @staticmethod
    def send_message():

        user_id = (
            get_jwt_identity()
        )

        data = (
            request.get_json()
            or {}
        )

        message = str(
            data.get(
                "message",
                ""
            )
        ).strip()

        if not message:

            return jsonify({
                "success": False,
                "message": "Message is required"
            }), 400

        if len(message) > 3000:

            return jsonify({
                "success": False,
                "message": "Message is too long"
            }), 400

        chat, error = (
            ChatService
            .send_message(
                user_id,
                message
            )
        )

        if error:

            return jsonify({
                "success": False,
                "message": error
            }), 500

        return jsonify({
            "success": True,
            "message": "AI mentor response generated",
            "chat": chat
        }), 201

    @staticmethod
    def get_history():

        user_id = (
            get_jwt_identity()
        )

        chats = (
            ChatService
            .get_history(
                user_id
            )
        )

        return jsonify({
            "success": True,
            "count": len(
                chats
            ),
            "chats": chats
        }), 200

    @staticmethod
    def clear_history():

        user_id = (
            get_jwt_identity()
        )

        deleted_count = (
            ChatService
            .clear_history(
                user_id
            )
        )

        return jsonify({
            "success": True,
            "message": "Chat history cleared",
            "deletedCount": deleted_count
        }), 200