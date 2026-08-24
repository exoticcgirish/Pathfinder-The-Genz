from flask import jsonify
from app.models.course_model import CourseModel


class SkillController:

    @staticmethod
    def get_skills():
        courses = CourseModel.get_all()

        skills = set()

        for course in courses:
            for skill in course.get("skills", []):
                skills.add(skill)

        return jsonify({
            "success": True,
            "skills": sorted(skills),
            "count": len(skills)
        }), 200