from flask import jsonify

from app.services.course_service import CourseService


class CourseController:

    @staticmethod
    def get_all():

        courses = CourseService.get_courses()

        return jsonify({
            "success": True,
            "courses": courses
        })

    @staticmethod
    def get_one(course_id):

        course = CourseService.get_course(course_id)

        if not course:

            return jsonify({
                "success": False,
                "message": "Course not found"
            }), 404

        return jsonify({
            "success": True,
            "course": course
        })