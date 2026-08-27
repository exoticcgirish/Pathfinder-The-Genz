from flask import request, jsonify

from app.services.admin_service import AdminService
from app.middleware.rbac import role_required


class AdminController:

    @staticmethod
    @role_required("admin")
    def create_content_manager():

        data = request.get_json() or {}

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({
                "success": False,
                "message": "Name, email and password are required"
            }), 400

        user, error = AdminService.create_content_manager(
            name,
            email,
            password
        )

        if error:
            return jsonify({
                "success": False,
                "message": error
            }), 400

        return jsonify({
            "success": True,
            "message": "Content manager created successfully",
            "user": user
        }), 201