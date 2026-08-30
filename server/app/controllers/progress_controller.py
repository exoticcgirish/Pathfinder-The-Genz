from flask import (
    request,
    jsonify
)

from flask_jwt_extended import (
    get_jwt_identity
)

from app.services.progress_service import (
    ProgressService
)


class ProgressController:

    @staticmethod
    def start_course(
        course_id
    ):

        user_id = (
            get_jwt_identity()
        )

        data = (
            request.get_json()
            or {}
        )

        progress, error = (
            ProgressService
            .start_course(
                user_id=user_id,
                course_id=course_id,
                course_title=data.get(
                    "courseTitle"
                ),
                skill=data.get(
                    "skill"
                )
            )
        )

        if error:

            return jsonify({
                "success": False,
                "message": error
            }), 400

        return jsonify({
            "success": True,
            "message": "Course progress started",
            "progress": progress
        }), 201

    @staticmethod
    def get_progress():

        user_id = (
            get_jwt_identity()
        )

        progress = (
            ProgressService
            .get_user_progress(
                user_id
            )
        )

        return jsonify({
            "success": True,
            "count": len(
                progress
            ),
            "progress": progress
        }), 200

    @staticmethod
    def update_progress(
        progress_id
    ):

        user_id = (
            get_jwt_identity()
        )

        data = (
            request.get_json()
            or {}
        )

        percentage = data.get(
            "progress",
            0
        )

        try:

            percentage = int(
                percentage
            )

        except (
            TypeError,
            ValueError
        ):

            return jsonify({
                "success": False,
                "message": "progress must be a number"
            }), 400

        if (
            percentage < 0
            or percentage > 100
        ):

            return jsonify({
                "success": False,
                "message": "progress must be between 0 and 100"
            }), 400

        status = data.get(
            "status"
        )

        if not status:

            if percentage == 100:
                status = "completed"

            elif percentage > 0:
                status = "in_progress"

            else:
                status = "not_started"

        allowed_status = [
            "not_started",
            "in_progress",
            "completed"
        ]

        if status not in (
            allowed_status
        ):

            return jsonify({
                "success": False,
                "message": "Invalid status",
                "allowed": allowed_status
            }), 400

        progress, error = (
            ProgressService
            .update_progress(
                user_id=user_id,
                progress_id=progress_id,
                percentage=percentage,
                status=status,
                completed_topics=data.get(
                    "completedTopics"
                )
            )
        )

        if error:

            return jsonify({
                "success": False,
                "message": error
            }), 400

        return jsonify({
            "success": True,
            "message": "Progress updated successfully",
            "progress": progress
        }), 200

    @staticmethod
    def complete_phase(
        phase_number
    ):

        user_id = (
            get_jwt_identity()
        )

        result, error = (
            ProgressService
            .complete_phase(
                user_id,
                phase_number
            )
        )

        if error:

            return jsonify({
                "success": False,
                "message": error
            }), 400

        return jsonify({
            "success": True,
            "message": "Phase completed successfully",
            "data": result
        }), 200