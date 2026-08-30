
from flask import Blueprint

from app.controllers.recommendation_controller import (
    RecommendationController
)


recommendation_bp = Blueprint(
    "recommendations",
    __name__
)


# =====================================================
# GET PERSONALIZED RECOMMENDATIONS
# =====================================================

@recommendation_bp.route(
    "/",
    methods=["GET"]
)
def get_recommendations():

    return (
        RecommendationController
        .get_recommendations()
    )


# =====================================================
# ANALYZE LEARNER + GENERATE RECOMMENDATIONS
# =====================================================

@recommendation_bp.route(
    "/analyze",
    methods=["POST"]
)
def analyze():

    return (
        RecommendationController
        .analyze()
    )