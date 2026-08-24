from flask import request, jsonify

from app.models.progress_model import ProgressModel


class ProgressController:

    @staticmethod
    def update_progress():

        data = request.get_json() or {}

        course_title = data.get("courseTitle", "").strip()
        status = data.get("status", "").strip()

        if not course_title:
            return jsonify({
                "success": False,
                "message": "courseTitle is required"
            }), 400

        allowed_status = [
            "not_started",
            "in_progress",
            "completed"
        ]

        if status not in allowed_status:
            return jsonify({
                "success": False,
                "message": "Invalid status",
                "allowed": allowed_status
            }), 400

        ProgressModel.update(
            course_title,
            status
        )

        return jsonify({
            "success": True,
            "message": "Progress updated successfully",
            "courseTitle": course_title,
            "status": status
        }), 200

    @staticmethod
    def get_progress():

        progress = ProgressModel.get_all()

        return jsonify({
            "success": True,
            "count": len(progress),
            "progress": progress
        }), 200