from app.models.user_model import UserModel
from app.models.course_model import CourseModel
from app.ai.recommender import RecommendationEngine


class RecommendationService:

    @staticmethod
    def get_recommendations(user_id):

        # Get user
        user = UserModel.find_by_id(user_id)

        if not user:
            return None

        # Get profile
        profile = user.get("profile", {})

        # Get courses
        courses = CourseModel.get_all()

        # Generate recommendations
        recommendations = RecommendationEngine.recommend(
            profile,
            courses,
            top_n=5
        )

        return recommendations