from app.models.course_model import CourseModel
from app.services.user_service import UserService
from app.services.skill_service import SkillService


class RecommendationService:

    # =====================================================
    # NORMALIZE TEXT
    # =====================================================

    @staticmethod
    def normalize(value):
        return str(value or "").strip().lower()

    # =====================================================
    # GET COURSE SKILLS
    # =====================================================

    @staticmethod
    def get_course_skills(course):

        skills = course.get("skills", [])

        if not isinstance(skills, list):
            return []

        return [
            str(skill).strip()
            for skill in skills
            if str(skill).strip()
        ]

    # =====================================================
    # GET COURSE TOPICS
    # =====================================================

    @staticmethod
    def get_course_topics(course):

        topics = course.get("topics", [])

        if not isinstance(topics, list):
            return []

        return [
            str(topic).strip()
            for topic in topics
            if str(topic).strip()
        ]

    # =====================================================
    # DIFFICULTY MATCH
    #
    # Maximum = 10 points
    # =====================================================

    @staticmethod
    def difficulty_score(
        experience_level,
        course_level
    ):

        experience = (
            RecommendationService.normalize(
                experience_level
            )
        )

        difficulty = (
            RecommendationService.normalize(
                course_level
            )
        )

        if not difficulty:
            return 3

        level_map = {
            "beginner": 1,
            "intermediate": 2,
            "advanced": 3
        }

        user_level = level_map.get(
            experience,
            1
        )

        course_value = level_map.get(
            difficulty,
            1
        )

        difference = abs(
            user_level - course_value
        )

        if difference == 0:
            return 10

        if difference == 1:
            return 5

        return 1

    # =====================================================
    # SCORE ONE COURSE
    #
    # WEIGHTS
    #
    # 60% Skill-gap relevance
    # 15% Career-goal relevance
    # 10% Experience match
    # 10% Interest match
    #  5% Existing-skill continuity
    #
    # TOTAL = 100
    # =====================================================

    @staticmethod
    def score_course(
        course,
        profile,
        analysis
    ):

        career_goal = (
            RecommendationService.normalize(
                profile.get(
                    "careerGoal"
                )
            )
        )

        experience_level = (
            profile.get(
                "experienceLevel",
                ""
            )
        )

        interests = [
            RecommendationService.normalize(
                item
            )
            for item in profile.get(
                "interests",
                []
            )
            if str(item).strip()
        ]

        missing_skills = (
            analysis.get(
                "missingSkills",
                []
            )
        )

        current_skills = (
            analysis.get(
                "currentSkills",
                []
            )
        )

        course_skills = (
            RecommendationService
            .get_course_skills(
                course
            )
        )

        course_topics = (
            RecommendationService
            .get_course_topics(
                course
            )
        )

        normalized_course_skills = {
            RecommendationService.normalize(
                skill
            )
            for skill in course_skills
        }

        searchable_text = " ".join([
            RecommendationService.normalize(
                course.get(
                    "title"
                )
            ),

            RecommendationService.normalize(
                course.get(
                    "description"
                )
            ),

            " ".join(
                RecommendationService.normalize(
                    topic
                )
                for topic in course_topics
            ),

            " ".join(
                normalized_course_skills
            )
        ])

        score = 0

        matched_gap_skills = []

        matched_interests = []

        reasons = []

        # =================================================
        # 1. SKILL GAP RELEVANCE
        # MAX = 60
        # =================================================

        for missing_skill in missing_skills:

            normalized_missing = (
                RecommendationService.normalize(
                    missing_skill
                )
            )

            if (
                normalized_missing
                in normalized_course_skills
                or normalized_missing
                in searchable_text
            ):

                matched_gap_skills.append(
                    missing_skill
                )

        if missing_skills:

            gap_ratio = (
                len(
                    matched_gap_skills
                )
                / len(
                    missing_skills
                )
            )

            gap_score = min(
                60,
                round(
                    gap_ratio * 60
                )
            )

            score += gap_score

        if matched_gap_skills:

            reasons.append(
                "Builds missing skills: "
                + ", ".join(
                    matched_gap_skills[:3]
                )
            )

        # =================================================
        # 2. CAREER GOAL RELEVANCE
        # MAX = 15
        # =================================================

        goal_words = [
            word
            for word
            in career_goal.split()
            if len(word) > 2
            and word not in {
                "developer",
                "engineer",
                "development"
            }
        ]

        matched_goal_words = [
            word
            for word
            in goal_words
            if word in searchable_text
        ]

        if goal_words:

            career_score = min(
                15,
                round(
                    (
                        len(
                            matched_goal_words
                        )
                        / len(
                            goal_words
                        )
                    ) * 15
                )
            )

            score += career_score

        if matched_goal_words:

            reasons.append(
                "Relevant to your career goal"
            )

        # =================================================
        # 3. EXPERIENCE LEVEL MATCH
        # MAX = 10
        # =================================================

        course_level = (
            course.get(
                "level"
            )
            or course.get(
                "difficulty"
            )
            or ""
        )

        level_score = (
            RecommendationService
            .difficulty_score(
                experience_level,
                course_level
            )
        )

        score += level_score

        if level_score >= 5:

            reasons.append(
                "Matches your experience level"
            )

        # =================================================
        # 4. INTEREST MATCH
        # MAX = 10
        # =================================================

        for interest in interests:

            if (
                interest
                in searchable_text
                or interest
                in normalized_course_skills
            ):

                matched_interests.append(
                    interest
                )

        if interests:

            interest_score = min(
                10,
                round(
                    (
                        len(
                            matched_interests
                        )
                        / len(
                            interests
                        )
                    ) * 10
                )
            )

            score += interest_score

        if matched_interests:

            reasons.append(
                "Matches your learning interests"
            )

        # =================================================
        # 5. CURRENT SKILL CONTINUITY
        # MAX = 5
        # =================================================

        current_normalized = {
            RecommendationService.normalize(
                skill
            )
            for skill in current_skills
        }

        overlap = (
            normalized_course_skills
            & current_normalized
        )

        if overlap:

            score += 5

            reasons.append(
                "Builds on skills you already know"
            )

        # =================================================
        # RETURN COURSE SCORE
        # =================================================

        return {

            "score": min(
                round(score),
                100
            ),

            "matchedGapSkills":
                matched_gap_skills,

            "matchedInterests":
                matched_interests,

            "reasons":
                reasons
        }

    # =====================================================
    # SERIALIZE COURSE
    # =====================================================

    @staticmethod
    def serialize_course(
        course,
        scoring
    ):

        return {

            "id": str(
                course.get(
                    "_id",
                    ""
                )
            ),

            "title": course.get(
                "title",
                "Untitled Course"
            ),

            "description": course.get(
                "description",
                ""
            ),

            "skills": course.get(
                "skills",
                []
            ),

            "topics": course.get(
                "topics",
                []
            ),

            "level": (
                course.get(
                    "level"
                )
                or course.get(
                    "difficulty"
                )
                or "Not specified"
            ),

            "duration": course.get(
                "duration",
                ""
            ),

            "url": (
                course.get(
                    "url"
                )
                or course.get(
                    "resourceUrl",
                    ""
                )
            ),

            "matchScore":
                scoring[
                    "score"
                ],

            "matchedGapSkills":
                scoring[
                    "matchedGapSkills"
                ],

            "matchedInterests":
                scoring[
                    "matchedInterests"
                ],

            "whyRecommended":
                scoring[
                    "reasons"
                ]
        }

    # =====================================================
    # PERSONALIZED RECOMMENDATIONS
    # =====================================================

    @staticmethod
    def get_recommendations(
        user_id,
        top_n=5
    ):

        # =================================================
        # GET USER
        # =================================================

        user = (
            UserService.get_profile(
                user_id
            )
        )

        if not user:
            return None

        # =================================================
        # GET PROFILE
        # =================================================

        profile = user.get(
            "profile",
            {}
        )

        career_goal = profile.get(
            "careerGoal",
            ""
        )

        if not career_goal:

            return {
                "error":
                    "Complete your career goal first."
            }

        # =================================================
        # RUN SKILL GAP ANALYSIS
        # =================================================

        analysis = (
            SkillService
            .analyze_skill_gap(
                career_goal,
                user.get(
                    "skills",
                    []
                ),
                profile.get(
                    "experienceLevel",
                    ""
                )
            )
        )

        if not analysis.get(
            "supportedCareer"
        ):

            return {

                "error":
                    "Career goal is not yet supported.",

                "analysis":
                    analysis
            }

        # =================================================
        # LOAD COURSES
        # =================================================

        courses = (
            CourseModel.get_all()
        )

        scored_courses = []

        # =================================================
        # SCORE COURSES
        # =================================================

        for course in courses:

            scoring = (
                RecommendationService
                .score_course(
                    course,
                    profile,
                    analysis
                )
            )

            # =============================================
            # IMPORTANT FILTER
            #
            # Course MUST help close at least one
            # actual career skill gap.
            # =============================================

            if not scoring[
                "matchedGapSkills"
            ]:
                continue

            # Ignore very weak recommendations
            if scoring["score"] < 20:
                continue

            scored_courses.append(

                RecommendationService
                .serialize_course(
                    course,
                    scoring
                )
            )

        # =================================================
        # SORT BY MATCH SCORE
        # =================================================

        scored_courses.sort(
            key=lambda item:
                item[
                    "matchScore"
                ],
            reverse=True
        )

        recommendations = (
            scored_courses[
                :top_n
            ]
        )

        # =================================================
        # NEXT BEST ACTION
        # =================================================

        next_best_action = None

        priority_skills = (
            analysis.get(
                "prioritySkills",
                []
            )
        )

        if priority_skills:

            first_priority = (
                priority_skills[0]
            )

            skill_name = (
                first_priority.get(
                    "skill",
                    ""
                )
            )

            next_best_action = {

                "type":
                    "learn-skill",

                "skill":
                    skill_name,

                "priority":
                    first_priority.get(
                        "priority",
                        "medium"
                    ),

                "message":
                    (
                        f"Start with {skill_name}"
                        if skill_name
                        else
                        "Start with your highest priority skill"
                    )
            }

        # =================================================
        # FINAL RESULT
        # =================================================

        return {

            "careerGoal":
                career_goal,

            "experienceLevel":
                profile.get(
                    "experienceLevel",
                    ""
                ),

            "weeklyHours":
                profile.get(
                    "weeklyHours",
                    0
                ),

            "learningPreference":
                profile.get(
                    "learningPreference",
                    ""
                ),

            "readinessScore":
                analysis.get(
                    "readinessScore",
                    0
                ),

            "currentSkills":
                analysis.get(
                    "currentSkills",
                    []
                ),

            "matchedSkills":
                analysis.get(
                    "matchedSkills",
                    []
                ),

            "requiredSkills":
                analysis.get(
                    "requiredSkills",
                    []
                ),

            "missingSkills":
                analysis.get(
                    "missingSkills",
                    []
                ),

            "prioritySkills":
                priority_skills,

            "recommendations":
                recommendations,

            "recommendationCount":
                len(
                    recommendations
                ),

            "nextBestAction":
                next_best_action
        }