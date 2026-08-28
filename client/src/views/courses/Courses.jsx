import {
  BookOpen,
  Bot,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Settings,
  TrendingUp,
  User,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCourses, deleteCourse } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";

const Courses = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const name = user?.name || "Learner";

  const isManager =
    user?.role === "content_manager" || user?.role === "admin";

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourses();

      setCourses(response.data?.courses || []);
    } catch (error) {
      console.error("GET COURSES ERROR:", error);

      setError(
        error.response?.data?.message || "Failed to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCourse(id);

      setCourses((previous) =>
        previous.filter((course) => course._id !== id)
      );
    } catch (error) {
      console.error("DELETE COURSE ERROR:", error);

      alert(
        error.response?.data?.message || "Failed to delete course."
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8fc]">
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Loading courses...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-800">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* LOGO */}
        <div className="flex h-24 items-center border-b border-slate-100 px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-black text-white">
              P
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Pathfinder
              </h1>

              <p className="text-xs font-medium text-slate-400">
                Your learning navigator
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-2 text-slate-400 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-7">
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
                  <Icon size={20} />

                  <span>{item.label}</span>

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
            onClick={() => navigate("/profile")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <User size={20} />
            Profile
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings size={20} />
            Settings
          </button>
        </nav>

        {/* USER */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                {name.charAt(0).toUpperCase()}
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-50"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:pl-72">
        {/* HEADER */}
        <header className="sticky top-0 z-20 flex h-24 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            {/* MOBILE MENU */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden"
            >
              <Menu size={21} />
            </button>

            {/* BACK */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <div className="hidden sm:block">
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
            onClick={() => navigate("/profile")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 transition hover:ring-4 hover:ring-indigo-100"
          >
            {name.charAt(0).toUpperCase()}
          </button>
        </header>

        {/* CONTENT */}
        <main className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:px-10">
          {/* TITLE */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Learning library
              </p>

              <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
                Explore Courses
              </h1>

              <p className="mt-2 text-slate-500">
                Find courses that match your learning goals.
              </p>
            </div>

            {isManager && (
              <button
                onClick={() =>
                  navigate("/content-manager/courses/add")
                }
                className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                + Add Course
              </button>
            )}
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* NO COURSES */}
          {courses.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <BookOpen size={25} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No courses found
              </h2>

              <p className="mt-2 text-slate-500">
                No courses have been added yet.
              </p>

              {isManager && (
                <button
                  onClick={() =>
                    navigate("/content-manager/courses/add")
                  }
                  className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
                >
                  Add First Course
                </button>
              )}
            </div>
          ) : (
            /* COURSES */
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* COURSE HEADER */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold leading-7 text-slate-900">
                      {course.title}
                    </h2>

                    <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-600">
                      {course.level || "Beginner"}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="line-clamp-3 text-sm leading-6 text-slate-500">
                    {course.description ||
                      "No description available."}
                  </p>

                  {/* SKILLS */}
                  {course.skills?.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Skills
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {course.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TOPICS */}
                  {course.topics?.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Topics
                      </p>

                      <p className="text-sm leading-6 text-slate-600">
                        {course.topics.join(", ")}
                      </p>
                    </div>
                  )}

                  {/* DURATION */}
                  {course.duration && (
                    <p className="mt-5 text-sm font-medium text-slate-500">
                      ⏱ {course.duration}
                    </p>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-auto flex gap-3 pt-7">
                    <button
                      onClick={() =>
                        navigate(`/courses/${course._id}`)
                      }
                      className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
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
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                    )}

                    {isManager && (
                      <button
                        onClick={() =>
                          handleDelete(course._id)
                        }
                        className="rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Courses;