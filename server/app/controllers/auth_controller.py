from flask import request, jsonify

from app.services.auth_service import AuthService


class AuthController:

    @staticmethod
    def register():

        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({
                "success": False,
                "message": "All fields are required"
            }), 400

        user, error = AuthService.register(
            name,
            email,
            password
        )

        if error:
            return jsonify({
                "success": False,
                "message": error
            }), 400

        user.pop("password", None)
        user.pop("_id", None)

        return jsonify({
            "success": True,
            "message": "Registration successful",
            "user": user
        }), 201


    @staticmethod
    def login():

        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        token, error = AuthService.login(
            email,
            password
        )

        if error:
            return jsonify({
                "success": False,
                "message": error
            }), 401

        return jsonify({
            "success": True,
            "token": token
        }), 200