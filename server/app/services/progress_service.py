from app.models.roadmap_model import RoadmapModel


class RoadmapService:

    @staticmethod
    def get_all_roadmaps():
        return RoadmapModel.get_all()

    @staticmethod
    def create_roadmap(data):
        if not data.get("careerGoal"):
            return None, "careerGoal is required"

        roadmap = RoadmapModel.create(data)

        return roadmap, None

    @staticmethod
    def get_roadmap_by_career(career_goal):
        return RoadmapModel.get_by_career(career_goal)

    @staticmethod
    def get_roadmap_by_course(course_id):
        return RoadmapModel.get_by_course(course_id)