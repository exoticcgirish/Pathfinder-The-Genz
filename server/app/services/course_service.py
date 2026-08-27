from datetime import datetime

from app.models.course_model import CourseModel


class CourseService:

    # =========================
    # GET ALL
    # =========================

    @staticmethod
    def get_courses():

        courses = CourseModel.get_all()

        for course in courses:
            course["_id"] = str(
                course["_id"]
            )

            if "createdAt" in course:
                course["createdAt"] = (
                    course["createdAt"].isoformat()
                )

            if "updatedAt" in course:
                course["updatedAt"] = (
                    course["updatedAt"].isoformat()
                )

        return courses

    # =========================
    # GET ONE
    # =========================

    @staticmethod
    def get_course(course_id):

        course = CourseModel.get_by_id(
            course_id
        )

        if not course:
            return None

        course["_id"] = str(
            course["_id"]
        )

        if "createdAt" in course:
            course["createdAt"] = (
                course["createdAt"].isoformat()
            )

        if "updatedAt" in course:
            course["updatedAt"] = (
                course["updatedAt"].isoformat()
            )

        return course

    # =========================
    # CREATE
    # =========================

    @staticmethod
    def create_course(
        data,
        manager_id
    ):

        title = data.get(
            "title",
            ""
        ).strip()

        if not title:

            return None, "Course title is required"

        course = {

            "title": title,

            "description": data.get(
                "description",
                ""
            ).strip(),

            "skills": data.get(
                "skills",
                []
            ),

            "topics": data.get(
                "topics",
                []
            ),

            "level": data.get(
                "level",
                "Beginner"
            ),

            "duration": data.get(
                "duration",
                ""
            ),

            "createdBy": str(
                manager_id
            ),

            "createdAt": datetime.utcnow(),

            "updatedAt": datetime.utcnow()
        }

        result = CourseModel.create(
            course
        )

        result["_id"] = str(
            result["_id"]
        )

        result["createdAt"] = (
            result["createdAt"].isoformat()
        )

        result["updatedAt"] = (
            result["updatedAt"].isoformat()
        )

        return result, None

    # =========================
    # UPDATE
    # =========================

    @staticmethod
    def update_course(
        course_id,
        data
    ):

        update_data = {
            "title": data.get(
                "title",
                ""
            ).strip(),

            "description": data.get(
                "description",
                ""
            ).strip(),

            "skills": data.get(
                "skills",
                []
            ),

            "topics": data.get(
                "topics",
                []
            ),

            "level": data.get(
                "level",
                "Beginner"
            ),

            "duration": data.get(
                "duration",
                ""
            ),

            "updatedAt": datetime.utcnow()
        }

        if not update_data["title"]:

            return None

        success = CourseModel.update(
            course_id,
            update_data
        )

        if not success:

            return None

        return CourseService.get_course(
            course_id
        )

    # =========================
    # DELETE
    # =========================

    @staticmethod
    def delete_course(course_id):

        return CourseModel.delete(
            course_id
        )