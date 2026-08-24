from flask import Blueprint

course_bp = Blueprint(
    "courses",
    __name__
)


@course_bp.route("/", methods=["GET"])
def get_courses():
    return {
        "success": True,
        "courses": []
    }