from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.config.config import Config


def create_app():

    app = Flask(__name__)

    # =========================
    # JWT
    # =========================

    app.config["JWT_SECRET_KEY"] = (
        Config.JWT_SECRET_KEY
    )

    JWTManager(app)

    # =========================
    # CORS
    # =========================

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173"
                ]
            }
        },
        supports_credentials=True
    )

    # =========================
    # IMPORT ROUTES
    # =========================

    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.course_routes import course_bp

    from app.routes.skill_routes import skill_bp
    from app.routes.recommendation_routes import recommendation_bp
    from app.routes.roadmap_routes import roadmap_bp
    from app.routes.progress_routes import progress_bp
    from app.routes.chat_routes import chat_bp

    # =========================
    # REGISTER BLUEPRINTS
    # =========================

    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    app.register_blueprint(
        user_bp,
        url_prefix="/api/users"
    )

    app.register_blueprint(
        course_bp,
        url_prefix="/api/courses"
    )

    app.register_blueprint(
        recommendation_bp,
        url_prefix="/api/recommendations"
    )

    app.register_blueprint(
        roadmap_bp,
        url_prefix="/api/roadmap"
    )

    app.register_blueprint(
        progress_bp,
        url_prefix="/api/progress"
    )

    app.register_blueprint(
        chat_bp,
        url_prefix="/api/chat"
    )

    app.register_blueprint(
        skill_bp,
        url_prefix="/api/skills"
    )

    # =========================
    # HOME
    # =========================

    @app.route("/")
    def home():

        return {
            "message": "Personalized Learning API",
            "status": "running"
        }

    return app