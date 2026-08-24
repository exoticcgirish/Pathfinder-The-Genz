from flask import Blueprint, request, jsonify

from app.models.roadmap_model import RoadmapModel

roadmap_bp = Blueprint("roadmaps", __name__)


@roadmap_bp.route("/", methods=["GET"])
def get_roadmaps():

    roadmaps = RoadmapModel.get_all()

    return jsonify({
        "success": True,
        "count": len(roadmaps),
        "roadmaps": roadmaps
    }), 200


@roadmap_bp.route("/", methods=["POST"])
def create_roadmap():

    data = request.get_json() or {}

    if not data.get("careerGoal"):
        return jsonify({
            "success": False,
            "message": "careerGoal is required"
        }), 400

    roadmap = RoadmapModel.create(data)

    return jsonify({
        "success": True,
        "roadmap": roadmap
    }), 201


@roadmap_bp.route("/career/<career_goal>", methods=["GET"])
def get_by_career(career_goal):

    roadmap = RoadmapModel.get_by_career(career_goal)

    if not roadmap:
        return jsonify({
            "success": False,
            "message": "Roadmap not found"
        }), 404

    return jsonify({
        "success": True,
        "roadmap": roadmap
    }), 200