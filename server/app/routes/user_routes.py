from flask import Blueprint

from app.controllers.user_controller import UserController


user_bp = Blueprint(
    "users",
    __name__
)


@user_bp.route("/profile", methods=["GET"])
def get_profile():
    return UserController.get_profile()


@user_bp.route("/profile", methods=["PUT"])
def update_profile():
    return UserController.update_profile()