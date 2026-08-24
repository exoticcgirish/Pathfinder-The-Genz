from app.models.course_model import CourseModel


class CourseService:

    @staticmethod
    def get_courses():

        return CourseModel.get_all()

    @staticmethod
    def get_course(course_id):

        return CourseModel.get_by_id(course_id)