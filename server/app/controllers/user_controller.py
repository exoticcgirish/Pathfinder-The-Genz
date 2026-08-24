from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.user_service import UserService


class UserController:

    @staticmethod
    @jwt_required()
    def get_profile():

        user_id = get_jwt_identity()

        user = UserService.get_profile(user_id)

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        return jsonify({
            "success": True,
            "user": user
        }), 200

    @staticmethod
    @jwt_required()
    def update_profile():

        user_id = get_jwt_identity()

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Profile data is required"
            }), 400

        profile = {
            "experienceLevel": data.get(
                "experienceLevel",
                ""
            ),

            "careerGoal": data.get(
                "careerGoal",
                ""
            ),

            "interests": data.get(
                "interests",
                []
            ),

            "learningPreference": data.get(
                "learningPreference",
                ""
            ),

            "weeklyHours": data.get(
                "weeklyHours",
                0
            )
        }

        user = UserService.update_profile(
            user_id,
            profile
        )

        if not user:
            return jsonify({
                "success": False,
                "message": "Unable to update profile"
            }), 400

        return jsonify({
            "success": True,
            "message": "Profile updated successfully",
            "user": user
        }), 200