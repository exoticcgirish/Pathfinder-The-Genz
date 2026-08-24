def calculate_skill_gap(user_skills, required_skills):

    user_skills = {
        skill.lower().strip()
        for skill in user_skills
    }

    required_skills = {
        skill.lower().strip()
        for skill in required_skills
    }

    completed = user_skills.intersection(required_skills)
    missing = required_skills - user_skills

    total = len(required_skills)

    progress = 0

    if total > 0:
        progress = round(
            (len(completed) / total) * 100,
            2
        )

    return {
        "completed": sorted(list(completed)),
        "missing": sorted(list(missing)),
        "progress": progress
    }