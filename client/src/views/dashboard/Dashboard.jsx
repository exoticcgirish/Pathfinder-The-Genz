import {
  BookOpen,
  ChevronRight,
  Clock3,
  Compass,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const profile = user?.profile || {};

  const name =
    user?.name ||
    user?.fullName ||
    "Learner";

  const interests = Array.isArray(
    profile.interests
  )
    ? profile.interests
    : [];

  const skills = Array.isArray(
    profile.skills
  )
    ? profile.skills
    : Array.isArray(user?.skills)
    ? user.skills
    : [];

  const completedCourses =
    Array.isArray(
      user?.completedCourses
    )
      ? user.completedCourses
      : [];

  const weeklyHours =
    profile.weeklyHours || 0;

  const experienceLevel =
    profile.experienceLevel ||
    "Not set";

  const careerGoal =
    profile.careerGoal ||
    "Set your career goal";

  const learningPreference =
    profile.learningPreference ||
    "Not set";

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc]">

      {/* DASHBOARD TOP HEADER */}
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 pl-20 backdrop-blur md:px-8 lg:pl-8">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Learning dashboard
          </p>

          <h2 className="text-xl font-extrabold text-slate-900">
            Overview
          </h2>
        </div>

        <button
          onClick={() => goTo("/chat")}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          AI Mentor
        </button>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-7 md:px-8 lg:px-10">

        {/* WELCOME */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-7 text-white shadow-xl shadow-slate-200 md:p-9">

          <div className="relative z-10 max-w-2xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-indigo-200">
              <Sparkles size={14} />
              PERSONALIZED LEARNING
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Welcome back, {name.split(" ")[0]} 👋
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
              Keep building your skills and move closer to your
              career goal. Pathfinder is here to guide your next
              step.
            </p>

            <button
              onClick={() => goTo("/progress")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-indigo-50"
            >
              Continue learning
              <ChevronRight size={17} />
            </button>

          </div>

          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute -bottom-40 right-40 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />

        </section>

        {/* STATS */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon={BookOpen}
            title="Completed courses"
            value={completedCourses.length}
            description="Courses finished"
          />

          <StatCard
            icon={Target}
            title="Skills"
            value={skills.length}
            description="Skills being developed"
          />

          <StatCard
            icon={Clock3}
            title="Weekly goal"
            value={`${weeklyHours}h`}
            description="Learning time"
          />

          <StatCard
            icon={GraduationCap}
            title="Experience"
            value={formatValue(
              experienceLevel
            )}
            description="Current level"
          />

        </section>

        {/* CAREER + INTERESTS */}
        <section className="mt-7 grid gap-7 xl:grid-cols-[1.5fr_1fr]">

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Career direction
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  {careerGoal}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Compass size={22} />
              </div>

            </div>

            <div className="mt-7">

              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">
                  Profile completion
                </span>

                <span className="font-bold text-slate-900">
                  {calculateProfileCompletion(
                    profile
                  )}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{
                    width: `${calculateProfileCompletion(
                      profile
                    )}%`,
                  }}
                />
              </div>

            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">

              <InfoBox
                label="Experience level"
                value={formatValue(
                  experienceLevel
                )}
              />

              <InfoBox
                label="Learning preference"
                value={formatValue(
                  learningPreference
                )}
              />

            </div>

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Your interests
                </p>

                <h2 className="mt-2 text-xl font-extrabold text-slate-900">
                  Learning interests
                </h2>
              </div>

              <Sparkles
                className="text-indigo-500"
                size={22}
              />

            </div>

            {interests.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">

                {interests.map(
                  (
                    interest,
                    index
                  ) => (
                    <span
                      key={`${interest}-${index}`}
                      className="rounded-full bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700"
                    >
                      {interest}
                    </span>
                  )
                )}

              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                Add your interests to get personalized course
                and roadmap recommendations.
              </div>
            )}

            <button
              onClick={() => goTo("/profile")}
              className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              Update interests
              <ChevronRight size={16} />
            </button>

          </div>

        </section>

        {/* COURSES + SKILLS */}
        <section className="mt-7 grid gap-7 lg:grid-cols-2">

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Learning
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Courses
                </h2>
              </div>

              <button
                onClick={() => goTo("/courses")}
                className="text-sm font-bold text-indigo-600"
              >
                View all
              </button>

            </div>

            {completedCourses.length > 0 ? (
              <div className="mt-6 space-y-3">

                {completedCourses
                  .slice(0, 3)
                  .map(
                    (
                      course,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <BookOpen size={20} />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-slate-800">
                            {typeof course ===
                            "string"
                              ? course
                              : course?.title ||
                                "Completed course"}
                          </p>

                          <p className="mt-1 text-xs text-emerald-600">
                            Completed
                          </p>

                        </div>

                      </div>
                    )
                  )}

              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No completed courses yet"
                description="Start learning to build your course history."
              />
            )}

          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Development
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Skills
                </h2>
              </div>

              <button
                onClick={() => goTo("/profile")}
                className="text-sm font-bold text-indigo-600"
              >
                Manage
              </button>

            </div>

            {skills.length > 0 ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                {skills
                  .slice(0, 6)
                  .map(
                    (
                      skill,
                      index
                    ) => {

                      const level =
                        typeof skill ===
                        "object"
                          ? Number(
                              skill?.level ||
                                40
                            )
                          : 40;

                      return (
                        <div
                          key={index}
                          className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                        >

                          <p className="text-sm font-bold text-slate-800">
                            {typeof skill ===
                            "string"
                              ? skill
                              : skill?.name ||
                                "Skill"}
                          </p>

                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    level,
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                        </div>
                      );
                    }
                  )}

              </div>
            ) : (
              <EmptyState
                icon={Target}
                title="No skills added"
                description="Your skills will appear here as you build them."
              />
            )}

          </div>

        </section>

      </main>
    </div>
  );
};


/* =========================
   COMPONENTS
========================= */

const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={19} />
        </div>

      </div>

    </div>
  );
};


const InfoBox = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">

      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold capitalize text-slate-800">
        {value}
      </p>

    </div>
  );
};


const EmptyState = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="mt-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-5">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-sm font-bold text-slate-700">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>

    </div>
  );
};


const formatValue = (value) => {
  if (!value) {
    return "Not set";
  }

  return String(value)
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
};


const calculateProfileCompletion = (
  profile
) => {
  const fields = [
    profile?.careerGoal,
    profile?.experienceLevel,
    Array.isArray(
      profile?.interests
    ) &&
      profile.interests.length > 0,
    profile?.learningPreference,
    profile?.weeklyHours,
  ];

  const completed =
    fields.filter(Boolean).length;

  return Math.round(
    (completed / fields.length) *
      100
  );
};


export default Dashboard;
