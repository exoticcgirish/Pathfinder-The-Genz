import bcrypt

from app.config.database import get_db


def create_admin():
    db = get_db()

    email = "admin@pathfinder.com"
    password = "Admin@123"

    # Check if admin already exists
    existing = db.users.find_one({
        "email": email
    })

    if existing:
        print("Admin already exists.")
        return

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    admin = {
        "name": "Pathfinder Admin",
        "email": email,
        "password": hashed_password,
        "role": "admin",

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

    result = db.users.insert_one(admin)

    print("Admin created successfully!")
    print("ID:", result.inserted_id)
    print("Email:", email)
    print("Password:", password)


if __name__ == "__main__":
    create_admin()