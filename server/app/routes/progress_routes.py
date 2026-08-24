from flask import Blueprint, request, jsonify

from app.models.progress_model import ProgressModel


progress_bp = Blueprint(
    "progress",
    __name__
)


@progress_bp.route("/", methods=["GET"])
def get_progress():

    progress = ProgressModel.get_all()

    return jsonify({
        "success": True,
        "count": len(progress),
        "progress": progress
    }), 200


@progress_bp.route("/", methods=["POST"])
def create_progress():

    data = request.get_json() or {}

    if not data.get("courseId"):
        return jsonify({
            "success": False,
            "message": "courseId is required"
        }), 400

    progress = ProgressModel.create(data)

    return jsonify({
        "success": True,
        "progress": progress
    }), 201