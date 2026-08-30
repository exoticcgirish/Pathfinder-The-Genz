import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
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
              Pathfinder Admin
            </h1>

            <p className="text-sm text-slate-500">
              Administration Dashboard
            </p>
          </div>

          <div className="flex items-center gap-5">

            <div className="text-right">
              <p className="font-semibold text-slate-900">
                {user?.name || "Admin"}
              </p>

              <p className="text-xs text-slate-500">
                {role}
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
            ADMINISTRATION
          </p>

          <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
            Welcome, {user?.name || "Admin"}
          </h2>

          <p className="mt-2 text-slate-500">
            Manage users, courses and Pathfinder content.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-4 text-4xl">
              📚
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Courses
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              View and manage learning courses.
            </p>

            <button
              onClick={() => navigate("/content-manager")}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Manage Courses
            </button>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-4 text-4xl">
              👨‍💻
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Content Manager
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create and manage learning content.
            </p>

            <button
              onClick={() => navigate("/content-manager")}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Open Dashboard
            </button>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-4 text-4xl">
              👥
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Users
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Manage Pathfinder users.
            </p>

            <button
              disabled
              className="mt-6 cursor-not-allowed rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-400"
            >
              Coming Soon
            </button>

          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;