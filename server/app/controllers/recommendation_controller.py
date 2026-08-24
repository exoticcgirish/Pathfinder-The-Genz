from flask import request, jsonify

from app.ai.nlp.intent_classifier import classify_intent
from app.ai.nlp.goal_extractor import extract_goal
from app.ai.nlp.skill_extractor import extract_skills

from app.ai.recommendation.recommender import Recommender
from app.ai.roadmap.roadmap_generator import generate_roadmap

from app.models.course_model import CourseModel
from app.models.roadmap_model import RoadmapModel



class RecommendationController:

    @staticmethod
    def analyze():

        data = request.get_json() or {}

        message = data.get("message", "").strip()

        if not message:
            return jsonify({
                "success": False,
                "message": "Message is required"
            }), 400

        # -------------------------
        # NLP
        # -------------------------

        intent_result = classify_intent(message)

        goal = extract_goal(message)

        skills = extract_skills(message)

        if not goal:
            return jsonify({
                "success": False,
                "message": "Could not identify career goal"
            }), 400

        # -------------------------
        # Courses from MongoDB
        # -------------------------

        courses = CourseModel.get_all()

        # -------------------------
        # Required skills from DB
        # -------------------------

        required_skills = (
            CourseModel.get_required_skills_for_career(
                goal
            )
        )

        if not required_skills:
            return jsonify({
                "success": False,
                "message": "No required skills found for this career",
                "goal": goal
            }), 404

        # -------------------------
        # User profile
        # -------------------------

        user_profile = {
            "careerGoal": goal,
            "experienceLevel": "beginner",
            "interests": skills,
            "skills": skills
        }

        # -------------------------
        # Recommendations
        # -------------------------

        recommendation_result = Recommender.recommend(
            user_profile=user_profile,
            courses=courses,
            required_skills=required_skills,
            top_n=5
        )

        # -------------------------
        # Roadmap
        # -------------------------

        roadmap = generate_roadmap(
            user_skills=skills,
            required_skills=required_skills,
            career_goal=goal,
            courses=courses
        )
        saved_roadmap = RoadmapModel.create(
            career_goal=goal,
            user_skills=skills,
            required_skills=required_skills,
            roadmap=roadmap
        )
      

        return jsonify({
            "success": True,
            "intent": intent_result,
            "goal": goal,
            "skills": skills,
            "required_skills": required_skills,
            "skill_gap": recommendation_result["skill_gap"],
            "recommendations": recommendation_result["recommendations"],
            "roadmap": roadmap,
            "roadmapId": str(saved_roadmap["_id"])
        }), 200

    @staticmethod
    def get_recommendations():

        courses = CourseModel.get_all()

        return jsonify({
            "success": True,
            "count": len(courses),
            "recommendations": courses
        }), 200