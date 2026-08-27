from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.config.database import get_db
from bson import ObjectId

progress_bp = Blueprint("progress", __name__)


@progress_bp.route("/start/<course_id>", methods=["POST"])
@jwt_required()
def start_course(course_id):

    db = get_db()

    user_id = get_jwt_identity()

    existing = db.progress.find_one({
        "user_id": user_id,
        "course_id": course_id
    })

    if existing:
        return jsonify({
            "success": True,
            "message": "Course already started",
            "progress": {
                "course_id": course_id,
                "percentage": existing.get("percentage", 0)
            }
        })

    progress = {
        "user_id": user_id,
        "course_id": course_id,
        "percentage": 0,
        "completed_topics": [],
        "status": "in_progress"
    }

    result = db.progress.insert_one(progress)

    return jsonify({
        "success": True,
        "message": "Course started",
        "progress": {
            "id": str(result.inserted_id),
            "course_id": course_id,
            "percentage": 0,
            "status": "in_progress"
        }
    }), 201