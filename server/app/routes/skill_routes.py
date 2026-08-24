from flask import Blueprint
from app.controllers.skill_controller import SkillController

skill_bp = Blueprint("skill", __name__)

@skill_bp.route("/", methods=["GET"])
def get_skills():
    return SkillController.get_skills()