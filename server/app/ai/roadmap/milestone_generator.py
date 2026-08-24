def generate_milestones(missing_skills, courses):

    milestones = []

    for index, skill in enumerate(missing_skills, start=1):

        matched_courses = []

        for course in courses:
            course_skills = [
                s.lower().strip()
                for s in course.get("skills", [])
            ]

            if skill.lower().strip() in course_skills:
                matched_courses.append({
                    "title": course.get("title"),
                    "level": course.get("level"),
                    "duration": course.get("duration")
                })

        milestones.append({
            "step": index,
            "skill": skill,
            "status": "not_started",
            "courses": matched_courses
        })

    return milestones