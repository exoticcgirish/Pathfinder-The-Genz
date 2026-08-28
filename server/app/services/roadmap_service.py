from datetime import datetime
from bson import ObjectId
from urllib.parse import quote_plus

from app.config.database import get_db
from app.services.gemini_service import generate_roadmap
from app.services.youtube_service import find_playlist


class RoadmapService:

    # =========================================================
    # MATCH COURSE FROM MONGODB
    # =========================================================

    @staticmethod
    def match_course(db, phase):

        keywords = phase.get("searchKeywords", [])

        if not keywords:
            keywords = (
                phase.get("skills", [])
                + phase.get("topics", [])
                + [phase.get("title", "")]
            )

        keywords = [
            str(k).lower().strip()
            for k in keywords
            if str(k).strip()
        ]

        if not keywords:
            return None

        best_course = None
        best_score = 0

        for course in db["courses"].find({}):

            title = str(
                course.get("title", "")
            ).lower()

            description = str(
                course.get("description", "")
            ).lower()

            skills = " ".join(
                map(
                    str,
                    course.get("skills", [])
                )
            ).lower()

            topics = " ".join(
                map(
                    str,
                    course.get("topics", [])
                )
            ).lower()

            score = 0

            for keyword in keywords:

                if keyword in title:
                    score += 5

                if keyword in skills:
                    score += 4

                if keyword in topics:
                    score += 3

                if keyword in description:
                    score += 1

            if score > best_score:
                best_score = score
                best_course = course

        if not best_course or best_score < 3:
            return None

        return {
            "id": str(best_course["_id"]),

            "title": best_course.get(
                "title",
                "Course"
            ),

            "description": best_course.get(
                "description",
                ""
            ),

            "link": (
                best_course.get("url")
                or best_course.get("link")
                or f"/courses/{str(best_course['_id'])}"
            ),

            "matchScore": best_score
        }

    # =========================================================
    # YOUTUBE PLAYLIST
    # =========================================================

    @staticmethod
    def find_youtube_playlist(phase):

        query = (
            phase.get("youtubePlaylistQuery")
            or phase.get("youtubeSearchQuery")
            or phase.get("title")
            or " ".join(
                map(
                    str,
                    phase.get("skills", [])
                )
            )
        )

        query = str(query).strip()

        if not query:
            return None

        try:

            # youtube_service searches ONLY playlists
            playlist = find_playlist(query)

            if playlist:

                return {
                    "type": "playlist",

                    "title": playlist.get(
                        "title",
                        f"Learn {phase.get('title', 'this phase')}"
                    ),

                    "channelTitle": playlist.get(
                        "channelTitle",
                        playlist.get("channel", "")
                    ),

                    "url": playlist.get(
                        "url",
                        ""
                    ),

                    "playlistId": playlist.get(
                        "playlistId",
                        ""
                    ),

                    "searchQuery": query
                }

            # -------------------------------------------------
            # No playlist found
            # -------------------------------------------------

            return {
                "type": "search",

                "title": (
                    f"YouTube search for "
                    f"{phase.get('title', 'this phase')}"
                ),

                "channelTitle": "",

                "url": (
                    "https://www.youtube.com/results?search_query="
                    + quote_plus(query)
                ),

                "playlistId": "",

                "searchQuery": query
            }

        except Exception as e:

            print(
                "YOUTUBE PLAYLIST ERROR:",
                e
            )

            # Safe fallback
            return {
                "type": "search",

                "title": (
                    f"YouTube resources for "
                    f"{phase.get('title', 'this phase')}"
                ),

                "channelTitle": "",

                "url": (
                    "https://www.youtube.com/results?search_query="
                    + quote_plus(query)
                ),

                "playlistId": "",

                "searchQuery": query
            }

    # =========================================================
    # GENERATE ROADMAP
    # =========================================================

    @staticmethod
    def generate(user_id):

        try:

            db = get_db()

            user = db["users"].find_one({
                "_id": ObjectId(user_id)
            })

            if not user:
                return None, "User not found"

            # =================================================
            # USER PROFILE
            # =================================================

            profile_data = user.get(
                "profile",
                {}
            )

            profile = {

                "careerGoal": profile_data.get(
                    "careerGoal",
                    user.get(
                        "careerGoal",
                        ""
                    )
                ),

                "experienceLevel": profile_data.get(
                    "experienceLevel",
                    user.get(
                        "experienceLevel",
                        "beginner"
                    )
                ),

                "skills": profile_data.get(
                    "skills",
                    user.get(
                        "skills",
                        []
                    )
                ),

                "interests": profile_data.get(
                    "interests",
                    user.get(
                        "interests",
                        []
                    )
                ),

                "learningPreference": profile_data.get(
                    "learningPreference",
                    user.get(
                        "learningPreference",
                        ""
                    )
                )
            }

            if not profile["careerGoal"]:

                return (
                    None,
                    "Please add your career goal first"
                )

            # =================================================
            # GENERATE AI ROADMAP
            # =================================================

            roadmap = generate_roadmap(
                profile
            )

            phases = roadmap.get(
                "phases",
                []
            )

            if not phases:

                return (
                    None,
                    "AI could not generate roadmap phases"
                )

            # =================================================
            # ENRICH PHASES
            # =================================================

            final_phases = []

            for phase in phases:

                # ---------------------------------------------
                # MongoDB course
                # ---------------------------------------------

                matched_course = (
                    RoadmapService.match_course(
                        db,
                        phase
                    )
                )

                # ---------------------------------------------
                # Real YouTube playlist
                # ---------------------------------------------

                youtube = (
                    RoadmapService.find_youtube_playlist(
                        phase
                    )
                )

                phase["recommendedCourse"] = (
                    matched_course
                )

                phase["youtube"] = youtube

                final_phases.append(
                    phase
                )

            # =================================================
            # SAVE ROADMAP
            # =================================================

            now = datetime.utcnow()

            document = {

                "userId": ObjectId(
                    user_id
                ),

                "careerGoal": profile[
                    "careerGoal"
                ],

                "experienceLevel": profile[
                    "experienceLevel"
                ],

                "phases": final_phases,

                "generatedFrom": profile,

                "createdAt": now,

                "updatedAt": now
            }

            db["roadmaps"].update_one(

                {
                    "userId": ObjectId(
                        user_id
                    )
                },

                {
                    "$set": document
                },

                upsert=True
            )

            # =================================================
            # RESPONSE
            # =================================================

            return {

                "careerGoal": document[
                    "careerGoal"
                ],

                "experienceLevel": document[
                    "experienceLevel"
                ],

                "phases": document[
                    "phases"
                ]

            }, None

        except Exception as e:

            print(
                "ROADMAP GENERATION ERROR:",
                e
            )

            return None, str(e)

    # =========================================================
    # GET ROADMAP
    # =========================================================

    @staticmethod
    def get(user_id):

        try:

            db = get_db()

            roadmap = db["roadmaps"].find_one({
                "userId": ObjectId(user_id)
            })

            if not roadmap:
                return None

            roadmap["_id"] = str(
                roadmap["_id"]
            )

            roadmap["userId"] = str(
                roadmap["userId"]
            )

            return roadmap

        except Exception as e:

            print(
                "ROADMAP GET ERROR:",
                e
            )

            return None