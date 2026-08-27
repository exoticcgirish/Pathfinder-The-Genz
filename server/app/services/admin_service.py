import bcrypt

from app.models.user_model import UserModel


class AdminService:

    @staticmethod
    def create_content_manager(
        name,
        email,
        password
    ):

        existing = UserModel.find_by_email(email)

        if existing:
            return None, "User already exists"

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

        user = {
            "name": name,
            "email": email,
            "password": hashed_password.decode("utf-8"),

            "role": "content_manager",

            "profile": {
                "experienceLevel": "",
                "interests": [],
                "careerGoal": "",
                "learningPreference": "",
                "weeklyHours": 0
            },

            "skills": [],
            "completedCourses": []
        }

        UserModel.create(user)

        return {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }, None