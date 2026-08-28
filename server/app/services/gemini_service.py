import os
import json
from google import genai


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_roadmap(profile):

    prompt = f"""
You are an expert AI career roadmap generator.

Create a personalized, realistic learning roadmap for this learner.

LEARNER PROFILE

Career Goal:
{profile.get("careerGoal", "")}

Experience Level:
{profile.get("experienceLevel", "beginner")}

Current Skills:
{profile.get("skills", [])}

Interests:
{profile.get("interests", [])}

Learning Preference:
{profile.get("learningPreference", "")}


IMPORTANT ROADMAP RULES

1. Generate 5 to 8 phases.

2. Build the roadmap specifically for the career goal.

3. Consider the learner's current skills and experience.

4. Do not unnecessarily teach skills the learner already knows.

5. Add prerequisites only when they are actually required.

6. Order the roadmap logically:

   prerequisites
   ->
   fundamentals
   ->
   intermediate skills
   ->
   advanced skills
   ->
   real-world projects
   ->
   job readiness

7. Every phase must have a clear learning objective.

8. Every phase must contain practical projects.

9. The roadmap must lead toward becoming job-ready.

10. Do NOT create courses.

11. Do NOT invent courses.

12. Do NOT create course URLs.

13. Do NOT create YouTube URLs.

14. Our backend will search our MongoDB courses later.

15. Therefore, provide strong search keywords for every phase.

16. Search keywords should include technologies, frameworks,
    concepts and skills that could appear in course titles,
    descriptions, skills or topics.

17. Provide a YouTube search query that can find a high-quality
    educational playlist or full course for that phase.

18. Never claim that a particular YouTube video or playlist exists.

19. Do not add unrelated technologies just to make the roadmap longer.

20. Make the roadmap specific to the career goal.


SEARCH KEYWORD RULES

Each phase must have 4 to 8 search keywords.

For example:

Spring Boot phase:

[
    "Spring Boot",
    "Spring Framework",
    "Java Spring Boot",
    "Spring Boot REST API",
    "Spring Boot backend"
]

React phase:

[
    "React",
    "React JS",
    "React.js",
    "React frontend",
    "React hooks"
]

Database phase:

[
    "MongoDB",
    "MongoDB database",
    "NoSQL",
    "MongoDB CRUD",
    "MongoDB queries"
]


YOUTUBE SEARCH QUERY RULES

Create one useful search query per phase.

Examples:

"Spring Boot REST API full course"

"React JS full course for beginners"

"MongoDB complete course"

"Java data structures algorithms full course"


PHASE REQUIREMENTS

Every phase MUST contain:

- phase
- title
- goal
- skills
- topics
- projects
- milestone
- searchKeywords
- youtubeSearchQuery


Return ONLY valid JSON.

Do not return markdown.

Do not return ```json.

Do not return explanations.

Return exactly this structure:

{{
    "careerGoal": "{profile.get("careerGoal", "")}",
    "phases": [
        {{
            "phase": 1,
            "title": "Phase title",
            "goal": "What the learner will achieve",
            "skills": [
                "Skill 1",
                "Skill 2"
            ],
            "topics": [
                "Topic 1",
                "Topic 2"
            ],
            "projects": [
                "Project 1",
                "Project 2"
            ],
            "milestone": "What the learner should be able to do",
            "searchKeywords": [
                "keyword 1",
                "keyword 2",
                "keyword 3",
                "keyword 4"
            ],
            "youtubePlaylistQuery": "React JS complete playlist"
        }}
    ]
}}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    text = response.text.strip()

    # Remove markdown code block if Gemini adds it
    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    try:

        data = json.loads(text)

    except json.JSONDecodeError as e:

        print("GEMINI INVALID JSON:")
        print(text)

        raise Exception(
            f"Gemini returned invalid JSON: {e}"
        )

    # =========================
    # VALIDATE RESPONSE
    # =========================

    if not isinstance(data, dict):
        raise Exception(
            "Gemini returned invalid roadmap format"
        )

    if not isinstance(
        data.get("phases"),
        list
    ):
        raise Exception(
            "Gemini roadmap does not contain phases"
        )

    if len(data["phases"]) == 0:
        raise Exception(
            "Gemini generated no roadmap phases"
        )

    return data