from app.models.course_model import CourseModel


class SkillService:

    # =====================================================
    # CAREER SKILL MAP
    # Baseline requirements for common career goals.
    # Course catalog skills are also considered dynamically.
    # =====================================================

    CAREER_SKILL_MAP = {

        "java backend developer": [
            "Java",
            "OOP",
            "Data Structures",
            "SQL",
            "Git",
            "Spring Boot",
            "REST API",
            "JPA",
            "Hibernate",
            "Microservices",
            "Docker",
            "AWS"
        ],

        "backend developer": [
            "Programming",
            "OOP",
            "Data Structures",
            "SQL",
            "Git",
            "REST API",
            "Databases",
            "Authentication",
            "Docker",
            "Cloud"
        ],

        "frontend developer": [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Git",
            "REST API",
            "Responsive Design",
            "Testing"
        ],

        "full stack developer": [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Backend Development",
            "REST API",
            "SQL",
            "Git",
            "Authentication",
            "Docker"
        ],

        "data scientist": [
            "Python",
            "SQL",
            "Statistics",
            "Pandas",
            "NumPy",
            "Data Visualization",
            "Machine Learning",
            "Scikit-learn"
        ],

        "machine learning engineer": [
            "Python",
            "SQL",
            "Statistics",
            "Machine Learning",
            "Deep Learning",
            "TensorFlow",
            "APIs",
            "Docker",
            "Cloud"
        ],

        "ai engineer": [
            "Python",
            "Machine Learning",
            "Deep Learning",
            "NLP",
            "LLM",
            "Prompt Engineering",
            "APIs",
            "Vector Databases",
            "Docker",
            "Cloud"
        ],

        "devops engineer": [
            "Linux",
            "Git",
            "Networking",
            "Docker",
            "Kubernetes",
            "CI/CD",
            "AWS",
            "Monitoring"
        ],

        "cloud engineer": [
            "Linux",
            "Networking",
            "Git",
            "Docker",
            "AWS",
            "Cloud Computing",
            "Security",
            "CI/CD"
        ]
    }

    # =====================================================
    # SKILL PREREQUISITES
    # Used later by the roadmap generator as well.
    # =====================================================

    PREREQUISITES = {

        "Spring Boot": [
            "Java",
            "OOP"
        ],

        "REST API": [
            "Programming"
        ],

        "JPA": [
            "Java",
            "SQL"
        ],

        "Hibernate": [
            "Java",
            "SQL"
        ],

        "Microservices": [
            "REST API",
            "Spring Boot"
        ],

        "Docker": [
            "Git"
        ],

        "Kubernetes": [
            "Docker"
        ],

        "Deep Learning": [
            "Python",
            "Machine Learning"
        ],

        "TensorFlow": [
            "Python",
            "Machine Learning"
        ],

        "LLM": [
            "Python",
            "NLP"
        ]
    }

    # =====================================================
    # NORMALIZE
    # =====================================================

    @staticmethod
    def normalize(value):

        return str(value or "").strip().lower()

    # =====================================================
    # GET ALL COURSE SKILLS
    # =====================================================

    @staticmethod
    def get_all_skills():

        courses = CourseModel.get_all()

        skills = {}

        for course in courses:

            for skill in course.get("skills", []):

                skill_name = str(skill).strip()

                if skill_name:
                    skills[
                        skill_name.lower()
                    ] = skill_name

        return sorted(
            skills.values(),
            key=str.lower
        )

    # =====================================================
    # FIND CAREER SKILLS
    # =====================================================

    @staticmethod
    def get_required_skills(career_goal):

        normalized_goal = SkillService.normalize(
            career_goal
        )

        if not normalized_goal:
            return []

        # Exact career match
        if normalized_goal in SkillService.CAREER_SKILL_MAP:

            return SkillService.CAREER_SKILL_MAP[
                normalized_goal
            ]

        # Flexible match:
        # "I want to become a Java backend developer"
        for career, skills in (
            SkillService.CAREER_SKILL_MAP.items()
        ):

            if (
                career in normalized_goal
                or normalized_goal in career
            ):
                return skills

        # Keyword fallback
        keyword_mapping = [
            (
                ["java", "backend"],
                "java backend developer"
            ),
            (
                ["full stack", "fullstack"],
                "full stack developer"
            ),
            (
                ["frontend", "front end"],
                "frontend developer"
            ),
            (
                ["backend", "back end"],
                "backend developer"
            ),
            (
                ["data scientist", "data science"],
                "data scientist"
            ),
            (
                ["machine learning", "ml engineer"],
                "machine learning engineer"
            ),
            (
                ["ai engineer", "artificial intelligence"],
                "ai engineer"
            ),
            (
                ["devops"],
                "devops engineer"
            ),
            (
                ["cloud"],
                "cloud engineer"
            )
        ]

        for keywords, career in keyword_mapping:

            if any(
                keyword in normalized_goal
                for keyword in keywords
            ):
                return SkillService.CAREER_SKILL_MAP[
                    career
                ]

        return []

    # =====================================================
    # SKILL EXISTS
    # =====================================================

    @staticmethod
    def has_skill(
        current_skills,
        required_skill
    ):

        required = SkillService.normalize(
            required_skill
        )

        for skill in current_skills:

            if isinstance(skill, dict):

                name = SkillService.normalize(
                    skill.get("name")
                    or skill.get("skill")
                )

            else:

                name = SkillService.normalize(
                    skill
                )

            if name == required:
                return True

        return False

    # =====================================================
    # CURRENT SKILL NAMES
    # =====================================================

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

            name = str(name or "").strip()

            if name:
                result.append(name)

        return result

    # =====================================================
    # DETERMINE PRIORITY
    # =====================================================

    @staticmethod
    def get_priority(
        skill,
        missing_skills
    ):

        prerequisites = (
            SkillService.PREREQUISITES.get(
                skill,
                []
            )
        )

        missing_normalized = {
            SkillService.normalize(item)
            for item in missing_skills
        }

        # Foundation skills should come first.
        foundation = {
            "programming",
            "java",
            "python",
            "oop",
            "data structures",
            "sql",
            "git",
            "html",
            "css",
            "javascript"
        }

        if SkillService.normalize(skill) in foundation:
            return "high"

        # If a skill is a prerequisite of another missing skill,
        # it becomes high priority.
        for target_skill in missing_skills:

            target_prerequisites = (
                SkillService.PREREQUISITES.get(
                    target_skill,
                    []
                )
            )

            if SkillService.normalize(skill) in {
                SkillService.normalize(p)
                for p in target_prerequisites
            }:
                return "high"

        if prerequisites:

            unresolved = [
                prerequisite
                for prerequisite in prerequisites
                if SkillService.normalize(
                    prerequisite
                ) in missing_normalized
            ]

            if unresolved:
                return "medium"

        return "medium"

    # =====================================================
    # SKILL GAP ANALYSIS
    # =====================================================

    @staticmethod
    def analyze_skill_gap(
        career_goal,
        current_skills,
        experience_level=""
    ):

        required_skills = (
            SkillService.get_required_skills(
                career_goal
            )
        )

        current_skill_names = (
            SkillService.extract_skill_names(
                current_skills
            )
        )

        # Career is not yet in our deterministic map.
        if not required_skills:

            return {
                "careerGoal": career_goal,
                "experienceLevel": experience_level,
                "currentSkills": current_skill_names,
                "requiredSkills": [],
                "matchedSkills": [],
                "missingSkills": [],
                "prioritySkills": [],
                "readinessScore": 0,
                "supportedCareer": False
            }

        matched_skills = []

        missing_skills = []

        for skill in required_skills:

            if SkillService.has_skill(
                current_skills,
                skill
            ):

                matched_skills.append(
                    skill
                )

            else:

                missing_skills.append(
                    skill
                )

        total_required = len(
            required_skills
        )

        total_matched = len(
            matched_skills
        )

        readiness_score = 0

        if total_required > 0:

            readiness_score = round(
                (
                    total_matched
                    / total_required
                ) * 100
            )

        priority_skills = []

        for skill in missing_skills:

            priority_skills.append({
                "skill": skill,

                "priority":
                    SkillService.get_priority(
                        skill,
                        missing_skills
                    ),

                "prerequisites":
                    SkillService.PREREQUISITES.get(
                        skill,
                        []
                    )
            })

        priority_order = {
            "high": 0,
            "medium": 1,
            "low": 2
        }

        priority_skills.sort(
            key=lambda item:
            priority_order.get(
                item["priority"],
                3
            )
        )

        return {
            "careerGoal":
                career_goal,

            "experienceLevel":
                experience_level,

            "currentSkills":
                current_skill_names,

            "requiredSkills":
                required_skills,

            "matchedSkills":
                matched_skills,

            "missingSkills":
                missing_skills,

            "prioritySkills":
                priority_skills,

            "readinessScore":
                readiness_score,

            "supportedCareer":
                True
        }