from flask import request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

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

        data = request.get_json() or {}

        career_goal = str(
            data.get("careerGoal", "")
        ).strip()

        experience_level = str(
            data.get("experienceLevel", "")
        ).strip().lower()

        learning_preference = str(
            data.get("learningPreference", "")
        ).strip().lower()

        interests = data.get(
            "interests",
            []
        )

        weekly_hours = data.get(
            "weeklyHours",
            0
        )


        if not career_goal:
            return jsonify({
                "success": False,
                "message": "Career goal is required"
            }), 400

        allowed_levels = [
            "beginner",
            "intermediate",
            "advanced"
        ]

        if experience_level not in allowed_levels:
            return jsonify({
                "success": False,
                "message": "Invalid experience level"
            }), 400

        allowed_preferences = [
            "project-based",
            "video",
            "reading",
            "practice"
        ]

        if learning_preference not in allowed_preferences:
            return jsonify({
                "success": False,
                "message": "Invalid learning preference"
            }), 400

        if not isinstance(interests, list):
            return jsonify({
                "success": False,
                "message": "Interests must be a list"
            }), 400

        interests = [
            str(item).strip()
            for item in interests
            if str(item).strip()
        ]

        if not interests:
            return jsonify({
                "success": False,
                "message": "At least one interest is required"
            }), 400

        try:
            weekly_hours = int(weekly_hours)

        except (TypeError, ValueError):
            return jsonify({
                "success": False,
                "message": "Weekly hours must be a number"
            }), 400

        if weekly_hours < 1 or weekly_hours > 168:
            return jsonify({
                "success": False,
                "message": "Invalid weekly learning hours"
            }), 400


        profile = {
            "careerGoal": career_goal,

            "experienceLevel":
                experience_level,

            "learningPreference":
                learning_preference,

            "interests":
                interests,

            "weeklyHours":
                weekly_hours
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