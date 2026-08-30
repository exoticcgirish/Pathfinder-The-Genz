from flask import jsonify, request

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.services.skill_service import SkillService
from app.services.user_service import UserService
from app.models.user_model import UserModel


class SkillController:

    # =====================================================
    # GET ALL AVAILABLE SKILLS
    # =====================================================

    @staticmethod
    def get_skills():

        skills = SkillService.get_all_skills()

        return jsonify({
            "success": True,
            "skills": skills,
            "count": len(skills)
        }), 200

    # =====================================================
    # ANALYZE LOGGED-IN LEARNER
    # =====================================================

    @staticmethod
    @jwt_required()
    def analyze():

        user_id = get_jwt_identity()

        user = UserService.get_profile(
            user_id
        )

        if not user:

            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        profile = user.get(
            "profile",
            {}
        )

        career_goal = profile.get(
            "careerGoal",
            ""
        )

        experience_level = profile.get(
            "experienceLevel",
            ""
        )

        current_skills = user.get(
            "skills",
            []
        )

        if not career_goal:

            return jsonify({
                "success": False,
                "message":
                    "Complete your career goal before running skill analysis."
            }), 400

        analysis = (
            SkillService.analyze_skill_gap(
                career_goal,
                current_skills,
                experience_level
            )
        )

        if not analysis.get(
            "supportedCareer"
        ):

            return jsonify({
                "success": False,
                "message":
                    "This career goal is not yet available in the skill engine.",
                "analysis": analysis
            }), 422

        return jsonify({
            "success": True,
            "message":
                "Skill gap analysis completed.",
            "analysis":
                analysis
        }), 200

    # =====================================================
    # UPDATE LEARNER'S CURRENT SKILLS
    # =====================================================

    @staticmethod
    @jwt_required()
    def update_my_skills():

        user_id = get_jwt_identity()

        data = request.get_json() or {}

        skills = data.get(
            "skills",
            []
        )

        if not isinstance(skills, list):

            return jsonify({
                "success": False,
                "message": "Skills must be a list"
            }), 400

        cleaned_skills = []

        seen = set()

        for skill in skills:

            if isinstance(skill, dict):

                name = str(
                    skill.get("name", "")
                ).strip()

                level = skill.get(
                    "level",
                    0
                )

                try:
                    level = int(level)

                except (
                    TypeError,
                    ValueError
                ):
                    level = 0

                level = max(
                    0,
                    min(level, 100)
                )

            else:

                name = str(
                    skill
                ).strip()

                level = 50

            if not name:
                continue

            normalized = name.lower()

            if normalized in seen:
                continue

            seen.add(
                normalized
            )

            cleaned_skills.append({
                "name": name,
                "level": level
            })

        success = UserModel.update_skills(
            user_id,
            cleaned_skills
        )

        if not success:

            return jsonify({
                "success": False,
                "message":
                    "Unable to update skills"
            }), 400

        user = UserService.get_profile(
            user_id
        )

        return jsonify({
            "success": True,
            "message":
                "Skills updated successfully",
            "skills":
                user.get("skills", [])
        }), 200