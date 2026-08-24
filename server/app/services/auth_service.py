import bcrypt

from flask_jwt_extended import create_access_token

from app.models.user_model import UserModel


class AuthService:

    @staticmethod
    def register(name, email, password):

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

            "profile": {
                "experienceLevel": "",
                "interests": [],
                "careerGoal": "",
                "learningPreference": ""
            },

            "skills": [],
            "completedCourses": []
        }

        UserModel.create(user)

        return user, None

    @staticmethod
    def login(email, password):

        user = UserModel.find_by_email(email)

        if not user:
            return None, "Invalid email or password"

        valid = bcrypt.checkpw(
            password.encode("utf-8"),
            user["password"].encode("utf-8")
        )

        if not valid:
            return None, "Invalid email or password"

        token = create_access_token(
            identity=str(user["_id"])
        )

        return token, None