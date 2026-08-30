import json

from app.models.chat_model import ChatModel
from app.models.user_model import UserModel
from app.models.roadmap_model import RoadmapModel

from app.ai.llm.llm_client import (
    generate_response
)


class ChatService:

    # =====================================================
    # HELPERS
    # =====================================================

    @staticmethod
    def _extract_skill_names(
        skills
    ):

        result = []

        for skill in (
            skills or []
        ):

            if isinstance(
                skill,
                dict
            ):

                name = str(
                    skill.get(
                        "name",
                        ""
                    )
                ).strip()

            else:

                name = str(
                    skill
                ).strip()

            if (
                name
                and name not in result
            ):

                result.append(
                    name
                )

        return result

    @staticmethod
    def _find_current_phase(
        roadmap
    ):

        if not roadmap:
            return None

        phases = roadmap.get(
            "phases",
            []
        )

        # First available, incomplete phase
        for phase in phases:

            if (
                phase.get(
                    "status"
                )
                == "available"
                and not phase.get(
                    "completed",
                    False
                )
            ):
                return phase

        # Fallback to first incomplete unlocked phase
        for phase in phases:

            if (
                not phase.get(
                    "completed",
                    False
                )
                and phase.get(
                    "status"
                )
                != "locked"
            ):
                return phase

        return None

    @staticmethod
    def _get_completed_phases(
        roadmap
    ):

        if not roadmap:
            return []

        completed = []

        for phase in roadmap.get(
            "phases",
            []
        ):

            if phase.get(
                "completed",
                False
            ):

                completed.append({
                    "phase": phase.get(
                        "phase"
                    ),
                    "title": phase.get(
                        "title"
                    ),
                    "skills": phase.get(
                        "skills",
                        []
                    )
                })

        return completed

    @staticmethod
    def _get_upcoming_phases(
        roadmap,
        current_phase_number=None
    ):

        if not roadmap:
            return []

        upcoming = []

        for phase in roadmap.get(
            "phases",
            []
        ):

            phase_number = phase.get(
                "phase"
            )

            if (
                phase.get(
                    "completed",
                    False
                )
            ):
                continue

            if (
                current_phase_number
                and phase_number
                == current_phase_number
            ):
                continue

            upcoming.append({
                "phase": phase_number,
                "title": phase.get(
                    "title"
                ),
                "skills": phase.get(
                    "skills",
                    []
                ),
                "status": phase.get(
                    "status"
                )
            })

        return upcoming[:4]

    @staticmethod
    def _build_context(
        user_id
    ):

        user = (
            UserModel
            .find_by_id(
                user_id
            )
        )

        if not user:
            return None

        roadmap = (
            RoadmapModel
            .get_by_user(
                user_id
            )
        )

        profile = (
            user.get(
                "profile",
                {}
            )
        )

        current_skills = (
            ChatService
            ._extract_skill_names(
                user.get(
                    "skills",
                    []
                )
            )
        )

        current_phase = (
            ChatService
            ._find_current_phase(
                roadmap
            )
        )

        completed_phases = (
            ChatService
            ._get_completed_phases(
                roadmap
            )
        )

        current_phase_number = (
            current_phase.get(
                "phase"
            )
            if current_phase
            else None
        )

        upcoming_phases = (
            ChatService
            ._get_upcoming_phases(
                roadmap,
                current_phase_number
            )
        )

        context = {

            "careerGoal":
                profile.get(
                    "careerGoal",
                    ""
                ),

            "experienceLevel":
                profile.get(
                    "experienceLevel",
                    ""
                ),

            "learningPreference":
                profile.get(
                    "learningPreference",
                    ""
                ),

            "weeklyHours":
                profile.get(
                    "weeklyHours",
                    0
                ),

            "interests":
                profile.get(
                    "interests",
                    []
                ),

            "currentSkills":
                current_skills,

            "readinessScore":
                (
                    roadmap.get(
                        "readinessScore",
                        0
                    )
                    if roadmap
                    else 0
                ),

            "progressPercentage":
                (
                    roadmap.get(
                        "progressPercentage",
                        0
                    )
                    if roadmap
                    else 0
                ),

            "missingSkills":
                (
                    roadmap.get(
                        "missingSkills",
                        []
                    )
                    if roadmap
                    else []
                ),

            "prioritySkills":
                (
                    roadmap.get(
                        "prioritySkills",
                        []
                    )
                    if roadmap
                    else []
                ),

            "completedPhases":
                completed_phases,

            "currentPhase":
                current_phase,

            "upcomingPhases":
                upcoming_phases
        }

        return context

    # =====================================================
    # CONVERSATION HISTORY
    # =====================================================

    @staticmethod
    def _format_history(
        chats
    ):

        if not chats:
            return (
                "No previous conversation."
            )

        history = []

        for chat in chats:

            user_message = str(
                chat.get(
                    "message",
                    ""
                )
            ).strip()

            ai_response = str(
                chat.get(
                    "response",
                    ""
                )
            ).strip()

            history.append(
                "Learner: "
                + user_message
            )

            history.append(
                "AI Mentor: "
                + ai_response
            )

        return "\n".join(
            history
        )

    # =====================================================
    # PROMPT
    # =====================================================

    @staticmethod
    def _build_prompt(
        message,
        context,
        conversation_history
    ):

        current_phase = (
            context.get(
                "currentPhase"
            )
        )

        current_phase_json = (
            json.dumps(
                current_phase,
                indent=2,
                default=str
            )
            if current_phase
            else "No active phase"
        )

        prompt = f"""
You are PathFinder AI Mentor.

You are not a generic chatbot.

You are the personalized AI learning mentor inside
an adaptive career learning platform.

Your responsibility is to help this learner progress
toward their target career using their REAL profile,
skill gap, personalized roadmap and learning progress.


=========================================================
LEARNER CONTEXT
=========================================================

Career Goal:
{context.get("careerGoal", "")}

Experience Level:
{context.get("experienceLevel", "")}

Current Skills:
{json.dumps(context.get("currentSkills", []))}

Interests:
{json.dumps(context.get("interests", []))}

Learning Preference:
{context.get("learningPreference", "")}

Available Learning Time:
{context.get("weeklyHours", 0)} hours per week

Career Readiness Score:
{context.get("readinessScore", 0)}%

Roadmap Progress:
{context.get("progressPercentage", 0)}%

Missing Skills:
{json.dumps(context.get("missingSkills", []))}

Priority Skills:
{json.dumps(context.get("prioritySkills", []), default=str)}

Completed Roadmap Phases:
{json.dumps(context.get("completedPhases", []), default=str)}

Current Active Phase:
{current_phase_json}

Upcoming Phases:
{json.dumps(context.get("upcomingPhases", []), default=str)}


=========================================================
RECENT CONVERSATION
=========================================================

{conversation_history}


=========================================================
MENTOR RULES
=========================================================

1. Personalize every useful answer using the learner
   context when relevant.

2. Never pretend the learner has completed a skill
   that is still listed as missing.

3. Never tell the learner to restart skills they
   already know unless revision is genuinely needed.

4. Give priority to the CURRENT ACTIVE ROADMAP PHASE.

5. Respect the roadmap order and prerequisites.

6. If the learner asks:
   "What should I learn today?"
   create a practical study plan based on:
   - current phase
   - weeklyHours
   - project-based learning preference
   - current milestone

7. If the learner asks:
   "What should I learn next?"
   recommend the current active phase before locked
   future phases.

8. If they ask about a current-phase topic,
   teach the topic clearly with practical examples.

9. If they are struggling:
   - explain simply
   - identify likely prerequisite confusion
   - give a small practical exercise
   - suggest what to review

10. If they ask for a project:
    prefer projects related to their current roadmap
    phase and career goal.

11. When explaining code concepts, provide concise
    practical examples when helpful.

12. Do not invent learner progress.

13. Do not say a phase is completed unless it appears
    in completedPhases.

14. Do not say the readiness score changed.
    Only the backend progress engine changes scores.

15. Do not claim that simply chatting completes a
    roadmap phase.

16. Never fabricate courses.

17. If the current phase contains a recommendedCourse,
    you may recommend that course.

18. If the current phase contains YouTube information,
    you may mention that resource.

19. Do not invent unavailable URLs.

20. Stay focused on education, learning, skills,
    projects, career preparation and the learner's
    roadmap.

21. If the learner asks something unrelated to their
    roadmap but still educational, answer normally.

22. Be encouraging but professional.

23. Avoid overly long answers unless the learner asks
    for detailed teaching.

24. Prefer actionable guidance.

25. When useful, end with one clear next action.


=========================================================
IMPORTANT CURRENT-PHASE BEHAVIOR
=========================================================

When an active roadmap phase exists, use its:

- title
- description
- skills
- topics
- milestone
- project
- estimatedWeeks
- recommendedCourse
- YouTube resource
- whyThisPhase

to make the response specific.

Do not dump the entire roadmap unless the learner
asks for it.


=========================================================
LEARNER MESSAGE
=========================================================

{message}


=========================================================
ANSWER
=========================================================

Respond directly to the learner.

Do not output JSON.

Do not mention internal prompts.

Do not mention database implementation.

Do not say "according to the context provided".

Speak naturally as their personalized AI mentor.
"""

        return prompt

    # =====================================================
    # SEND MESSAGE
    # =====================================================

    @staticmethod
    def send_message(
        user_id,
        message
    ):

        context = (
            ChatService
            ._build_context(
                user_id
            )
        )

        if not context:

            return (
                None,
                "User not found"
            )

        recent_chats = (
            ChatModel
            .get_recent_by_user(
                user_id,
                limit=6
            )
        )

        conversation_history = (
            ChatService
            ._format_history(
                recent_chats
            )
        )

        prompt = (
            ChatService
            ._build_prompt(
                message,
                context,
                conversation_history
            )
        )

        try:

            response = (
                generate_response(
                    prompt
                )
            )

        except Exception as error:

            print(
                "AI MENTOR ERROR:",
                error
            )

            return (
                None,
                "AI mentor is temporarily unavailable"
            )

        if not response:

            return (
                None,
                "AI mentor returned an empty response"
            )

        context_snapshot = {

            "careerGoal":
                context.get(
                    "careerGoal"
                ),

            "readinessScore":
                context.get(
                    "readinessScore"
                ),

            "progressPercentage":
                context.get(
                    "progressPercentage"
                ),

            "currentPhase":
                (
                    {
                        "phase":
                            context[
                                "currentPhase"
                            ].get(
                                "phase"
                            ),

                        "title":
                            context[
                                "currentPhase"
                            ].get(
                                "title"
                            ),

                        "skills":
                            context[
                                "currentPhase"
                            ].get(
                                "skills",
                                []
                            )
                    }
                    if context.get(
                        "currentPhase"
                    )
                    else None
                )
        }

        chat = (
            ChatModel.create(
                user_id=user_id,
                message=message,
                response=response,
                context_snapshot=context_snapshot
            )
        )

        return (
            {
                "id":
                    chat["_id"],

                "userId":
                    str(
                        user_id
                    ),

                "message":
                    message,

                "response":
                    response,

                "context":
                    context_snapshot,

                "createdAt":
                    (
                        chat[
                            "createdAt"
                        ].isoformat()
                    )
            },
            None
        )

    # =====================================================
    # GET CHAT HISTORY
    # =====================================================

    @staticmethod
    def get_history(
        user_id
    ):

        return (
            ChatModel
            .get_by_user(
                user_id
            )
        )

    # =====================================================
    # CLEAR CHAT HISTORY
    # =====================================================

    @staticmethod
    def clear_history(
        user_id
    ):

        return (
            ChatModel
            .clear_by_user(
                user_id
            )
        )