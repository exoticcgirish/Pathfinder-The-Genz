from app.models.user_model import UserModel


class UserService:

    # =========================
    # FORMAT USER
    # =========================
    @staticmethod
    def _format_user(user):

        if not user:
            return None

        return {
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
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

    # =========================
    # GET PROFILE
    # =========================
    @staticmethod
    def get_profile(user_id):

        user = UserModel.find_by_id(
            user_id
        )

        return UserService._format_user(
            user
        )

    # =========================
    # UPDATE PROFILE
    # =========================
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

        user = UserModel.find_by_id(
            user_id
        )

        return UserService._format_user(
            user
        )