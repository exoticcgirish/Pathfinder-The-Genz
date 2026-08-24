def rank_courses(courses):
    return sorted(
        courses,
        key=lambda course: course.get("score", 0),
        reverse=True
    )