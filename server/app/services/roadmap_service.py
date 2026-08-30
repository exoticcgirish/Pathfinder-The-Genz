from datetime import datetime
from bson import ObjectId
from urllib.parse import quote_plus

from app.config.database import get_db

from app.services.gemini_service import (
    generate_roadmap as generate_ai_roadmap
)

from app.services.youtube_service import find_playlist
from app.services.user_service import UserService
from app.services.skill_service import SkillService
from app.services.recommendation_service import (
    RecommendationService
)

from app.models.roadmap_model import RoadmapModel


class RoadmapService:

    # =========================================================
    # NORMALIZE
    # =========================================================

    @staticmethod
    def normalize(value):

        return str(
            value or ""
        ).strip().lower()

    # =========================================================
    # EXTRACT USER SKILL NAMES
    # =========================================================

    @staticmethod
    def extract_skill_names(skills):

        result = []

        for skill in skills or []:

            if isinstance(skill, dict):

                name = (
                    skill.get("name")
                    or skill.get("skill")
                )

            else:
                name = skill

            name = str(
                name or ""
            ).strip()

            if name:
                result.append(name)

        return result

    # =========================================================
    # MATCH COURSE FROM MONGODB
    # =========================================================

    @staticmethod
    def match_course(
        db,
        phase
    ):

        keywords = (
            phase.get(
                "searchKeywords",
                []
            )
        )

        if not keywords:

            keywords = (
                phase.get(
                    "skills",
                    []
                )
                +
                phase.get(
                    "topics",
                    []
                )
                +
                [
                    phase.get(
                        "title",
                        ""
                    )
                ]
            )

        keywords = [
            str(keyword)
            .lower()
            .strip()

            for keyword in keywords

            if str(keyword).strip()
        ]

        if not keywords:
            return None

        best_course = None
        best_score = 0

        for course in db[
            "courses"
        ].find({}):

            title = str(
                course.get(
                    "title",
                    ""
                )
            ).lower()

            description = str(
                course.get(
                    "description",
                    ""
                )
            ).lower()

            skills = " ".join(
                map(
                    str,
                    course.get(
                        "skills",
                        []
                    )
                )
            ).lower()

            topics = " ".join(
                map(
                    str,
                    course.get(
                        "topics",
                        []
                    )
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

        if (
            not best_course
            or best_score < 3
        ):
            return None

        return {

            "id": str(
                best_course[
                    "_id"
                ]
            ),

            "title":
                best_course.get(
                    "title",
                    "Course"
                ),

            "description":
                best_course.get(
                    "description",
                    ""
                ),

            "skills":
                best_course.get(
                    "skills",
                    []
                ),

            "level":
                best_course.get(
                    "level",
                    best_course.get(
                        "difficulty",
                        ""
                    )
                ),

            "duration":
                best_course.get(
                    "duration",
                    ""
                ),

            "link": (
                best_course.get(
                    "url"
                )
                or best_course.get(
                    "link"
                )
                or (
                    "/courses/"
                    + str(
                        best_course[
                            "_id"
                        ]
                    )
                )
            ),

            "matchScore":
                best_score
        }

    # =========================================================
    # YOUTUBE PLAYLIST
    # =========================================================

    @staticmethod
    def find_youtube_playlist(
        phase
    ):

        query = (
            phase.get(
                "youtubePlaylistQuery"
            )
            or phase.get(
                "youtubeSearchQuery"
            )
            or phase.get(
                "title"
            )
            or " ".join(
                map(
                    str,
                    phase.get(
                        "skills",
                        []
                    )
                )
            )
        )

        query = str(
            query or ""
        ).strip()

        if not query:
            return None

        try:

            playlist = (
                find_playlist(
                    query
                )
            )

            if playlist:

                return {

                    "type":
                        "playlist",

                    "title":
                        playlist.get(
                            "title",
                            (
                                "Learn "
                                + phase.get(
                                    "title",
                                    "this phase"
                                )
                            )
                        ),

                    "channelTitle":
                        playlist.get(
                            "channelTitle",
                            playlist.get(
                                "channel",
                                ""
                            )
                        ),

                    "url":
                        playlist.get(
                            "url",
                            ""
                        ),

                    "playlistId":
                        playlist.get(
                            "playlistId",
                            ""
                        ),

                    "searchQuery":
                        query
                }

            return {

                "type":
                    "search",

                "title":
                    (
                        "YouTube search for "
                        + phase.get(
                            "title",
                            "this phase"
                        )
                    ),

                "channelTitle":
                    "",

                "url":
                    (
                        "https://www.youtube.com/results?search_query="
                        + quote_plus(
                            query
                        )
                    ),

                "playlistId":
                    "",

                "searchQuery":
                    query
            }

        except Exception as error:

            print(
                "YOUTUBE PLAYLIST ERROR:",
                error
            )

            return {

                "type":
                    "search",

                "title":
                    (
                        "YouTube resources for "
                        + phase.get(
                            "title",
                            "this phase"
                        )
                    ),

                "channelTitle":
                    "",

                "url":
                    (
                        "https://www.youtube.com/results?search_query="
                        + quote_plus(
                            query
                        )
                    ),

                "playlistId":
                    "",

                "searchQuery":
                    query
            }

    # =========================================================
    # FALLBACK PHASE GENERATOR
    #
    # Used if Gemini fails or returns invalid phases.
    # =========================================================

    @staticmethod
    def build_fallback_phases(
        priority_skills,
        weekly_hours
    ):

        phases = []

        if not priority_skills:
            return phases

        phase_size = 2

        grouped = [

            priority_skills[
                index:
                index + phase_size
            ]

            for index in range(
                0,
                len(priority_skills),
                phase_size
            )
        ]

        for index, group in enumerate(
            grouped,
            start=1
        ):

            skills = [
                item.get(
                    "skill"
                )
                for item in group
                if item.get(
                    "skill"
                )
            ]

            prerequisites = []

            for item in group:

                prerequisites.extend(
                    item.get(
                        "prerequisites",
                        []
                    )
                )

            prerequisites = list(
                dict.fromkeys(
                    prerequisites
                )
            )

            estimated_weeks = 2

            if weekly_hours < 5:
                estimated_weeks = 4

            elif weekly_hours < 8:
                estimated_weeks = 3

            phases.append({

                "phase":
                    index,

                "title":
                    (
                        "Master "
                        + " & ".join(
                            skills
                        )
                    ),

                "description":
                    (
                        "Build practical understanding of "
                        + ", ".join(
                            skills
                        )
                        + "."
                    ),

                "skills":
                    skills,

                "topics":
                    skills,

                "prerequisites":
                    prerequisites,

                "estimatedWeeks":
                    estimated_weeks,

                "weeklyHours":
                    weekly_hours,

                "milestone":
                    (
                        "Demonstrate practical knowledge of "
                        + ", ".join(
                            skills
                        )
                    ),

                "project":
                    (
                        "Build a mini project using "
                        + ", ".join(
                            skills
                        )
                    ),

                "whyThisPhase":
                    (
                        "These are priority skill gaps "
                        "for your target career."
                    ),

                "searchKeywords":
                    skills,

                "youtubeSearchQuery":
                    " ".join(
                        skills
                    )
            })

        return phases

    # =========================================================
    # NORMALIZE AI PHASE
    # =========================================================

    @staticmethod
    def normalize_phase(
        phase,
        index,
        weekly_hours
    ):

        skills = phase.get(
            "skills",
            []
        )

        if not isinstance(
            skills,
            list
        ):
            skills = []

        topics = phase.get(
            "topics",
            []
        )

        if not isinstance(
            topics,
            list
        ):
            topics = []

        prerequisites = phase.get(
            "prerequisites",
            []
        )

        if not isinstance(
            prerequisites,
            list
        ):
            prerequisites = []

        return {

            "phase":
                phase.get(
                    "phase",
                    index
                ),

            "title":
                phase.get(
                    "title",
                    f"Learning Phase {index}"
                ),

            "description":
                phase.get(
                    "description",
                    ""
                ),

            "skills":
                skills,

            "topics":
                topics,

            "prerequisites":
                prerequisites,

            "estimatedWeeks":
                phase.get(
                    "estimatedWeeks",
                    phase.get(
                        "durationWeeks",
                        2
                    )
                ),

            "weeklyHours":
                weekly_hours,

            "milestone":
                phase.get(
                    "milestone",
                    (
                        "Complete this learning phase"
                    )
                ),

            "project":
                phase.get(
                    "project",
                    phase.get(
                        "projectTask",
                        ""
                    )
                ),

            "whyThisPhase":
                phase.get(
                    "whyThisPhase",
                    phase.get(
                        "reason",
                        ""
                    )
                ),

            "searchKeywords":
                phase.get(
                    "searchKeywords",
                    skills
                ),

            "youtubeSearchQuery":
                phase.get(
                    "youtubePlaylistQuery",
                    phase.get(
                        "youtubeSearchQuery",
                        (
                            " ".join(
                                skills
                            )
                        )
                    )
                ),

            "status":
                "locked",

            "completed":
                False
        }

    # =========================================================
    # APPLY PREREQUISITE LOCKING
    # =========================================================

    @staticmethod
    def apply_phase_statuses(
        phases
    ):

        if not phases:
            return phases

        for index, phase in enumerate(
            phases
        ):

            if index == 0:

                phase["status"] = (
                    "available"
                )

            else:

                phase["status"] = (
                    "locked"
                )

            phase["completed"] = (
                False
            )

        return phases

    # =========================================================
    # GENERATE ROADMAP
    # =========================================================

    @staticmethod
    def generate(
        user_id
    ):

        try:

            if not ObjectId.is_valid(
                str(user_id)
            ):

                return (
                    None,
                    "Invalid user"
                )

            db = get_db()

            # =================================================
            # GET REAL USER PROFILE
            # =================================================

            user = (
                UserService.get_profile(
                    user_id
                )
            )

            if not user:

                return (
                    None,
                    "User not found"
                )

            profile = user.get(
                "profile",
                {}
            )

            career_goal = (
                profile.get(
                    "careerGoal",
                    ""
                )
            )

            if not career_goal:

                return (
                    None,
                    "Please add your career goal first"
                )

            experience_level = (
                profile.get(
                    "experienceLevel",
                    "beginner"
                )
            )

            learning_preference = (
                profile.get(
                    "learningPreference",
                    ""
                )
            )

            interests = (
                profile.get(
                    "interests",
                    []
                )
            )

            weekly_hours = (
                profile.get(
                    "weeklyHours",
                    5
                )
            )

            try:

                weekly_hours = int(
                    weekly_hours
                )

            except (
                TypeError,
                ValueError
            ):

                weekly_hours = 5

            # =================================================
            # CURRENT SKILLS
            # =================================================

            current_skills = (
                RoadmapService
                .extract_skill_names(
                    user.get(
                        "skills",
                        []
                    )
                )
            )

            # =================================================
            # STEP 2:
            # SKILL GAP ANALYSIS
            # =================================================

            skill_analysis = (
                SkillService
                .analyze_skill_gap(
                    career_goal,
                    user.get(
                        "skills",
                        []
                    ),
                    experience_level
                )
            )

            if not skill_analysis.get(
                "supportedCareer"
            ):

                return (
                    None,
                    "Career goal is not supported yet"
                )

            missing_skills = (
                skill_analysis.get(
                    "missingSkills",
                    []
                )
            )

            priority_skills = (
                skill_analysis.get(
                    "prioritySkills",
                    []
                )
            )

            readiness_score = (
                skill_analysis.get(
                    "readinessScore",
                    0
                )
            )

            # =================================================
            # STEP 3:
            # PERSONALIZED RECOMMENDATIONS
            # =================================================

            recommendation_result = (
                RecommendationService
                .get_recommendations(
                    user_id,
                    top_n=5
                )
            )

            recommendations = []

            if (
                recommendation_result
                and not recommendation_result.get(
                    "error"
                )
            ):

                recommendations = (
                    recommendation_result.get(
                        "recommendations",
                        []
                    )
                )

            # =================================================
            # AI CONTEXT
            # =================================================

            ai_context = {

                "careerGoal":
                    career_goal,

                "experienceLevel":
                    experience_level,

                "learningPreference":
                    learning_preference,

                "weeklyHours":
                    weekly_hours,

                "interests":
                    interests,

                "currentSkills":
                    current_skills,

                "missingSkills":
                    missing_skills,

                "prioritySkills":
                    priority_skills,

                "readinessScore":
                    readiness_score,

                "recommendedCourses":
                    recommendations
            }

            # =================================================
            # GENERATE AI ROADMAP
            # =================================================

            phases = []

            try:

                ai_roadmap = (
                    generate_ai_roadmap(
                        ai_context
                    )
                )

                if isinstance(
                    ai_roadmap,
                    dict
                ):

                    phases = (
                        ai_roadmap.get(
                            "phases",
                            []
                        )
                    )

            except Exception as error:

                print(
                    "GEMINI ROADMAP ERROR:",
                    error
                )

                phases = []

            # =================================================
            # SAFE FALLBACK
            # =================================================

            if not phases:

                phases = (
                    RoadmapService
                    .build_fallback_phases(
                        priority_skills,
                        weekly_hours
                    )
                )

            if not phases:

                return (
                    None,
                    "Unable to generate roadmap"
                )

            # =================================================
            # NORMALIZE + ENRICH PHASES
            # =================================================

            final_phases = []

            for index, phase in enumerate(
                phases,
                start=1
            ):

                phase = (
                    RoadmapService
                    .normalize_phase(
                        phase,
                        index,
                        weekly_hours
                    )
                )

                # MongoDB course
                matched_course = (
                    RoadmapService
                    .match_course(
                        db,
                        phase
                    )
                )

                # YouTube resource
                youtube = (
                    RoadmapService
                    .find_youtube_playlist(
                        phase
                    )
                )

                phase[
                    "recommendedCourse"
                ] = matched_course

                phase[
                    "youtube"
                ] = youtube

                final_phases.append(
                    phase
                )

            # =================================================
            # LOCK FUTURE PHASES
            # =================================================

            final_phases = (
                RoadmapService
                .apply_phase_statuses(
                    final_phases
                )
            )

            # =================================================
            # TOTAL ESTIMATED WEEKS
            # =================================================

            total_weeks = sum(

                int(
                    phase.get(
                        "estimatedWeeks",
                        0
                    )
                    or 0
                )

                for phase
                in final_phases
            )

            now = datetime.utcnow()

            # =================================================
            # VERSION
            # =================================================

            existing = (
                RoadmapModel
                .get_by_user(
                    user_id
                )
            )

            version = 1

            created_at = now

            if existing:

                version = (
                    existing.get(
                        "version",
                        0
                    )
                    + 1
                )

                created_at = (
                    existing.get(
                        "createdAt",
                        now
                    )
                )

            # =================================================
            # ROADMAP DOCUMENT
            # =================================================

            document = {

                "userId":
                    ObjectId(
                        str(user_id)
                    ),

                "careerGoal":
                    career_goal,

                "experienceLevel":
                    experience_level,

                "learningPreference":
                    learning_preference,

                "weeklyHours":
                    weekly_hours,

                "readinessScore":
                    readiness_score,

                "currentSkills":
                    current_skills,

                "missingSkills":
                    missing_skills,

                "prioritySkills":
                    priority_skills,

                "recommendations":
                    recommendations,

                "totalEstimatedWeeks":
                    total_weeks,

                "totalPhases":
                    len(
                        final_phases
                    ),

                "phases":
                    final_phases,

                "version":
                    version,

                "status":
                    "active",

                "progressPercentage":
                    0,

                "generatedFrom":
                    ai_context,

                "createdAt":
                    created_at,

                "updatedAt":
                    now
            }

            # =================================================
            # SAVE
            # =================================================

            RoadmapModel.upsert(
                user_id,
                document
            )

            # =================================================
            # RESPONSE
            # =================================================

            response = dict(
                document
            )

            response[
                "userId"
            ] = str(
                response[
                    "userId"
                ]
            )

            response[
                "createdAt"
            ] = (
                response[
                    "createdAt"
                ].isoformat()
            )

            response[
                "updatedAt"
            ] = (
                response[
                    "updatedAt"
                ].isoformat()
            )

            return (
                response,
                None
            )

        except Exception as error:

            print(
                "ROADMAP GENERATION ERROR:",
                error
            )

            return (
                None,
                str(error)
            )

    # =========================================================
    # GET ROADMAP
    # =========================================================

    @staticmethod
    def get(
        user_id
    ):

        try:

            roadmap = (
                RoadmapModel
                .get_by_user(
                    user_id
                )
            )

            if not roadmap:
                return None

            roadmap[
                "_id"
            ] = str(
                roadmap[
                    "_id"
                ]
            )

            roadmap[
                "userId"
            ] = str(
                roadmap[
                    "userId"
                ]
            )

            if roadmap.get(
                "createdAt"
            ):

                roadmap[
                    "createdAt"
                ] = (
                    roadmap[
                        "createdAt"
                    ].isoformat()
                )

            if roadmap.get(
                "updatedAt"
            ):

                roadmap[
                    "updatedAt"
                ] = (
                    roadmap[
                        "updatedAt"
                    ].isoformat()
                )

            return roadmap

        except Exception as error:

            print(
                "ROADMAP GET ERROR:",
                error
            )

            return None