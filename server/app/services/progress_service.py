from datetime import datetime

from app.models.progress_model import ProgressModel
from app.models.roadmap_model import RoadmapModel
from app.models.user_model import UserModel
from app.services.skill_service import SkillService


class ProgressService:

    @staticmethod
    def start_course(
        user_id,
        course_id,
        course_title=None,
        skill=None
    ):

        existing = ProgressModel.find_by_user_and_course(
            user_id,
            course_id
        )

        if existing:
            existing["_id"] = str(existing["_id"])
            return existing, None

        progress = ProgressModel.create({
            "userId": user_id,
            "courseId": course_id,
            "courseTitle": course_title,
            "skill": skill,
            "progress": 0,
            "status": "in_progress"
        })

        return progress, None


    @staticmethod
    def get_user_progress(user_id):

        return ProgressModel.get_by_user(
            user_id
        )


    @staticmethod
    def update_progress(
        user_id,
        progress_id,
        percentage,
        status,
        completed_topics=None
    ):

        progress = ProgressModel.find_by_id(
            progress_id
        )

        if not progress:
            return None, "Progress record not found"

        if str(progress.get("userId")) != str(user_id):
            return (
                None,
                "You are not allowed to update this progress record"
            )

        success = ProgressModel.update(
            progress_id,
            percentage,
            status,
            completed_topics
        )

        if not success:
            return None, "Unable to update progress"

        updated = ProgressModel.find_by_id(
            progress_id
        )

        if updated:
            updated["_id"] = str(updated["_id"])

        return updated, None


    @staticmethod
    def _extract_skill_names(skills):

        result = []
        seen = set()

        for skill in skills or []:

            if isinstance(skill, dict):
                name = str(
                    skill.get("name", "")
                ).strip()
            else:
                name = str(skill).strip()

            if not name:
                continue

            key = name.lower()

            if key not in seen:
                seen.add(key)
                result.append(name)

        return result


    @staticmethod
    def _merge_completed_skills(
        current_skills,
        completed_skills
    ):

        normalized = {}

        for skill in current_skills or []:

            if isinstance(skill, dict):

                name = str(
                    skill.get("name", "")
                ).strip()

                if not name:
                    continue

                skill_copy = dict(skill)
                skill_copy["name"] = name

                normalized[name.lower()] = skill_copy

            else:

                name = str(skill).strip()

                if not name:
                    continue

                normalized[name.lower()] = {
                    "name": name,
                    "level": 70
                }

        for skill in completed_skills or []:

            name = str(skill).strip()

            if not name:
                continue

            key = name.lower()

            if key not in normalized:

                normalized[key] = {
                    "name": name,
                    "level": 70
                }

            else:

                existing = normalized[key]

                try:
                    current_level = int(
                        existing.get("level", 0)
                    )
                except (TypeError, ValueError):
                    current_level = 0

                existing["level"] = max(
                    current_level,
                    70
                )

        return list(normalized.values())


    @staticmethod
    def complete_phase(
        user_id,
        phase_number
    ):


        roadmap = RoadmapModel.get_by_user(
            user_id
        )

        if not roadmap:
            return None, "Roadmap not found"

        phases = roadmap.get(
            "phases",
            []
        )

        if not phases:
            return None, "Roadmap has no phases"


        target_phase = None

        for phase in phases:

            try:
                current_phase_number = int(
                    phase.get("phase", 0)
                )
            except (TypeError, ValueError):
                continue

            if current_phase_number == int(
                phase_number
            ):
                target_phase = phase
                break

        if not target_phase:
            return None, "Roadmap phase not found"


        if target_phase.get("status") == "locked":
            return None, "This phase is still locked"

        if target_phase.get(
            "completed",
            False
        ):
            return None, "This phase is already completed"


        target_phase["completed"] = True
        target_phase["status"] = "completed"

        completed_skills = (
            target_phase.get(
                "skills",
                []
            )
            or []
        )


        next_phase_number = (
            int(phase_number) + 1
        )

        for phase in phases:

            try:
                phase_no = int(
                    phase.get("phase", 0)
                )
            except (TypeError, ValueError):
                continue

            if (
                phase_no == next_phase_number
                and not phase.get(
                    "completed",
                    False
                )
            ):
                phase["status"] = "available"


        completed_count = sum(
            1
            for phase in phases
            if phase.get(
                "completed",
                False
            )
        )

        total_phases = len(phases)

        progress_percentage = (
            round(
                (
                    completed_count
                    / total_phases
                )
                * 100
            )
            if total_phases > 0
            else 0
        )

        roadmap["phases"] = phases
        roadmap[
            "progressPercentage"
        ] = progress_percentage


        ProgressModel.upsert_phase_progress(
            user_id,
            phase_number,
            100,
            "completed"
        )


        user = UserModel.find_by_id(
            user_id
        )

        if not user:
            return None, "User not found"

        existing_skills = user.get(
            "skills",
            []
        )


        updated_skills = (
            ProgressService
            ._merge_completed_skills(
                existing_skills,
                completed_skills
            )
        )

        UserModel.update_skills(
            user_id,
            updated_skills
        )


        profile = user.get(
            "profile",
            {}
        ) or {}

        career_goal = str(
            profile.get(
                "careerGoal",
                ""
            )
        ).strip()

        experience_level = str(
            profile.get(
                "experienceLevel",
                "beginner"
            )
        ).strip()

        if not career_goal:
            return (
                None,
                "Career goal is missing from user profile"
            )


        skill_gap = (
            SkillService
            .analyze_skill_gap(
                career_goal,
                updated_skills,
                experience_level
            )
        )

        if not isinstance(
            skill_gap,
            dict
        ):
            return (
                None,
                "Unable to recalculate skill gap"
            )


        readiness_score = skill_gap.get(
            "readinessScore",
            0
        )

        missing_skills = skill_gap.get(
            "missingSkills",
            []
        )

        priority_skills = skill_gap.get(
            "prioritySkills",
            []
        )

        roadmap[
            "readinessScore"
        ] = readiness_score

        roadmap[
            "missingSkills"
        ] = missing_skills

        roadmap[
            "prioritySkills"
        ] = priority_skills

        roadmap[
            "currentSkills"
        ] = (
            ProgressService
            ._extract_skill_names(
                updated_skills
            )
        )

        roadmap[
            "updatedAt"
        ] = datetime.utcnow()


        RoadmapModel.update(
            user_id,
            roadmap
        )


        next_phase = next(
            (
                {
                    "phase": phase.get(
                        "phase"
                    ),
                    "title": phase.get(
                        "title"
                    ),
                    "status": phase.get(
                        "status"
                    )
                }
                for phase in phases
                if (
                    phase.get("status")
                    == "available"
                    and not phase.get(
                        "completed",
                        False
                    )
                )
            ),
            None
        )


        return {
            "phaseCompleted": int(
                phase_number
            ),
            "completedSkills":
                completed_skills,
            "progressPercentage":
                progress_percentage,
            "updatedSkills":
                updated_skills,
            "readinessScore":
                readiness_score,
            "missingSkills":
                missing_skills,
            "prioritySkills":
                priority_skills,
            "nextPhase":
                next_phase
        }, None