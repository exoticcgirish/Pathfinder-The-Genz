from bson import ObjectId

from app.config.database import get_db


class RoadmapModel:

    collection = get_db()[
        "roadmaps"
    ]


    @staticmethod
    def create(
        roadmap
    ):

        result = (
            RoadmapModel
            .collection
            .insert_one(
                roadmap
            )
        )

        roadmap[
            "_id"
        ] = result.inserted_id

        return roadmap


    @staticmethod
    def get_by_user(
        user_id
    ):

        try:

            if not ObjectId.is_valid(
                str(user_id)
            ):
                return None

            return (
                RoadmapModel
                .collection
                .find_one({
                    "userId":
                        ObjectId(
                            str(user_id)
                        )
                })
            )

        except Exception as error:

            print(
                "ROADMAP GET MODEL ERROR:",
                error
            )

            return None


    @staticmethod
    def update(
        user_id,
        roadmap
    ):

        try:

            if not ObjectId.is_valid(
                str(user_id)
            ):
                return False

            result = (
                RoadmapModel
                .collection
                .update_one(
                    {
                        "userId":
                            ObjectId(
                                str(user_id)
                            )
                    },
                    {
                        "$set":
                            roadmap
                    }
                )
            )

            return (
                result.matched_count
                > 0
            )

        except Exception as error:

            print(
                "ROADMAP UPDATE ERROR:",
                error
            )

            return False


    @staticmethod
    def upsert(
        user_id,
        roadmap
    ):

        try:

            if not ObjectId.is_valid(
                str(user_id)
            ):
                return False

            result = (
                RoadmapModel
                .collection
                .update_one(
                    {
                        "userId":
                            ObjectId(
                                str(user_id)
                            )
                    },
                    {
                        "$set":
                            roadmap
                    },
                    upsert=True
                )
            )

            return (
                result.acknowledged
            )

        except Exception as error:

            print(
                "ROADMAP UPSERT ERROR:",
                error
            )

            return False