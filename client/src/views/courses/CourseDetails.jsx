import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  GraduationCap,
  Layers3,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCourseById,
} from "../../services/courseService";

import {
  startCourse,
} from "../../services/progressService";


const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [starting, setStarting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================
  // LOAD COURSE
  // =========================================

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getCourseById(id);

        const courseData =
          response?.data?.course ||
          response?.data?.data ||
          null;

        setCourse(courseData);
      } catch (error) {
        console.error(
          "GET COURSE ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);


  // =========================================
  // NORMALIZED DATA
  // =========================================

  const skills = useMemo(() => {
    return Array.isArray(
      course?.skills
    )
      ? course.skills
      : [];
  }, [course]);


  const topics = useMemo(() => {
    return Array.isArray(
      course?.topics
    )
      ? course.topics
      : [];
  }, [course]);


  const learningOutcomes = useMemo(() => {
    if (!course) {
      return [];
    }

    if (
      Array.isArray(
        course.learningOutcomes
      ) &&
      course.learningOutcomes.length
    ) {
      return course.learningOutcomes;
    }

    const generated = [];

    if (skills.length > 0) {
      generated.push(
        `Build practical understanding of ${skills
          .slice(0, 3)
          .join(", ")}.`
      );
    }

    if (topics.length > 0) {
      generated.push(
        `Practice key topics including ${topics
          .slice(0, 3)
          .join(", ")}.`
      );
    }

    generated.push(
      "Apply the concepts through hands-on learning and practice."
    );

    return generated;
  }, [course, skills, topics]);


  const resourceUrl =
    course?.url ||
    course?.resourceUrl ||
    course?.courseUrl ||
    course?.externalUrl ||
    course?.link ||
    "";


  const courseLevel =
    course?.level ||
    "Not specified";


  const courseDuration =
    course?.duration ||
    "Self-paced";


  // =========================================
  // START COURSE
  // =========================================

  const handleStartCourse =
    async () => {
      try {
        setStarting(true);
        setError("");
        setSuccess("");

        await startCourse(
          id,
          {
            courseTitle:
              course?.title,

            skill:
              skills[0] ||
              null,
          }
        );

        setSuccess(
          "Course started successfully. Your progress is now being tracked."
        );
      } catch (error) {
        console.error(
          "START COURSE ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to start this course."
        );
      } finally {
        setStarting(false);
      }
    };


  // =========================================
  // OPEN EXTERNAL RESOURCE
  // =========================================

  const handleOpenResource =
    () => {
      if (!resourceUrl) {
        return;
      }

      window.open(
        resourceUrl,
        "_blank",
        "noopener,noreferrer"
      );
    };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading course details...
          </p>

        </div>

      </div>
    );
  }


  // =========================================
  // ERROR
  // =========================================

  if (
    error &&
    !course
  ) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">

        <div className="mx-auto max-w-3xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-bold text-red-600">
            {error ||
              "Course not found"}
          </h2>

          <button
            onClick={() =>
              navigate("/courses")
            }
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to Courses
          </button>

        </div>

      </div>
    );
  }


  if (!course) {
    return null;
  }


  return (
    <div className="min-h-screen bg-[#f5f8fc]">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">

          <button
            onClick={() =>
              navigate("/courses")
            }
            className="flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to Courses
          </button>


          <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
            Pathfinder Learning
          </span>

        </div>

      </header>


      {/* =====================================
          PAGE
      ====================================== */}

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">


        {/* ALERTS */}

        {error && (

          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>

        )}


        {success && (

          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">

            <CheckCircle2
              size={18}
            />

            {success}

          </div>

        )}


        {/* =================================
            HERO
        ================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-7 text-white shadow-xl shadow-slate-200 md:p-10">

          <div className="relative z-10 max-w-3xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-indigo-200">

              <Sparkles
                size={14}
              />

              PERSONALIZED LEARNING RESOURCE

            </div>


            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
              {course.title}
            </h1>


            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              {course.description ||
                "Build practical skills and move closer to your learning goal."}
            </p>


            <div className="mt-6 flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold">

                <GraduationCap
                  size={17}
                />

                {courseLevel}

              </div>


              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold">

                <Clock3
                  size={17}
                />

                {courseDuration}

              </div>


              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold">

                <Target
                  size={17}
                />

                {skills.length} skills

              </div>

            </div>


            <div className="mt-7 flex flex-wrap gap-3">

              <button
                onClick={
                  handleStartCourse
                }
                disabled={
                  starting
                }
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <PlayCircle
                  size={18}
                />

                {starting
                  ? "Starting..."
                  : "Start Course"}

              </button>


              {resourceUrl ? (

                <button
                  onClick={
                    handleOpenResource
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                >

                  <ExternalLink
                    size={18}
                  />

                  Open Learning Resource

                </button>

              ) : (

                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-400"
                >

                  <ExternalLink
                    size={18}
                  />

                  No Resource Link

                </button>

              )}

            </div>

          </div>


          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />

          <div className="absolute -bottom-40 right-40 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />

        </section>


        {/* =================================
            MAIN GRID
        ================================== */}

        <section className="mt-7 grid gap-7 lg:grid-cols-[1.5fr_0.7fr]">


          {/* LEFT */}

          <div className="space-y-7">


            {/* SKILLS */}

            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                  <Target
                    size={21}
                  />

                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Development
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                    Skills you'll build
                  </h2>

                </div>

              </div>


              {skills.length > 0 ? (

                <div className="mt-6 flex flex-wrap gap-2">

                  {skills.map(
                    (
                      skill,
                      index
                    ) => (

                      <span
                        key={`${skill}-${index}`}
                        className="rounded-xl bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700"
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p className="mt-5 text-sm text-slate-500">
                  No skills have been attached to this course yet.
                </p>

              )}

            </article>


            {/* TOPICS */}

            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                  <Layers3
                    size={21}
                  />

                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Curriculum
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                    Topics covered
                  </h2>

                </div>

              </div>


              {topics.length > 0 ? (

                <div className="mt-6 grid gap-3 sm:grid-cols-2">

                  {topics.map(
                    (
                      topic,
                      index
                    ) => (

                      <div
                        key={`${topic}-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-extrabold text-indigo-600 shadow-sm">
                          {index + 1}
                        </div>

                        <p className="text-sm font-semibold text-slate-700">
                          {topic}
                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="mt-5 text-sm text-slate-500">
                  No topic list is available yet.
                </p>

              )}

            </article>


            {/* OUTCOMES */}

            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                  <CheckCircle2
                    size={21}
                  />

                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Outcome
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                    What you'll achieve
                  </h2>

                </div>

              </div>


              <div className="mt-6 space-y-3">

                {learningOutcomes.map(
                  (
                    outcome,
                    index
                  ) => (

                    <div
                      key={index}
                      className="flex gap-3 rounded-2xl bg-slate-50 p-4"
                    >

                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />

                      <p className="text-sm leading-6 text-slate-600">
                        {outcome}
                      </p>

                    </div>

                  )
                )}

              </div>

            </article>

          </div>


          {/* =================================
              RIGHT SUMMARY
          ================================== */}

          <aside className="space-y-6">


            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Course snapshot
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-slate-900">
                At a glance
              </h2>


              <div className="mt-6 space-y-4">

                <SummaryRow
                  icon={GraduationCap}
                  label="Level"
                  value={courseLevel}
                />

                <SummaryRow
                  icon={Clock3}
                  label="Duration"
                  value={courseDuration}
                />

                <SummaryRow
                  icon={Target}
                  label="Skills"
                  value={`${skills.length}`}
                />

                <SummaryRow
                  icon={Layers3}
                  label="Topics"
                  value={`${topics.length}`}
                />

              </div>

            </article>


            <article className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">

                <Sparkles
                  size={19}
                />

              </div>


              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                Why this matters
              </h3>


              <p className="mt-2 text-sm leading-6 text-slate-600">
                Completing this course helps strengthen the skills Pathfinder uses to evaluate your career readiness and personalized roadmap.
              </p>


              <button
                onClick={() =>
                  navigate(
                    "/progress"
                  )
                }
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-600"
              >

                View learning progress →

              </button>

            </article>


            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                  <BookOpen
                    size={19}
                  />

                </div>

                <div>

                  <p className="text-sm font-bold text-slate-800">
                    Learning resource
                  </p>

                  <p className="text-xs text-slate-400">
                    External course material
                  </p>

                </div>

              </div>


              {resourceUrl ? (

                <button
                  onClick={
                    handleOpenResource
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >

                  Open resource

                  <ExternalLink
                    size={16}
                  />

                </button>

              ) : (

                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-center text-xs font-medium text-slate-400">
                  No external resource has been attached to this course.
                </div>

              )}

            </article>

          </aside>

        </section>

      </main>

    </div>
  );
};


const SummaryRow = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
          <Icon size={17} />
        </div>

        <span className="text-sm font-semibold text-slate-500">
          {label}
        </span>

      </div>

      <span className="text-sm font-extrabold capitalize text-slate-900">
        {value}
      </span>

    </div>
  );
};


export default CourseDetails;