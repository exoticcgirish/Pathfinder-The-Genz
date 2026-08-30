
from flask import request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.services.recommendation_service import (
    RecommendationService
)


class RecommendationController:

    # =====================================================
    # ANALYZE + GENERATE RECOMMENDATIONS
    # =====================================================

    @staticmethod
    @jwt_required()
    def analyze():

        user_id = get_jwt_identity()

        data = request.get_json(
            silent=True
        ) or {}

        try:

            top_n = int(
                data.get(
                    "top_n",
                    5
                )
            )

        except (
            TypeError,
            ValueError
        ):

            top_n = 5

        top_n = max(
            1,
            min(
                top_n,
                10
            )
        )

        result = (
            RecommendationService
            .get_recommendations(
                user_id,
                top_n
            )
        )

        if result is None:

            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        if result.get("error"):

            return jsonify({
                "success": False,
                "message":
                    result["error"],
                "analysis":
                    result.get(
                        "analysis"
                    )
            }), 400

        return jsonify({
            "success": True,
            "message":
                "Personalized recommendations generated successfully.",
            "data":
                result
        }), 200

    # =====================================================
    # GET PERSONALIZED RECOMMENDATIONS
    # =====================================================

    @staticmethod
    @jwt_required()
    def get_recommendations():

        user_id = get_jwt_identity()

        result = (
            RecommendationService
            .get_recommendations(
                user_id,
                5
            )
        )

        if result is None:

            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        if result.get("error"):

            return jsonify({
                "success": False,
                "message":
                    result["error"],
                "analysis":
                    result.get(
                        "analysis"
                    )
            }), 400

        return jsonify({
            "success": True,
            "data": result
        }), 200