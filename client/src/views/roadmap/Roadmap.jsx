import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Sparkles,
  TrendingUp,
  User,
  X,
} from "lucide-react";

import { getRoadmap, generateRoadmap } from "../../services/roadmapService";

import { useAuth } from "../../context/AuthContext";

const Roadmap = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const name = user?.name || "Learner";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================
  // NAVIGATION
  // =========================

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
      active: true,
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

  const goTo = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  // =========================
  // LOAD ROADMAP
  // =========================

  const loadRoadmap = async (regenerate = false) => {
    try {
      setError("");

      if (regenerate) {
        setGenerating(true);

        const response = await generateRoadmap();

        console.log("GENERATED ROADMAP:", response.data);

        setRoadmap(response.data?.roadmap || null);
      } else {
        setLoading(true);

        try {
          const response = await getRoadmap();

          console.log("ROADMAP:", response.data);

          setRoadmap(response.data?.roadmap || null);
        } catch (err) {
          if (err.response?.status === 404) {
            setGenerating(true);

            const response = await generateRoadmap();

            console.log("GENERATED ROADMAP:", response.data);

            setRoadmap(response.data?.roadmap || null);
          } else {
            throw err;
          }
        }
      }
    } catch (err) {
      console.error("ROADMAP ERROR:", err);

      setError(err.response?.data?.message || "Failed to load roadmap.");
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading || generating) {
    return (
      <div className='min-h-screen bg-[#f5f8fc]'>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navItems={navItems}
          goTo={goTo}
          name={name}
          user={user}
          handleLogout={handleLogout}
        />

        {/* MAIN - NO lg:pl-72 */}
        <div className='min-h-screen'>
          <header className='sticky top-0 z-20 flex h-24 items-center border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8'>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label='Open menu'
              className='rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50 lg:hidden'
            >
              <Menu size={21} />
            </button>

            <div className='ml-4 lg:ml-0'>
              <p className='text-sm font-medium text-slate-400'>
                Learning journey
              </p>

              <h2 className='text-xl font-extrabold text-slate-900'>
                My Roadmap
              </h2>
            </div>
          </header>

          <main className='w-full px-5 py-8 md:px-8 lg:px-10'>
            <div className='mx-auto w-full max-w-[1400px]'>
              <div className='rounded-3xl border border-slate-200 bg-white p-10 shadow-sm'>
                <div className='flex items-center gap-4'>
                  <div className='h-10 w-10 animate-pulse rounded-full bg-indigo-100' />

                  <div>
                    <h1 className='text-2xl font-extrabold text-slate-900'>
                      {generating
                        ? "Creating your roadmap..."
                        : "Loading roadmap..."}
                    </h1>

                    <p className='mt-2 text-slate-500'>
                      {generating
                        ? "AI is creating your personalized learning path."
                        : "Please wait while we load your roadmap."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className='min-h-screen bg-[#f5f8fc]'>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navItems={navItems}
          goTo={goTo}
          name={name}
          user={user}
          handleLogout={handleLogout}
        />

        {/* MAIN - NO lg:pl-72 */}
        <div className='min-h-screen'>
          <header className='flex h-24 items-center border-b border-slate-200 bg-white px-5 md:px-8'>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label='Open menu'
              className='rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50 lg:hidden'
            >
              <Menu size={21} />
            </button>

            <div className='ml-4 lg:ml-0'>
              <p className='text-sm font-medium text-slate-400'>
                Learning journey
              </p>

              <h2 className='text-xl font-extrabold text-slate-900'>
                My Roadmap
              </h2>
            </div>
          </header>

          <main className='w-full px-5 py-8 md:px-8 lg:px-10'>
            <div className='mx-auto w-full max-w-[1400px]'>
              <div className='rounded-3xl border border-red-200 bg-white p-8 shadow-sm'>
                <h1 className='text-2xl font-extrabold text-slate-900'>
                  Unable to load roadmap
                </h1>

                <div className='mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600'>
                  {error}
                </div>

                <button
                  onClick={() => loadRoadmap()}
                  className='mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700'
                >
                  Try Again
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const phases = Array.isArray(roadmap?.phases) ? roadmap.phases : [];

  // =========================
  // NO ROADMAP
  // =========================

  if (!phases.length) {
    return (
      <div className='min-h-screen bg-[#f5f8fc]'>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navItems={navItems}
          goTo={goTo}
          name={name}
          user={user}
          handleLogout={handleLogout}
        />

        {/* MAIN - NO lg:pl-72 */}
        <div className='min-h-screen'>
          <header className='flex h-24 items-center border-b border-slate-200 bg-white px-5 md:px-8'>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label='Open menu'
              className='rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50 lg:hidden'
            >
              <Menu size={21} />
            </button>

            <div className='ml-4 lg:ml-0'>
              <p className='text-sm font-medium text-slate-400'>
                Learning journey
              </p>

              <h2 className='text-xl font-extrabold text-slate-900'>
                My Roadmap
              </h2>
            </div>
          </header>

          <main className='w-full px-5 py-8 md:px-8 lg:px-10'>
            <div className='mx-auto w-full max-w-[1400px]'>
              <div className='rounded-3xl border border-slate-200 bg-white p-8 shadow-sm'>
                <p className='text-sm font-bold uppercase tracking-wider text-indigo-600'>
                  Personalized learning
                </p>

                <h1 className='mt-2 text-3xl font-extrabold text-slate-900'>
                  No roadmap available
                </h1>

                <p className='mt-3 max-w-xl text-slate-500'>
                  Add your career goal, experience level and interests to
                  generate your personalized roadmap.
                </p>

                <button
                  onClick={() => loadRoadmap(true)}
                  className='mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700'
                >
                  Generate Roadmap
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =========================
  // ROADMAP
  // =========================

  return (
    <div className='min-h-screen bg-[#f5f8fc]'>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navItems={navItems}
        goTo={goTo}
        name={name}
        user={user}
        handleLogout={handleLogout}
      />

      {/* MAIN
          IMPORTANT:
          NO lg:pl-72
          NO lg:ml-72
      */}
      <div className='min-h-screen'>
        {/* HEADER */}
        <header className='sticky top-0 z-20 flex h-24 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8'>
          <div className='flex items-center gap-3'>
            {/* MOBILE MENU */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label='Open menu'
              className='rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50 lg:hidden'
            >
              <Menu size={21} />
            </button>

            {/* BACK */}
            <button
              onClick={() => navigate(-1)}
              className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700'
            >
              <ArrowLeft size={17} />

              <span className='hidden sm:inline'>Back</span>
            </button>

            <div>
              <p className='hidden text-sm font-medium text-slate-400 md:block'>
                Learning journey
              </p>

              <h2 className='text-lg font-extrabold text-slate-900 md:text-xl'>
                My Roadmap
              </h2>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            {/* AI MENTOR */}
            <button
              onClick={() => navigate("/chat")}
              className='hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:flex'
            >
              <MessageCircle size={18} />
              AI Mentor
            </button>

            {/* PROFILE */}
            <button
              onClick={() => navigate("/profile")}
              aria-label='Open profile'
              className='flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 transition hover:bg-indigo-200'
            >
              {name.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className='w-full px-5 py-8 md:px-8 lg:px-10'>
          <div className='mx-auto w-full max-w-[1500px]'>
            {/* PAGE HEADER */}
            <section className='mb-8 rounded-3xl bg-slate-900 p-7 text-white shadow-xl md:p-9'>
              <div className='flex flex-col justify-between gap-6 md:flex-row md:items-start'>
                <div className='max-w-3xl'>
                  <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-indigo-200'>
                    <Sparkles size={14} />
                    AI PERSONALIZED LEARNING
                  </div>

                  <h1 className='text-3xl font-extrabold tracking-tight md:text-4xl'>
                    {roadmap?.careerGoal || "My Learning Roadmap"}
                  </h1>

                  <p className='mt-3 text-sm leading-7 text-slate-300 md:text-base'>
                    A personalized path generated according to your skills,
                    interests and career goal.
                  </p>
                </div>

                {/* REGENERATE */}
                <button
                  onClick={() => loadRoadmap(true)}
                  disabled={generating}
                  className='shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {generating ? "Generating..." : "Regenerate Roadmap"}
                </button>
              </div>
            </section>

            {/* PHASES */}
            <div className='space-y-6'>
              {phases.map((phase, index) => {
                const course =
                  phase?.recommendedCourse || phase?.course || null;

                const youtube = phase?.youtube || null;

                let youtubeUrl = youtube?.url || "";

                if (youtube?.playlistId) {
                  youtubeUrl = `https://www.youtube.com/playlist?list=${youtube.playlistId}`;
                }

                const isPlaylist =
                  youtube?.type === "playlist" || Boolean(youtube?.playlistId);

                return (
                  <div
                    key={phase?.phase || index}
                    className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7'
                  >
                    {/* PHASE HEADER */}
                    <div className='flex gap-5'>
                      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white'>
                        {phase?.phase || index + 1}
                      </div>

                      <div className='flex-1'>
                        <p className='text-sm font-bold text-indigo-600'>
                          PHASE {phase?.phase || index + 1}
                        </p>

                        <h2 className='mt-1 text-2xl font-extrabold text-slate-900'>
                          {phase?.title || "Learning Phase"}
                        </h2>

                        {phase?.goal && (
                          <p className='mt-2 leading-6 text-slate-600'>
                            {phase.goal}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* SKILLS */}
                    {Array.isArray(phase?.skills) &&
                      phase.skills.length > 0 && (
                        <div className='mt-6'>
                          <p className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                            Skills
                          </p>

                          <div className='mt-3 flex flex-wrap gap-2'>
                            {phase.skills.map((skill, skillIndex) => (
                              <span
                                key={`${skill}-${skillIndex}`}
                                className='rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700'
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* TOPICS */}
                    {Array.isArray(phase?.topics) &&
                      phase.topics.length > 0 && (
                        <div className='mt-6'>
                          <p className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                            Topics
                          </p>

                          <ul className='mt-3 list-disc space-y-1 pl-5 text-slate-600'>
                            {phase.topics.map((topic, topicIndex) => (
                              <li key={`${topic}-${topicIndex}`}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* PROJECTS */}
                    {Array.isArray(phase?.projects) &&
                      phase.projects.length > 0 && (
                        <div className='mt-6'>
                          <p className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                            Projects
                          </p>

                          <ul className='mt-3 list-disc space-y-1 pl-5 text-slate-600'>
                            {phase.projects.map((project, projectIndex) => (
                              <li key={`${project}-${projectIndex}`}>
                                {project}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* RESOURCES */}
                    <div className='mt-7'>
                      <h3 className='text-sm font-bold uppercase tracking-wider text-slate-400'>
                        Recommended Resources
                      </h3>

                      <div className='mt-4 grid gap-4 md:grid-cols-2'>
                        {/* PATHFINDER COURSE */}
                        {course && (
                          <div className='rounded-2xl border border-indigo-100 bg-indigo-50 p-5'>
                            <p className='text-xs font-bold uppercase tracking-wider text-indigo-600'>
                              Pathfinder Course
                            </p>

                            <h4 className='mt-2 text-lg font-extrabold text-slate-900'>
                              {course.title || "Recommended Course"}
                            </h4>

                            {course.description && (
                              <p className='mt-2 text-sm leading-6 text-slate-600'>
                                {course.description}
                              </p>
                            )}

                            {course.matchScore !== undefined && (
                              <p className='mt-2 text-xs text-slate-400'>
                                Match score: {course.matchScore}
                              </p>
                            )}

                            {course.link && (
                              <a
                                href={course.link}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700'
                              >
                                View Course →
                              </a>
                            )}
                          </div>
                        )}

                        {/* YOUTUBE */}
                        {youtube && (
                          <div className='rounded-2xl border border-red-100 bg-red-50 p-5'>
                            <p className='text-xs font-bold uppercase tracking-wider text-red-600'>
                              {isPlaylist
                                ? "YouTube Playlist"
                                : "YouTube Resource"}
                            </p>

                            <h4 className='mt-2 text-lg font-extrabold text-slate-900'>
                              {youtube.title || "YouTube Learning Resource"}
                            </h4>

                            {(youtube.channel || youtube.channelTitle) && (
                              <p className='mt-2 text-sm text-slate-500'>
                                Channel:{" "}
                                <span className='font-semibold text-slate-700'>
                                  {youtube.channel || youtube.channelTitle}
                                </span>
                              </p>
                            )}

                            {youtube.playlistId && (
                              <p className='mt-2 text-xs text-slate-400'>
                                Playlist found
                              </p>
                            )}

                            {youtube.query && (
                              <p className='mt-2 text-sm text-slate-600'>
                                Topic:{" "}
                                <span className='font-medium'>
                                  {youtube.query}
                                </span>
                              </p>
                            )}

                            {youtubeUrl && (
                              <a
                                href={youtubeUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='mt-4 inline-block rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700'
                              >
                                {isPlaylist
                                  ? "Watch Playlist →"
                                  : "Watch on YouTube →"}
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* NO RESOURCES */}
                      {!course && !youtube && (
                        <p className='mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500'>
                          No learning resources found for this phase.
                        </p>
                      )}
                    </div>

                    {/* MILESTONE */}
                    {phase?.milestone && (
                      <div className='mt-6 rounded-2xl bg-slate-50 p-5'>
                        <p className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                          Milestone
                        </p>

                        <p className='mt-1 font-semibold text-slate-700'>
                          {phase.milestone}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// ======================================================
// SIDEBAR
// ======================================================

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  navItems,
  goTo,
  name,
  user,
  handleLogout,
}) => {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* LOGO */}
        <div className='flex h-24 shrink-0 items-center border-b border-slate-100 px-7'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-black text-white shadow-sm'>
              P
            </div>

            <div>
              <h1 className='text-xl font-extrabold tracking-tight text-slate-900'>
                Pathfinder
              </h1>

              <p className='text-xs font-medium text-slate-400'>
                Your learning navigator
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            aria-label='Close menu'
            className='ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden'
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className='flex-1 overflow-y-auto px-4 py-7'>
          <p className='mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400'>
            Main menu
          </p>

          <div className='space-y-1'>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => goTo(item.path)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    item.active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      item.active ? "text-indigo-600" : "text-slate-500"
                    }
                  />

                  <span>{item.label}</span>

                  {item.active && (
                    <span className='ml-auto h-2 w-2 rounded-full bg-indigo-600' />
                  )}
                </button>
              );
            })}
          </div>

          {/* ACCOUNT */}
          <p className='mb-3 mt-9 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400'>
            Account
          </p>

          <button
            onClick={() => goTo("/profile")}
            className='flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900'
          >
            <User size={20} />
            Profile
          </button>

          <button
            onClick={() => goTo("/settings")}
            className='mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900'
          >
            <Settings size={20} />
            Settings
          </button>
        </nav>

        {/* USER CARD */}
        <div className='shrink-0 border-t border-slate-100 p-4'>
          <div className='rounded-2xl bg-slate-50 p-4'>
            <button
              onClick={() => goTo("/profile")}
              className='mb-3 flex w-full items-center gap-3 text-left'
            >
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700'>
                {name.charAt(0).toUpperCase()}
              </div>

              <div className='min-w-0'>
                <p className='truncate text-sm font-bold text-slate-800'>
                  {name}
                </p>

                <p className='truncate text-xs text-slate-400'>{user?.email}</p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className='flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-red-500 transition hover:border-red-200 hover:bg-red-50'
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

export default Roadmap;
