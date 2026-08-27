from flask import Blueprint

from app.controllers.admin_controller import AdminController


admin_bp = Blueprint(
    "admin",
    __name__
)


@admin_bp.route(
    "/content-managers",
    methods=["POST"]
)
def create_content_manager():

    return AdminController.create_content_manager()