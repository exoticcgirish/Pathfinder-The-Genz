import bcrypt

from flask_jwt_extended import create_access_token

from app.models.user_model import UserModel


class AuthService:

    # =========================
    # REGISTER
    # =========================

    @staticmethod
    def register(name, email, password, role="learner"):

        existing = UserModel.find_by_email(email)

        if existing:
            return None, "User already exists"

        # Never allow public registration as admin
        if role not in ["learner", "content_manager"]:
            role = "learner"

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

        user = {
            "name": name.strip(),
            "email": email.strip().lower(),
            "password": hashed_password.decode("utf-8"),

            "role": role,

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

        # Do not return password
        user.pop("password", None)

        return user, None

    # =========================
    # LOGIN
    # =========================

    @staticmethod
    def login(email, password):

        user = UserModel.find_by_email(
            email.strip().lower()
        )

        if not user:
            return None, "Invalid email or password"

        stored_password = user.get("password")

        if not stored_password:
            return None, "Invalid user account"

        try:
            valid = bcrypt.checkpw(
                password.encode("utf-8"),
                stored_password.encode("utf-8")
            )
        except Exception:
            return None, "Invalid email or password"

        if not valid:
            return None, "Invalid email or password"

        role = user.get("role", "learner")

        # JWT contains role
        token = create_access_token(
            identity=str(user["_id"]),
            additional_claims={
                "role": role
            }
        )

        logged_user = {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": role
        }

        return {
            "token": token,
            "role": role,
            "user": logged_user
        }, None