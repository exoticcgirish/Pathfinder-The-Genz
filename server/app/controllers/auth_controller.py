from flask import request, jsonify

from app.services.auth_service import AuthService


class AuthController:

    # =========================
    # REGISTER
    # =========================

    @staticmethod
    def register():

        data = request.get_json() or {}

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        # Default role
        role = data.get("role", "learner")

        if not name or not email or not password:

            return jsonify({
                "success": False,
                "message": "All fields are required"
            }), 400

        if len(password) < 6:

            return jsonify({
                "success": False,
                "message": "Password must contain at least 6 characters"
            }), 400

        # Public registration can only create these roles
        if role not in ["learner", "content_manager"]:

            return jsonify({
                "success": False,
                "message": "Invalid role"
            }), 400

        user, error = AuthService.register(
            name,
            email,
            password,
            role
        )

        if error:

            return jsonify({
                "success": False,
                "message": error
            }), 400

        # Convert MongoDB ObjectId to string
        if user and "_id" in user:
            user["_id"] = str(user["_id"])

        return jsonify({
            "success": True,
            "message": "Registration successful",
            "user": user
        }), 201

    # =========================
    # LOGIN
    # =========================

    @staticmethod
    def login():

        data = request.get_json() or {}

        email = data.get("email")
        password = data.get("password")

        if not email or not password:

            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400

        result, error = AuthService.login(
            email,
            password
        )

        if error:

            return jsonify({
                "success": False,
                "message": error
            }), 401

        user = result["user"]

        # Convert MongoDB ObjectId to string
        if user and "_id" in user:
            user["_id"] = str(user["_id"])

        return jsonify({
            "success": True,
            "message": "Login successful",
            "token": result["token"],
            "role": result["role"],
            "user": user
        }), 200