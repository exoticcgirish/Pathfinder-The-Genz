import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  MessageCircle,
  Settings,
  Target,
  TrendingUp,
  User,
  X,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { updateMyProfile } from "../../services/userService";

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    careerGoal: "",
    experienceLevel: "",
    learningPreference: "",
    interests: [],
    weeklyHours: 0,
  });

  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD SAVED PROFILE
  // =========================

  useEffect(() => {
    const profile = user?.profile || {};

    setForm({
      careerGoal: profile.careerGoal || "",
      experienceLevel: profile.experienceLevel || "",
      learningPreference: profile.learningPreference || "",
      interests: Array.isArray(profile.interests)
        ? profile.interests
        : [],
        weeklyHours: profile.weeklyHours || 0,
    });
  }, [user]);

  const name = user?.name || "Learner";

  // =========================
  // NAVIGATION
  // =========================

  const goTo = (path) => {
    setSidebarOpen(false);
    window.location.href = path;
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
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

  // =========================
  // FORM
  // =========================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addInterest = () => {
    const value = interest.trim();

    if (!value) return;

    const exists = form.interests.some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );

    if (!exists) {
      setForm((prev) => ({
        ...prev,
        interests: [...prev.interests, value],
      }));
    }

    setInterest("");
  };

  const removeInterest = (item) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.filter(
        (interestItem) => interestItem !== item
      ),
    }));
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.careerGoal.trim()) {
      setError("Please enter your career goal.");
      return;
    }

    if (!form.experienceLevel) {
      setError("Please select your experience level.");
      return;
    }

    if (!form.learningPreference) {
      setError("Please select your learning preference.");
      return;
    }

    if (!Array.isArray(form.interests) || form.interests.length === 0) {
      setError("Please add at least one learning interest.");
      return;
    }

    if (!form.weeklyHours || Number(form.weeklyHours) < 1) {
      setError("Please select your weekly learning time.");
      return;
    }

    setLoading(true);

    try {
      const response = await updateMyProfile({
        ...form,
        weeklyHours: Number(form.weeklyHours),
      });

      console.log("PROFILE UPDATED:", response?.data);

      setMessage("Profile updated successfully.");

      const updatedProfile =
        response?.data?.profile ||
        response?.data?.user?.profile;

      if (updatedProfile) {
        setForm({
          careerGoal: updatedProfile.careerGoal || "",
          experienceLevel: updatedProfile.experienceLevel || "",
          learningPreference: updatedProfile.learningPreference || "",
          interests: Array.isArray(updatedProfile.interests)
            ? updatedProfile.interests
            : [],
          weeklyHours: updatedProfile.weeklyHours || 0,
        });
      }

      await refreshUser();
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = (() => {
    let completed = 0;
    const total = 5;

    if (form.careerGoal.trim()) completed++;
    if (form.experienceLevel) completed++;
    if (form.learningPreference) completed++;
    if (Array.isArray(form.interests) && form.interests.length > 0) completed++;
    if (Number(form.weeklyHours) > 0) completed++;

    return Math.round((completed / total) * 100);
  })();

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-800">

      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

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

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-black text-white">
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
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-2 text-slate-400 lg:hidden"
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
                  onClick={() => goTo(item.path)}
                  className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Icon size={20} />

                  <span>{item.label}</span>

                  <ChevronRight
                    size={16}
                    className="ml-auto opacity-0 transition group-hover:opacity-100"
                  />
                </button>
              );
            })}

          </div>

          <p className="mb-3 mt-9 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Account
          </p>

          {/* PROFILE ACTIVE */}

          <button
            onClick={() => goTo("/profile")}
            className="flex w-full items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700"
          >
            <User size={20} />

            <span>Profile</span>

            <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
          </button>

          <button
            onClick={() => goTo("/settings")}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Settings size={20} />

            Settings
          </button>

        </nav>

        {/* SIDEBAR USER */}

        <div className="shrink-0 border-t border-slate-100 p-4">

          <div className="rounded-2xl bg-slate-50 p-4">

            <div className="mb-3 flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
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

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="min-h-screen lg:pl-72">

        {/* HEADER */}

        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <button
              onClick={() => goTo("/dashboard")}
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 sm:flex"
            >
              <ArrowLeft size={18} />
              Dashboard
            </button>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => goTo("/chat")}
              className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:flex"
            >
              <MessageCircle size={18} />
              AI Mentor
            </button>

            <button
              onClick={() => goTo("/profile")}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700"
            >
              {name.charAt(0).toUpperCase()}
            </button>

          </div>

        </header>

        {/* =========================
            PAGE
        ========================= */}

        <main className="mx-auto max-w-5xl px-5 py-8 md:px-8 lg:px-10">

          {/* PAGE HEADER */}

          <div className="mb-8">

            <button
              onClick={() => goTo("/dashboard")}
              className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 sm:hidden"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <User size={27} />
              </div>

              <div>

                <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                  Your profile
                </p>

                <h1 className="mt-1 text-3xl font-extrabold text-slate-900 md:text-4xl">
                  {name}'s Learning Profile
                </h1>

                <p className="mt-2 text-slate-500">
                  Manage your goals, experience, interests and
                  learning preferences.
                </p>

              </div>

            </div>

          </div>

          {/* =========================
              PROFILE CARD
          ========================= */}

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >

            {/* SUCCESS */}

            {message && (
              <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {message}
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {/* ACCOUNT INFO */}

            <div className="mb-8 rounded-2xl bg-slate-50 p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                  {name.charAt(0).toUpperCase()}
                </div>

                <div>

                  <p className="font-bold text-slate-900">
                    {name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {user?.email}
                  </p>

                </div>

              </div>

            </div>

            {/* PROFILE COMPLETENESS */}

            <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">
                    Learning profile completeness
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Complete your profile for better AI recommendations.
                  </p>
                </div>

                <span className="text-lg font-extrabold text-indigo-600">
                  {profileCompletion}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-indigo-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            {/* FORM */}

            <div className="grid gap-6 md:grid-cols-2">

              {/* CAREER */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Career goal
                </label>

                <input
                  type="text"
                  name="careerGoal"
                  value={form.careerGoal}
                  onChange={handleChange}
                  placeholder="e.g. Machine Learning Engineer"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

              {/* EXPERIENCE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Experience level
                </label>

                <select
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >

                  <option value="">
                    Select level
                  </option>

                  <option value="beginner">
                    Beginner
                  </option>

                  <option value="intermediate">
                    Intermediate
                  </option>

                  <option value="advanced">
                    Advanced
                  </option>

                </select>

              </div>

              {/* LEARNING PREFERENCE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Learning preference
                </label>

                <select
                  name="learningPreference"
                  value={form.learningPreference}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >

                  <option value="">
                    Select preference
                  </option>

                  <option value="project-based">
                    Project based
                  </option>

                  <option value="video">
                    Video
                  </option>

                  <option value="reading">
                    Reading
                  </option>

                  <option value="practice">
                    Practice
                  </option>

                </select>

              </div>

              {/* WEEKLY LEARNING TIME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Weekly learning time
                </label>

                <select
                  name="weeklyHours"
                  value={form.weeklyHours}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="0">Select weekly time</option>
                  <option value="3">2–4 hours / week</option>
                  <option value="6">5–8 hours / week</option>
                  <option value="10">8–12 hours / week</option>
                  <option value="15">12+ hours / week</option>
                </select>
              </div>

              {/* INTERESTS */}

              <div className="md:col-span-2">

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Sparkles size={16} className="text-indigo-500" />
                  Learning interests
                </label>

                <div className="flex gap-3">

                  <input
                    type="text"
                    value={interest}
                    onChange={(e) =>
                      setInterest(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                    placeholder="e.g. Python, Java, AI"
                    className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={addInterest}
                    className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                  >
                    Add
                  </button>

                </div>

                {/* INTEREST TAGS */}

                {form.interests.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">

                    {form.interests.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => removeInterest(item)}
                        className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-red-50 hover:text-red-600"
                        title="Click to remove"
                      >
                        {item} ×
                      </button>
                    ))}

                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">
                    No interests added yet.
                  </p>
                )}

              </div>

            </div>

            {/* =========================
                ACTIONS
            ========================= */}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save profile"}
                {!loading && <ChevronRight size={17} />}
              </button>

            </div>

          </form>

          {/* PROFILE HELP */}

          <div className="mt-6 flex items-start gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
              <Target size={20} />
            </div>

            <div>

              <p className="font-bold text-slate-800">
                Why keep your profile updated?
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Pathfinder uses your career goal, experience,
                interests, learning preference and weekly schedule to
                personalize your courses and learning roadmap.
              </p>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
};

export default Profile;