from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.chat_model import ChatModel
from app.ai.llm.llm_client import generate_response
from app.ai.llm.prompts import chat_prompt


class ChatController:

    @staticmethod
    @jwt_required()
    def send_message():

        data = request.get_json() or {}

        message = data.get("message", "").strip()

        if not message:
            return jsonify({
                "success": False,
                "message": "Message is required"
            }), 400

        # Get real logged-in user from JWT
        user_id = get_jwt_identity()

        prompt = chat_prompt(message)
        response = generate_response(prompt)

        chat = ChatModel.create(
            user_id,
            message,
            response
        )

        return jsonify({
            "success": True,
            "chat": {
                "userId": chat["userId"],
                "message": chat["message"],
                "response": chat["response"],
                "createdAt": chat["createdAt"]
            }
        }), 201


    @staticmethod
    @jwt_required()
    def get_history():

        # Get real logged-in user from JWT
        user_id = get_jwt_identity()

        chats = ChatModel.get_by_user(user_id)

        return jsonify({
            "success": True,
            "count": len(chats),
            "chats": chats
        }), 200