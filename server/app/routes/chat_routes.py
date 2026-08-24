from flask import Blueprint
from app.controllers.chat_controller import ChatController


chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/", methods=["POST"])
def send_message():
    return ChatController.send_message()


@chat_bp.route("/history", methods=["GET"])
def get_history():
    return ChatController.get_history()