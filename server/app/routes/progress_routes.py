from flask import Blueprint

from flask_jwt_extended import (
    jwt_required
)

from app.controllers.progress_controller import (
    ProgressController
)


progress_bp = Blueprint(
    "progress",
    __name__
)


@progress_bp.route(
    "/start/<course_id>",
    methods=["POST"]
)
@jwt_required()
def start_course(
    course_id
):

    return (
        ProgressController
        .start_course(
            course_id
        )
    )


@progress_bp.route(
    "",
    methods=["GET"]
)
@jwt_required()
def get_progress():

    return (
        ProgressController
        .get_progress()
    )


@progress_bp.route(
    "/<progress_id>",
    methods=["PUT"]
)
@jwt_required()
def update_progress(
    progress_id
):

    return (
        ProgressController
        .update_progress(
            progress_id
        )
    )


@progress_bp.route(
    "/phase/<int:phase_number>/complete",
    methods=["POST"]
)
@jwt_required()
def complete_phase(
    phase_number
):

    return (
        ProgressController
        .complete_phase(
            phase_number
        )
    )