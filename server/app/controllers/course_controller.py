from flask import request, jsonify

from flask_jwt_extended import get_jwt_identity

from app.services.course_service import CourseService

from app.middleware.rbac import role_required


class CourseController:

    # =========================
    # GET ALL
    # PUBLIC
    # =========================

    @staticmethod
    def get_all():

        courses = CourseService.get_courses()

        return jsonify({
            "success": True,
            "courses": courses
        }), 200

    # =========================
    # GET ONE
    # PUBLIC
    # =========================

    @staticmethod
    def get_one(course_id):

        course = CourseService.get_course(
            course_id
        )

        if not course:

            return jsonify({
                "success": False,
                "message": "Course not found"
            }), 404

        return jsonify({
            "success": True,
            "course": course
        }), 200

    # =========================
    # CREATE
    # ADMIN + CONTENT MANAGER
    # =========================

    @staticmethod
    @role_required(
        "content_manager",
        "admin"
    )
    def create():

        data = request.get_json() or {}

        manager_id = get_jwt_identity()

        course, error = CourseService.create_course(
            data,
            manager_id
        )

        if error:

            return jsonify({
                "success": False,
                "message": error
            }), 400

        return jsonify({
            "success": True,
            "message": "Course created successfully",
            "course": course
        }), 201

    # =========================
    # UPDATE
    # ADMIN + CONTENT MANAGER
    # =========================

    @staticmethod
    @role_required(
        "content_manager",
        "admin"
    )
    def update(course_id):

        data = request.get_json() or {}

        course = CourseService.update_course(
            course_id,
            data
        )

        if not course:

            return jsonify({
                "success": False,
                "message": "Course not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Course updated successfully",
            "course": course
        }), 200

    # =========================
    # DELETE
    # ADMIN + CONTENT MANAGER
    # =========================

    @staticmethod
    @role_required(
        "content_manager",
        "admin"
    )
    def delete(course_id):

        success = CourseService.delete_course(
            course_id
        )

        if not success:

            return jsonify({
                "success": False,
                "message": "Course not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Course deleted successfully"
        }), 200