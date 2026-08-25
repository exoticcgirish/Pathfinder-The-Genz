from flask import Blueprint, jsonify
from app.config.database import get_db


course_bp = Blueprint(
    "courses",
    __name__
)


@course_bp.route("", methods=["GET"])
def get_courses():

    try:
        db = get_db()

        courses = list(
            db["courses"].find({})
        )

        # Convert MongoDB ObjectId to string
        for course in courses:
            course["_id"] = str(course["_id"])

        return jsonify({
            "success": True,
            "courses": courses
        }), 200

    except Exception as e:

        print("COURSES ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": "Failed to load courses",
            "error": str(e)
        }), 500