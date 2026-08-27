from app.config.database import get_db


class RoadmapModel:

    collection = get_db()["roadmaps"]

    @staticmethod
    def create(roadmap):
        result = RoadmapModel.collection.insert_one(roadmap)

        roadmap["_id"] = str(result.inserted_id)

        return roadmap

    @staticmethod
    def get_by_user(user_id):
        return RoadmapModel.collection.find_one({
            "userId": user_id
        })

    @staticmethod
    def update(user_id, roadmap):
        result = RoadmapModel.collection.update_one(
            {
                "userId": user_id
            },
            {
                "$set": roadmap
            }
        )

        return result.modified_count > 0 or result.matched_count > 0