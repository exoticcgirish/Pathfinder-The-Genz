from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.controllers.roadmap_controller import (
    RoadmapController
)


roadmap_bp = Blueprint(
    "roadmap",
    __name__
)


@roadmap_bp.route(
    "/generate",
    methods=["POST"]
)
@jwt_required()
def generate_roadmap():

    return RoadmapController.generate()


@roadmap_bp.route(
    "",
    methods=["GET"]
)
@jwt_required()
def get_roadmap():

    return RoadmapController.get()