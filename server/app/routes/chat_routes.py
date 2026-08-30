from flask import Blueprint

from flask_jwt_extended import (
    jwt_required
)

from app.controllers.chat_controller import (
    ChatController
)


chat_bp = Blueprint(
    "chat",
    __name__
)


@chat_bp.route(
    "/",
    methods=["POST"]
)
@jwt_required()
def send_message():

    return (
        ChatController
        .send_message()
    )


@chat_bp.route(
    "/history",
    methods=["GET"]
)
@jwt_required()
def get_history():

    return (
        ChatController
        .get_history()
    )


@chat_bp.route(
    "/history",
    methods=["DELETE"]
)
@jwt_required()
def clear_history():

    return (
        ChatController
        .clear_history()
    )