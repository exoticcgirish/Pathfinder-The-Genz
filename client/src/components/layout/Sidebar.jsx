import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bot,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Settings,
  TrendingUp,
  User,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const name =
    user?.name ||
    user?.fullName ||
    "Learner";

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

  const accountItems = [
    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `
      group flex w-full items-center gap-3
      rounded-xl px-4 py-3
      text-left text-sm font-semibold
      transition
      ${
        isActive
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }
    `;

  const renderNavItem = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={() => setSidebarOpen(false)}
        className={linkClass}
      >
        {({ isActive }) => (
          <>
            <Icon size={20} />
            <span>{item.label}</span>

            {isActive && (
              <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          flex w-72 flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-24 shrink-0 items-center border-b border-slate-100 px-7">
          <button
            onClick={() => goTo("/dashboard")}
            className="flex items-center gap-3 text-left"
          >
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
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-2 text-slate-400 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Main menu
          </p>

          <div className="space-y-1">
            {navItems.map(renderNavItem)}
          </div>

          <p className="mb-3 mt-9 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Account
          </p>

          <div className="space-y-1">
            {accountItems.map(renderNavItem)}
          </div>
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <button
              className="mb-3 flex w-full items-center gap-3 text-left"
              onClick={() => goTo("/profile")}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                {name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  {name}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {user?.email || ""}
                </p>
              </div>
            </button>

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
    </>
  );
};

export default Sidebar;
