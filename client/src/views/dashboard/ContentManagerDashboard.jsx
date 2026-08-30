import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ContentManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, role } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Pathfinder
            </h1>

            <p className="text-sm text-slate-500">
              Content Manager
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="text-right">

              <p className="font-semibold text-slate-900">
                {user?.name || "Content Manager"}
              </p>

              <p className="text-xs font-medium text-indigo-600">
                {role || "content_manager"}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">

          <p className="text-sm font-semibold text-indigo-600">
            CONTENT MANAGEMENT
          </p>

          <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
            Content Manager Dashboard
          </h2>

          <p className="mt-2 text-slate-500">
            Create and manage learning courses.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <Link
            to="/content-manager/courses/add"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="mb-4 text-4xl">
              ➕
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Add Course
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create a new course and save it to MongoDB.
            </p>

            <div className="mt-5 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
              Add Course
            </div>

          </Link>

          <Link
            to="/courses"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >

            <div className="mb-4 text-4xl">
              📚
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              View Courses
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              View all available learning courses.
            </p>

            <div className="mt-5 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
              View Courses
            </div>

          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-4 text-4xl">
              ✏️
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Manage Content
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Edit and manage existing learning content.
            </p>

            <div className="mt-5 inline-block rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-400">
              Coming Soon
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default ContentManagerDashboard;