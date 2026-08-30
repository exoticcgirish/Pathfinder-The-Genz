import os
import json

from google import genai


# =========================================================
# GEMINI CLIENT
# =========================================================

client = genai.Client(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)


# =========================================================
# SAFE JSON EXTRACTION
# =========================================================

def _clean_json_text(text):

    text = str(
        text or ""
    ).strip()

    if text.startswith(
        "```"
    ):

        text = (
            text
            .replace(
                "```json",
                ""
            )
            .replace(
                "```JSON",
                ""
            )
            .replace(
                "```",
                ""
            )
            .strip()
        )

    start = text.find(
        "{"
    )

    end = text.rfind(
        "}"
    )

    if (
        start != -1
        and end != -1
        and end > start
    ):

        text = text[
            start:
            end + 1
        ]

    return text


# =========================================================
# GENERATE ROADMAP
# =========================================================

def generate_roadmap(
    profile
):

    career_goal = (
        profile.get(
            "careerGoal",
            ""
        )
    )

    experience_level = (
        profile.get(
            "experienceLevel",
            "beginner"
        )
    )

    current_skills = (
        profile.get(
            "currentSkills",
            profile.get(
                "skills",
                []
            )
        )
    )

    missing_skills = (
        profile.get(
            "missingSkills",
            []
        )
    )

    priority_skills = (
        profile.get(
            "prioritySkills",
            []
        )
    )

    interests = (
        profile.get(
            "interests",
            []
        )
    )

    learning_preference = (
        profile.get(
            "learningPreference",
            ""
        )
    )

    weekly_hours = (
        profile.get(
            "weeklyHours",
            5
        )
    )

    readiness_score = (
        profile.get(
            "readinessScore",
            0
        )
    )

    recommended_courses = (
        profile.get(
            "recommendedCourses",
            []
        )
    )

    # =====================================================
    # PRIORITY SKILL TEXT
    # =====================================================

    priority_text = []

    for item in (
        priority_skills
        or []
    ):

        if isinstance(
            item,
            dict
        ):

            priority_text.append({

                "skill":
                    item.get(
                        "skill",
                        ""
                    ),

                "priority":
                    item.get(
                        "priority",
                        ""
                    ),

                "prerequisites":
                    item.get(
                        "prerequisites",
                        []
                    )
            })

        else:

            priority_text.append({
                "skill":
                    str(item),
                "priority":
                    "medium",
                "prerequisites":
                    []
            })

    # =====================================================
    # RECOMMENDED COURSE SUMMARY
    # =====================================================

    course_summary = []

    for course in (
        recommended_courses
        or []
    ):

        course_summary.append({

            "title":
                course.get(
                    "title",
                    ""
                ),

            "skills":
                course.get(
                    "skills",
                    []
                ),

            "matchedGapSkills":
                course.get(
                    "matchedGapSkills",
                    []
                ),

            "matchScore":
                course.get(
                    "matchScore",
                    0
                )
        })

    # =====================================================
    # PROMPT
    # =====================================================

    prompt = f"""
You are an expert AI learning-path architect.

Your task is to generate a highly personalized,
skill-gap-driven learning roadmap.

The roadmap must NOT be generic.

It must be based directly on the learner's:

- career goal
- current skills
- missing skills
- priority skills
- prerequisites
- readiness score
- learning preference
- weekly study time
- recommended course signals


=========================================================
LEARNER PROFILE
=========================================================

Career Goal:
{career_goal}

Experience Level:
{experience_level}

Current Skills:
{json.dumps(current_skills)}

Missing Skills:
{json.dumps(missing_skills)}

Priority Skills:
{json.dumps(priority_text)}

Interests:
{json.dumps(interests)}

Learning Preference:
{learning_preference}

Weekly Learning Hours:
{weekly_hours}

Current Career Readiness Score:
{readiness_score}%

Recommended Course Signals:
{json.dumps(course_summary)}


=========================================================
MOST IMPORTANT RULE
=========================================================

The roadmap MUST primarily teach the learner's
MISSING SKILLS.

Do NOT spend entire phases re-teaching skills the
learner already knows unless an existing skill is
strictly necessary as a short prerequisite.

For example:

If currentSkills contains "Java",
do NOT create a full beginner Java phase.

If missingSkills contains "Data Structures",
"Spring Boot", "REST API", "JPA", "Hibernate",
"Microservices", "Docker", and "AWS",
these missing skills must appear clearly in the roadmap.

Do not replace the provided missing skills with
unrelated technologies.


=========================================================
PRIORITY RULES
=========================================================

Priority skills must influence roadmap ordering.

HIGH priority missing skills should appear before
MEDIUM priority missing skills whenever prerequisites
allow it.

Respect prerequisite relationships.

Example:

Spring Boot prerequisite:
Java + OOP

JPA prerequisite:
Java + SQL

Microservices prerequisite:
Spring Boot + REST API

If prerequisites are already present in currentSkills,
do NOT create a separate prerequisite phase for them.

Instead, consider the prerequisite satisfied.


=========================================================
ROADMAP STRUCTURE
=========================================================

Generate between 5 and 8 phases.

The phases should normally follow this structure:

1. highest-priority foundational skill gap
2. core framework / platform skills
3. persistence / data integration
4. architecture / advanced engineering
5. deployment / cloud / DevOps
6. capstone / system design / job readiness

Do not force this exact pattern when it does not fit
the career goal.


=========================================================
TIME PLANNING
=========================================================

The learner has:

{weekly_hours} hours per week.

Assign a realistic estimatedWeeks value to each phase.

Typical guidance:

3-4 hours/week:
3-5 weeks per significant phase

5-8 hours/week:
2-4 weeks per significant phase

9-12 hours/week:
1-3 weeks per significant phase

Do not give every phase exactly the same duration
unless that is genuinely reasonable.


=========================================================
LEARNING PREFERENCE
=========================================================

Learning preference:
{learning_preference}

If project-based:
favor hands-on mini projects and implementation tasks.

If video:
favor guided learning and practice milestones.

If reading:
favor documentation, concepts and implementation tasks.

If practice:
favor exercises, coding challenges and practical tasks.


=========================================================
EXPLAINABILITY
=========================================================

Every phase MUST explain WHY it appears.

The field "whyThisPhase" must reference at least one of:

- a missing skill
- priority
- prerequisite dependency
- career goal
- current skill foundation
- learning preference

Do not write vague explanations such as:

"This is useful for your career."

Prefer:

"Spring Boot is a high-priority missing skill and
builds directly on your existing Java and OOP knowledge."


=========================================================
PROJECT REQUIREMENT
=========================================================

Every phase MUST include one practical project.

Projects must be realistic and specific.

Good example:

"Build a Spring Boot Task Management REST API with
validation, exception handling and PostgreSQL."

Bad example:

"Create a project using Spring Boot."


=========================================================
MILESTONE REQUIREMENT
=========================================================

Every milestone must describe something measurable
that the learner can demonstrate after the phase.

Good:

"Design and implement CRUD REST APIs with DTOs,
validation and global exception handling."

Bad:

"Understand REST APIs."


=========================================================
COURSE RULES
=========================================================

Do NOT invent courses.

Do NOT create course URLs.

Do NOT invent MongoDB course IDs.

The backend will match roadmap phases to courses
from the real course database.

Use the recommended course signals only to understand
what real course coverage may already exist.


=========================================================
SEARCH KEYWORDS
=========================================================

Every phase must contain 4 to 8 searchKeywords.

Search keywords must include exact technologies and
skill names that could appear in:

- course title
- course description
- skills
- topics

Whenever possible, include exact provided missing-skill
names.

For example:

[
    "Spring Boot",
    "Java Spring Boot",
    "Spring Framework",
    "Spring Boot REST API",
    "Spring MVC"
]


=========================================================
YOUTUBE SEARCH QUERY
=========================================================

Provide exactly one youtubeSearchQuery per phase.

This should be a search phrase only.

Do NOT invent a video or playlist URL.

Examples:

"Java data structures algorithms full course"

"Spring Boot REST API full course"

"Docker AWS Spring Boot deployment course"


=========================================================
MANDATORY PHASE FIELDS
=========================================================

Every phase MUST include:

phase

title

description

skills

topics

prerequisites

estimatedWeeks

milestone

project

whyThisPhase

searchKeywords

youtubeSearchQuery


=========================================================
CRITICAL VALIDATION RULES
=========================================================

1. Do not omit the learner's high-priority missing skills.

2. Do not create a generic roadmap that ignores
missingSkills.

3. Do not create entire phases for already-known skills
unless essential.

4. Prerequisites must be realistic.

5. Existing current skills satisfy prerequisite
requirements.

6. Projects must be practical.

7. whyThisPhase must never be empty.

8. description must never be empty.

9. project must never be empty.

10. estimatedWeeks must be an integer.

11. skills must be a JSON array.

12. topics must be a JSON array.

13. prerequisites must be a JSON array.

14. searchKeywords must be a JSON array.

15. Return valid JSON only.

16. Do not return markdown.

17. Do not return ```json.

18. Do not include explanations outside JSON.


=========================================================
OUTPUT FORMAT
=========================================================

Return exactly this structure:

{{
    "careerGoal": "{career_goal}",

    "readinessScore": {readiness_score},

    "phases": [

        {{
            "phase": 1,

            "title":
                "Specific learning phase title",

            "description":
                "What the learner will study and why.",

            "skills": [
                "Skill 1",
                "Skill 2"
            ],

            "topics": [
                "Topic 1",
                "Topic 2"
            ],

            "prerequisites": [
                "Prerequisite 1"
            ],

            "estimatedWeeks": 2,

            "milestone":
                "Measurable outcome for this phase.",

            "project":
                "Specific hands-on project.",

            "whyThisPhase":
                "Personalized explanation based on the learner's skill gap.",

            "searchKeywords": [
                "keyword 1",
                "keyword 2",
                "keyword 3",
                "keyword 4"
            ],

            "youtubeSearchQuery":
                "technology full course search query"
        }}

    ]
}}
"""

    # =====================================================
    # GEMINI REQUEST
    # =====================================================

    response = (
        client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )
    )

    text = (
        response.text
        if response.text
        else ""
    )

    text = _clean_json_text(
        text
    )

    # =====================================================
    # PARSE JSON
    # =====================================================

    try:

        data = json.loads(
            text
        )

    except json.JSONDecodeError as error:

        print(
            "GEMINI INVALID JSON:"
        )

        print(
            text
        )

        raise Exception(
            "Gemini returned invalid JSON: "
            + str(error)
        )

    # =====================================================
    # BASIC RESPONSE VALIDATION
    # =====================================================

    if not isinstance(
        data,
        dict
    ):

        raise Exception(
            "Gemini returned invalid roadmap format"
        )

    phases = data.get(
        "phases"
    )

    if not isinstance(
        phases,
        list
    ):

        raise Exception(
            "Gemini roadmap does not contain phases"
        )

    if len(
        phases
    ) == 0:

        raise Exception(
            "Gemini generated no roadmap phases"
        )

    # =====================================================
    # VALIDATE + CLEAN EVERY PHASE
    # =====================================================

    cleaned_phases = []

    for index, phase in enumerate(
        phases,
        start=1
    ):

        if not isinstance(
            phase,
            dict
        ):
            continue

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

        prerequisites = (
            phase.get(
                "prerequisites",
                []
            )
        )

        if not isinstance(
            prerequisites,
            list
        ):
            prerequisites = []

        search_keywords = (
            phase.get(
                "searchKeywords",
                []
            )
        )

        if not isinstance(
            search_keywords,
            list
        ):
            search_keywords = []

        estimated_weeks = (
            phase.get(
                "estimatedWeeks",
                2
            )
        )

        try:

            estimated_weeks = int(
                estimated_weeks
            )

        except (
            TypeError,
            ValueError
        ):

            estimated_weeks = 2

        if estimated_weeks < 1:
            estimated_weeks = 1

        if estimated_weeks > 8:
            estimated_weeks = 8

        title = str(
            phase.get(
                "title",
                f"Learning Phase {index}"
            )
        ).strip()

        description = str(
            phase.get(
                "description",
                ""
            )
        ).strip()

        milestone = str(
            phase.get(
                "milestone",
                ""
            )
        ).strip()

        project = str(
            phase.get(
                "project",
                ""
            )
        ).strip()

        why_this_phase = str(
            phase.get(
                "whyThisPhase",
                ""
            )
        ).strip()

        youtube_search_query = str(
            phase.get(
                "youtubeSearchQuery",
                phase.get(
                    "youtubePlaylistQuery",
                    ""
                )
            )
        ).strip()

        # ===============================================
        # SAFE NON-EMPTY FALLBACKS
        # ===============================================

        if not description:

            description = (
                "Build practical knowledge of "
                + ", ".join(
                    map(
                        str,
                        skills
                    )
                )
                + "."
            )

        if not milestone:

            milestone = (
                "Demonstrate practical ability in "
                + ", ".join(
                    map(
                        str,
                        skills
                    )
                )
                + "."
            )

        if not project:

            project = (
                "Build a practical mini project using "
                + ", ".join(
                    map(
                        str,
                        skills
                    )
                )
                + "."
            )

        if not why_this_phase:

            why_this_phase = (
                "This phase addresses an important "
                "skill gap for the target career."
            )

        if not search_keywords:

            search_keywords = (
                skills[:]
            )

        if not youtube_search_query:

            youtube_search_query = (
                " ".join(
                    map(
                        str,
                        skills
                    )
                )
                + " full course"
            ).strip()

        cleaned_phases.append({

            "phase":
                index,

            "title":
                title,

            "description":
                description,

            "skills":
                skills,

            "topics":
                topics,

            "prerequisites":
                prerequisites,

            "estimatedWeeks":
                estimated_weeks,

            "milestone":
                milestone,

            "project":
                project,

            "whyThisPhase":
                why_this_phase,

            "searchKeywords":
                search_keywords,

            "youtubeSearchQuery":
                youtube_search_query
        })

    # =====================================================
    # FINAL VALIDATION
    # =====================================================

    if not cleaned_phases:

        raise Exception(
            "Gemini returned no valid roadmap phases"
        )

    return {

        "careerGoal":
            career_goal,

        "readinessScore":
            readiness_score,

        "phases":
            cleaned_phases
    }