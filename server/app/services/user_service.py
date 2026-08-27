from app.models.user_model import UserModel


class UserService:

    @staticmethod
    def get_profile(user_id):

        user = UserModel.find_by_id(user_id)

        if not user:
            return None

        return {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role", "learner"),

            "profile": user.get(
                "profile",
                {}
            ),

            "skills": user.get(
                "skills",
                []
            ),

            "completedCourses": user.get(
                "completedCourses",
                []
            )
        }

    @staticmethod
    def update_profile(
        user_id,
        profile_data
    ):

        success = UserModel.update_profile(
            user_id,
            profile_data
        )

        if not success:
            return None

        return UserService.get_profile(
            user_id
        )