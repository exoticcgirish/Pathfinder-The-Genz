from flask import Blueprint

from app.controllers.course_controller import CourseController


course_bp = Blueprint(
    "courses",
    __name__
)


# =========================
# GET COURSES
# =========================

@course_bp.route(
    "",
    methods=["GET"]
)
def get_courses():

    return CourseController.get_all()


# =========================
# GET ONE COURSE
# =========================

@course_bp.route(
    "/<course_id>",
    methods=["GET"]
)
def get_course(course_id):

    return CourseController.get_one(
        course_id
    )


# =========================
# CREATE COURSE
# ADMIN + CONTENT MANAGER
# =========================

@course_bp.route(
    "",
    methods=["POST"]
)
def create_course():

    return CourseController.create()


# =========================
# UPDATE COURSE
# ADMIN + CONTENT MANAGER
# =========================

@course_bp.route(
    "/<course_id>",
    methods=["PUT"]
)
def update_course(course_id):

    return CourseController.update(
        course_id
    )


# =========================
# DELETE COURSE
# ADMIN + CONTENT MANAGER
# =========================

@course_bp.route(
    "/<course_id>",
    methods=["DELETE"]
)
def delete_course(course_id):

    return CourseController.delete(
        course_id
    )