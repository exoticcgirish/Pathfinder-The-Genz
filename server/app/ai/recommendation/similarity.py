def skill_similarity(user_skills, course_skills):
    if not user_skills or not course_skills:
        return 0

    user_skills = set(user_skills)
    course_skills = set(course_skills)

    common = user_skills.intersection(course_skills)

    return len(common) / len(course_skills)