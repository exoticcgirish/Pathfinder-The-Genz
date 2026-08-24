from app.ai.roadmap.milestone_generator import generate_milestones
from app.ai.roadmap.prerequisite_graph import order_skills


def generate_roadmap(
    user_skills,
    required_skills,
    career_goal,
    courses
):

    user_skills = [
        skill.lower().strip()
        for skill in user_skills
    ]

    required_skills = [
        skill.lower().strip()
        for skill in required_skills
    ]

    missing_skills = [
        skill
        for skill in required_skills
        if skill not in user_skills
    ]

    ordered_skills = order_skills(missing_skills)

    milestones = generate_milestones(
        ordered_skills,
        courses
    )

    return {
        "career_goal": career_goal,
        "total_required_skills": len(required_skills),
        "user_skills": user_skills,
        "missing_skills": ordered_skills,
        "milestones": milestones
    }