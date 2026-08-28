from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from app.services.roadmap_service import RoadmapService


class RoadmapController:

    @staticmethod
    def generate():

        user_id = get_jwt_identity()

        roadmap, error = RoadmapService.generate(
            user_id
        )

        if error:
            return jsonify({
                "success": False,
                "message": error
            }), 400

        return jsonify({
            "success": True,
            "message": "Roadmap generated successfully",
            "roadmap": roadmap
        }), 200

    @staticmethod
    def get():

        user_id = get_jwt_identity()

        roadmap = RoadmapService.get(
            user_id
        )

        if not roadmap:
            return jsonify({
                "success": False,
                "message": "Roadmap not found"
            }), 404

        return jsonify({
            "success": True,
            "roadmap": roadmap
        }), 200