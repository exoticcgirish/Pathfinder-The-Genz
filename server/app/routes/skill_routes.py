from flask import Blueprint

from app.controllers.skill_controller import SkillController


skill_bp = Blueprint(
    "skill",
    __name__
)



@skill_bp.route(
    "/",
    methods=["GET"]
)
def get_skills():

    return SkillController.get_skills()



@skill_bp.route(
    "/analyze",
    methods=["POST"]
)
def analyze_skills():

    return SkillController.analyze()



@skill_bp.route(
    "/my-skills",
    methods=["PUT"]
)
def update_my_skills():

    return SkillController.update_my_skills()