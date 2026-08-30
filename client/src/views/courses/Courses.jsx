import {
  BookOpen,
  Bot,
  ChevronLeft,
  Clock3,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Search,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  User,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCourses,
  deleteCourse,
} from "../../services/courseService";

import { useAuth } from "../../context/AuthContext";

const Courses = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const name = user?.name || "Learner";

  const isManager =
    user?.role === "content_manager" ||
    user?.role === "admin";

  // =====================================
  // LOAD COURSES
  // =====================================

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourses();

      setCourses(response.data?.courses || []);
    } catch (error) {
      console.error("GET COURSES ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // =====================================
  // DELETE COURSE
  // =====================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCourse(id);

      setCourses((previous) =>
        previous.filter(
          (course) => course._id !== id
        )
      );
    } catch (error) {
      console.error("DELETE COURSE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete course."
      );
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================
  // NAVIGATION
  // =====================================

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Courses",
      icon: BookOpen,
      path: "/courses",
      active: true,
    },
    {
      label: "Roadmap",
      icon: Map,
      path: "/roadmap",
    },
    {
      label: "Progress",
      icon: TrendingUp,
      path: "/progress",
    },
    {
      label: "AI Mentor",
      icon: Bot,
      path: "/chat",
    },
  ];

  // =====================================
  // LEVELS
  // =====================================

  const levels = useMemo(() => {
    const uniqueLevels = [
      ...new Set(
        courses
          .map((course) => course.level)
          .filter(Boolean)
          .map((level) => String(level))
      ),
    ];

    return ["All", ...uniqueLevels];
  }, [courses]);

  // =====================================
  // FILTER COURSES
  // =====================================

  const filteredCourses = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return courses.filter((course) => {
      const searchableText = [
        course.title,
        course.description,
        course.level,
        ...(Array.isArray(course.skills)
          ? course.skills
          : []),
        ...(Array.isArray(course.topics)
          ? course.topics
          : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      const matchesLevel =
        selectedLevel === "All" ||
        String(
          course.level || "Beginner"
        ) === selectedLevel;

      return (
        matchesSearch &&
        matchesLevel
      );
    });
  }, [
    courses,
    searchQuery,
    selectedLevel,
  ]);

  // =====================================
  // CLEAR FILTERS
  // =====================================

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLevel("All");
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              Loading courses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-800">

      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >

        {/* LOGO */}

        <div className="flex h-24 shrink-0 items-center border-b border-slate-100 px-7">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-black text-white shadow-sm">
              P
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Pathfinder
              </h1>

              <p className="text-xs font-medium text-slate-400">
                Your learning navigator
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Close menu"
            className="ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-4 py-7">

          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Main menu
          </p>

          <div className="space-y-1">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    item.active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >

                  <Icon
                    size={20}
                    className={
                      item.active
                        ? "text-indigo-600"
                        : "text-slate-500"
                    }
                  />

                  <span>
                    {item.label}
                  </span>

                  {item.active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
                  )}

                </button>
              );
            })}

          </div>

          <p className="mb-3 mt-9 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Account
          </p>

          <button
            onClick={() =>
              navigate("/profile")
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <User size={20} />
            Profile
          </button>

          <button
            onClick={() =>
              navigate("/settings")
            }
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings size={20} />
            Settings
          </button>

        </nav>

        {/* USER */}

        <div className="shrink-0 border-t border-slate-100 p-4">

          <div className="rounded-2xl bg-slate-50 p-4">

            <div className="mb-3 flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                {name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-bold text-slate-800">
                  {name}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {user?.email}
                </p>

              </div>

            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-red-500 transition hover:border-red-200 hover:bg-red-50"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>

        </div>

      </aside>

      {/* =====================================
          MAIN PAGE

          IMPORTANT:
          NO lg:pl-72
          NO lg:ml-72

          The parent layout is already handling
          the sidebar spacing.
      ===================================== */}

      <div className="min-h-screen">

        {/* =====================================
            HEADER
        ===================================== */}

        <header className="sticky top-0 z-20 flex h-24 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">

          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open menu"
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50 lg:hidden"
            >
              <Menu size={21} />
            </button>

            {/* BACK */}

            <button
              onClick={() =>
                navigate(-1)
              }
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <div>
              <p className="text-sm font-medium text-slate-400">
                Learning
              </p>

              <h2 className="text-xl font-extrabold text-slate-900">
                Courses
              </h2>
            </div>

          </div>

          {/* PROFILE */}

          <button
            onClick={() =>
              navigate("/profile")
            }
            aria-label="Open profile"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 transition hover:ring-4 hover:ring-indigo-100"
          >
            {name
              .charAt(0)
              .toUpperCase()}
          </button>

        </header>

        {/* =====================================
            CONTENT
        ===================================== */}

        <main className="w-full px-5 py-8 md:px-8 lg:px-10">

          <div className="mx-auto w-full max-w-[1400px]">

            {/* =====================================
                TITLE
            ===================================== */}

            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 md:text-sm">
                  Learning library
                </p>

                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                  Explore Courses
                </h1>

                <p className="mt-2 text-sm text-slate-500 md:text-base">
                  Find courses that match your learning goals.
                </p>

              </div>

              {isManager && (
                <button
                  onClick={() =>
                    navigate(
                      "/content-manager/courses/add"
                    )
                  }
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
                >
                  + Add Course
                </button>
              )}

            </div>

            {/* =====================================
                ERROR
            ===================================== */}

            {error && (
              <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">

                <span>
                  {error}
                </span>

                <button
                  onClick={loadCourses}
                  className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm"
                >
                  Retry
                </button>

              </div>
            )}

            {/* =====================================
                SEARCH + FILTER
            ===================================== */}

            {courses.length > 0 && (
              <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:p-4">

                <div className="flex flex-col gap-3 md:flex-row">

                  {/* SEARCH */}

                  <div className="relative flex-1">

                    <Search
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value
                        )
                      }
                      placeholder="Search courses, skills or topics..."
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />

                    {searchQuery && (
                      <button
                        onClick={() =>
                          setSearchQuery("")
                        }
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <X size={17} />
                      </button>
                    )}

                  </div>

                  {/* LEVEL */}

                  <div className="relative md:w-52">

                    <SlidersHorizontal
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      value={selectedLevel}
                      onChange={(event) =>
                        setSelectedLevel(
                          event.target.value
                        )
                      }
                      className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    >

                      {levels.map(
                        (level) => (
                          <option
                            key={level}
                            value={level}
                          >
                            {level === "All"
                              ? "All levels"
                              : level}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

                {(searchQuery ||
                  selectedLevel !==
                    "All") && (
                  <div className="mt-3 flex items-center justify-between px-1">

                    <p className="text-xs font-medium text-slate-500">
                      Showing{" "}
                      <span className="font-bold text-slate-700">
                        {filteredCourses.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-slate-700">
                        {courses.length}
                      </span>{" "}
                      courses
                    </p>

                    <button
                      onClick={
                        clearFilters
                      }
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      Clear filters
                    </button>

                  </div>
                )}

              </section>
            )}

            {/* =====================================
                NO COURSES
            ===================================== */}

            {courses.length === 0 ? (

              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <BookOpen size={25} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  No courses found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  No courses have been added yet.
                </p>

                {isManager && (
                  <button
                    onClick={() =>
                      navigate(
                        "/content-manager/courses/add"
                      )
                    }
                    className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    Add First Course
                  </button>
                )}

              </div>

            ) : filteredCourses.length ===
              0 ? (

              /* =====================================
                  NO SEARCH RESULTS
              ===================================== */

              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <Search size={25} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  No matching courses
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or selected level.
                </p>

                <button
                  onClick={
                    clearFilters
                  }
                  className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Clear filters
                </button>

              </div>

            ) : (

              /* =====================================
                  COURSES
              ===================================== */

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {filteredCourses.map(
                  (course) => {

                    const skills =
                      Array.isArray(
                        course.skills
                      )
                        ? course.skills
                        : [];

                    const topics =
                      Array.isArray(
                        course.topics
                      )
                        ? course.topics
                        : [];

                    const visibleSkills =
                      skills.slice(0, 4);

                    const visibleTopics =
                      topics.slice(0, 3);

                    return (
                      <article
                        key={
                          course._id
                        }
                        className="group flex min-h-[430px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg hover:shadow-slate-200/70"
                      >

                        {/* TOP ACCENT */}

                        <div className="h-1 w-full bg-indigo-500" />

                        <div className="flex flex-1 flex-col p-6">

                          {/* COURSE HEADER */}

                          <div className="flex items-start justify-between gap-3">

                            <h2 className="line-clamp-2 min-w-0 flex-1 text-xl font-extrabold leading-7 tracking-tight text-slate-900">
                              {course.title ||
                                "Untitled Course"}
                            </h2>

                            <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-bold capitalize text-indigo-600">
                              {course.level ||
                                "Beginner"}
                            </span>

                          </div>

                          {/* DESCRIPTION */}

                          <p className="mt-4 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">
                            {course.description ||
                              "Build practical skills through structured learning and hands-on practice."}
                          </p>

                          {/* SKILLS */}

                          <div className="mt-5">

                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                              Skills
                            </p>

                            {visibleSkills.length >
                            0 ? (

                              <div className="flex flex-wrap gap-2">

                                {visibleSkills.map(
                                  (
                                    skill,
                                    index
                                  ) => (
                                    <span
                                      key={`${skill}-${index}`}
                                      className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition group-hover:bg-indigo-50 group-hover:text-indigo-700"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}

                                {skills.length >
                                  4 && (
                                  <span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-400">
                                    +
                                    {skills.length -
                                      4}
                                  </span>
                                )}

                              </div>

                            ) : (

                              <p className="text-xs font-medium text-slate-400">
                                No skills listed
                              </p>

                            )}

                          </div>

                          {/* TOPICS */}

                          <div className="mt-5">

                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                              Topics
                            </p>

                            {visibleTopics.length >
                            0 ? (

                              <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                                {visibleTopics.join(
                                  ", "
                                )}

                                {topics.length >
                                  3 &&
                                  "..."}
                              </p>

                            ) : (

                              <p className="text-xs font-medium text-slate-400">
                                No topics listed
                              </p>

                            )}

                          </div>

                          {/* DURATION */}

                          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500">

                            <Clock3
                              size={16}
                              className="text-slate-400"
                            />

                            <span>
                              {course.duration ||
                                "Self-paced"}
                            </span>

                          </div>

                          {/* ACTIONS */}

                          <div className="mt-auto flex gap-3 pt-7">

                            <button
                              onClick={() =>
                                navigate(
                                  `/courses/${course._id}`
                                )
                              }
                              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                              View
                            </button>

                            {isManager && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/content-manager/courses/edit/${course._id}`
                                  )
                                }
                                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                              >
                                Edit
                              </button>
                            )}

                          </div>

                          {/* DELETE */}

                          {isManager && (
                            <button
                              onClick={() =>
                                handleDelete(
                                  course._id
                                )
                              }
                              className="mt-2.5 w-full rounded-xl px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              Delete course
                            </button>
                          )}

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

            {/* RESULT COUNT */}

            {filteredCourses.length >
              0 && (
              <div className="mt-8 flex justify-center">
                <p className="text-xs font-medium text-slate-400">
                  Showing{" "}
                  {filteredCourses.length}{" "}
                  of {courses.length}{" "}
                  {courses.length === 1
                    ? "course"
                    : "courses"}
                </p>
              </div>
            )}

          </div>

        </main>

      </div>
    </div>
  );
};

export default Courses;