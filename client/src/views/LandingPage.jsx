import { useState } from "react";
import {
  ArrowRight,
  Bot,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Compass,
  GraduationCap,
  Map,
  Mic,
  Route,
  Target,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Compass,
    title: "Personalized Roadmaps",
    description:
      "Get a step-by-step career roadmap based on your interests, skills, goals, and current level.",
  },
  {
    icon: Bot,
    title: "AI Career Assistant",
    description:
      "Ask questions about careers, skills, learning paths, and opportunities and get AI-powered guidance.",
  },
  {
    icon: BookOpen,
    title: "Personalized Learning",
    description:
      "Discover relevant courses and learning resources that match your career goals and skill gaps.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Track your learning progress, completed skills, and development throughout your career journey.",
  },
  {
    icon: Target,
    title: "Career Recommendations",
    description:
      "Discover career paths that match your interests, strengths, skills, and long-term goals.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Us About Yourself",
    description: "Share your interests, skills, experience, and career goals.",
  },
  {
    number: "02",
    title: "Get Your Personalized Path",
    description:
      "Pathfinder analyzes your profile and creates a career-focused roadmap.",
  },
  {
    number: "03",
    title: "Learn & Improve",
    description:
      "Follow recommended resources, build skills, and track your progress.",
  },
  {
    number: "04",
    title: "Reach Your Goal",
    description:
      "Prepare for interviews and move confidently toward your target career.",
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const handleShowDetails = () => {
    setShowDetails((prev) => !prev);

    setTimeout(() => {
      document
        .getElementById("features")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      {/* =========================
          NAVBAR
      ========================== */}
      <nav className='sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md'>
        <div className='mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8'>
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className='flex items-center gap-3'
          >
            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#5146F5] text-xl font-bold text-white shadow-sm'>
              P
            </div>

            <div className='text-left'>
              <h1 className='text-lg font-bold leading-tight text-[#111827]'>
                Pathfinder
              </h1>

              <p className='text-xs font-medium text-[#8CA0C0]'>
                Your learning navigator
              </p>
            </div>
          </button>

          {/* Navigation */}
          <div className='hidden items-center gap-8 md:flex'>
            <a
              href='#features'
              className='text-sm font-medium text-slate-500 transition hover:text-[#5146F5]'
            >
              Features
            </a>

            <a
              href='#how-it-works'
              className='text-sm font-medium text-slate-500 transition hover:text-[#5146F5]'
            >
              How It Works
            </a>

            <a
              href='#about'
              className='text-sm font-medium text-slate-500 transition hover:text-[#5146F5]'
            >
              About
            </a>
          </div>

          {/* Auth Buttons */}
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate("/login")}
              className='hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-[#5146F5] sm:block'
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className='flex items-center gap-2 rounded-xl bg-[#5146F5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4338CA]'
            >
              Sign Up
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* =========================
          HERO
      ========================== */}
      <section className='overflow-hidden bg-[#F7F9FC]'>
        <div className='mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28'>
          {/* Hero Content */}
          <div>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-4 py-2 text-sm font-semibold text-[#5146F5]'>
              <Bot size={16} />
              AI-Powered Career Guidance
            </div>

            <h2 className='max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight text-[#111827] md:text-6xl'>
              Find your path.
              <span className='block text-[#5146F5]'>Build your future.</span>
            </h2>

            <p className='mt-6 max-w-xl text-lg leading-8 text-[#687A96]'>
              Pathfinder helps you discover the right career, build personalized
              learning roadmaps, develop skills, and prepare for your future
              with AI-powered guidance.
            </p>

            <div className='mt-8 flex flex-wrap items-center gap-4'>
              <button
                onClick={() => navigate("/register")}
                className='flex items-center gap-2 rounded-xl bg-[#5146F5] px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#4338CA]'
              >
                Start Your Journey
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleShowDetails}
                className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-[#334155] shadow-sm transition hover:border-[#5146F5]/30 hover:text-[#5146F5]'
              >
                {showDetails ? "Hide Details" : "Show Details"}

                {showDetails ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>

            {/* Small trust points */}
            <div className='mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#8CA0C0]'>
              <span className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-[#5146F5]' />
                Personalized learning
              </span>

              <span className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-[#5146F5]' />
                AI-powered guidance
              </span>

              <span className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-[#5146F5]' />
                Progress tracking
              </span>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className='relative'>
            <div className='absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[#5146F5]/10 blur-3xl' />

            <div className='relative rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(30,41,59,0.10)]'>
              {/* Preview Header */}
              <div className='mb-5 flex items-center justify-between border-b border-slate-100 pb-5'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#5146F5] text-lg font-bold text-white'>
                    P
                  </div>

                  <div>
                    <p className='text-xs font-medium text-[#8CA0C0]'>
                      Learning dashboard
                    </p>

                    <h3 className='text-base font-bold text-[#111827]'>
                      Your Career Journey
                    </h3>
                  </div>
                </div>

                <div className='rounded-xl bg-[#EEF0FF] px-3 py-2 text-xs font-semibold text-[#5146F5]'>
                  AI Mentor
                </div>
              </div>

              {/* Preview Welcome */}
              <div className='rounded-2xl bg-[#10182D] p-6'>
                <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-200'>
                  <Route size={14} />
                  PERSONALIZED LEARNING
                </div>

                <h3 className='text-2xl font-bold text-white'>
                  Your path starts here.
                </h3>

                <p className='mt-2 text-sm leading-6 text-slate-300'>
                  Build skills and move closer to your career goal.
                </p>

                <button
                  onClick={() => navigate("/register")}
                  className='mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#111827]'
                >
                  Continue learning
                </button>
              </div>

              {/* Preview Stats */}
              <div className='mt-4 grid grid-cols-2 gap-3'>
                <div className='rounded-2xl border border-slate-100 bg-[#F7F9FC] p-4'>
                  <p className='text-xs font-medium text-[#8CA0C0]'>
                    Completed courses
                  </p>

                  <p className='mt-2 text-2xl font-bold text-[#111827]'>12</p>

                  <p className='mt-1 text-xs text-[#8CA0C0]'>
                    Courses finished
                  </p>
                </div>

                <div className='rounded-2xl border border-slate-100 bg-[#F7F9FC] p-4'>
                  <p className='text-xs font-medium text-[#8CA0C0]'>Skills</p>

                  <p className='mt-2 text-2xl font-bold text-[#111827]'>17</p>

                  <p className='mt-1 text-xs text-[#8CA0C0]'>
                    Skills developing
                  </p>
                </div>
              </div>

              {/* Career Direction */}
              <div className='mt-4 rounded-2xl border border-slate-100 p-5'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-wide text-[#5146F5]'>
                      Career direction
                    </p>

                    <h4 className='mt-1 text-lg font-bold text-[#111827]'>
                      Frontend Developer
                    </h4>
                  </div>

                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5146F5]'>
                    <Compass size={20} />
                  </div>
                </div>

                <div className='mt-5 flex items-center justify-between text-sm font-semibold'>
                  <span className='text-[#687A96]'>Profile completion</span>

                  <span className='text-[#111827]'>80%</span>
                </div>

                <div className='mt-2 h-2 overflow-hidden rounded-full bg-[#E8ECF5]'>
                  <div className='h-full w-[80%] rounded-full bg-[#5146F5]' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            SHOW DETAILS
        ========================== */}
        {showDetails && (
          <div className='mx-auto max-w-7xl px-6 pb-20 lg:px-8'>
            <div className='rounded-[28px] border border-[#DDE3EF] bg-white p-8 shadow-sm md:p-10'>
              <div className='mb-8'>
                <p className='text-sm font-bold uppercase tracking-wider text-[#5146F5]'>
                  Pathfinder
                </p>

                <h3 className='mt-2 text-3xl font-bold text-[#111827]'>
                  Everything you need to find your path
                </h3>
              </div>

              <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className='rounded-2xl border border-slate-200 bg-[#F9FAFC] p-6 transition hover:-translate-y-1 hover:border-[#5146F5]/30 hover:shadow-md'
                    >
                      <div className='mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5146F5]'>
                        <Icon size={21} />
                      </div>

                      <h4 className='text-lg font-bold text-[#111827]'>
                        {feature.title}
                      </h4>

                      <p className='mt-2 text-sm leading-6 text-[#687A96]'>
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================
          FEATURES
      ========================== */}
      <section id='features' className='bg-white py-24'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <p className='text-sm font-bold uppercase tracking-wider text-[#5146F5]'>
              What Pathfinder Offers
            </p>

            <h2 className='mt-3 text-4xl font-extrabold tracking-tight text-[#111827]'>
              Everything in one place
            </h2>

            <p className='mt-4 leading-7 text-[#687A96]'>
              From discovering your career direction to preparing for
              interviews, Pathfinder keeps your entire learning journey
              connected.
            </p>
          </div>

          <div className='mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className='group rounded-2xl border border-[#E1E6EF] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#5146F5]/30 hover:shadow-lg'
                >
                  <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5146F5] transition group-hover:bg-[#5146F5] group-hover:text-white'>
                    <Icon size={23} />
                  </div>

                  <h3 className='text-xl font-bold text-[#111827]'>
                    {feature.title}
                  </h3>

                  <p className='mt-3 text-sm leading-7 text-[#687A96]'>
                    {feature.description}
                  </p>

                  <button
                    onClick={() => navigate("/register")}
                    className='mt-5 flex items-center gap-2 text-sm font-semibold text-[#5146F5]'
                  >
                    Explore
                    <ArrowRight
                      size={15}
                      className='transition group-hover:translate-x-1'
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section
        id='how-it-works'
        className='border-y border-slate-100 bg-[#F7F9FC] py-24'
      >
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <p className='text-sm font-bold uppercase tracking-wider text-[#5146F5]'>
              Simple Process
            </p>

            <h2 className='mt-3 text-4xl font-extrabold text-[#111827]'>
              How Pathfinder works
            </h2>

            <p className='mt-4 text-[#687A96]'>
              A simple journey from discovering your direction to reaching your
              career goal.
            </p>
          </div>

          <div className='mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4'>
            {steps.map((step) => (
              <div
                key={step.number}
                className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
              >
                <span className='text-4xl font-extrabold text-[#5146F5]/20'>
                  {step.number}
                </span>

                <h3 className='mt-5 text-lg font-bold text-[#111827]'>
                  {step.title}
                </h3>

                <p className='mt-3 text-sm leading-6 text-[#687A96]'>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          WHY PATHFINDER
      ========================== */}
      <section id='about' className='bg-white py-24'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='grid items-center gap-14 lg:grid-cols-2'>
            <div>
              <p className='text-sm font-bold uppercase tracking-wider text-[#5146F5]'>
                Why Pathfinder?
              </p>

              <h2 className='mt-3 text-4xl font-extrabold leading-tight text-[#111827]'>
                Stop guessing.
                <span className='block text-[#5146F5]'>Start building.</span>
              </h2>

              <p className='mt-6 max-w-xl text-lg leading-8 text-[#687A96]'>
                Career planning can feel overwhelming when there are thousands
                of courses, technologies, and career options. Pathfinder turns
                that complexity into a personalized journey.
              </p>

              <button
                onClick={() => navigate("/register")}
                className='mt-8 flex items-center gap-2 rounded-xl bg-[#5146F5] px-6 py-3.5 font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-[#4338CA]'
              >
                Build My Path
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Benefits Card */}
            <div className='rounded-[28px] border border-slate-200 bg-[#F7F9FC] p-7'>
              <div className='grid gap-4'>
                <div className='flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5146F5]'>
                    <Map size={21} />
                  </div>

                  <div>
                    <h3 className='font-bold text-[#111827]'>
                      Clear Career Direction
                    </h3>

                    <p className='mt-1 text-sm leading-6 text-[#687A96]'>
                      Understand which career paths fit your interests and
                      strengths.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5146F5]'>
                    <GraduationCap size={21} />
                  </div>

                  <div>
                    <h3 className='font-bold text-[#111827]'>
                      Personalized Learning
                    </h3>

                    <p className='mt-1 text-sm leading-6 text-[#687A96]'>
                      Learn the skills that actually matter for your target
                      career.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5146F5]'>
                    <TrendingUp size={21} />
                  </div>

                  <div>
                    <h3 className='font-bold text-[#111827]'>
                      Track Your Progress
                    </h3>

                    <p className='mt-1 text-sm leading-6 text-[#687A96]'>
                      See your progress and keep moving toward your career
                      goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}
      <section className='bg-[#F7F9FC] px-6 py-24'>
        <div className='mx-auto max-w-5xl'>
          <div className='overflow-hidden rounded-[30px] bg-[#10182D] p-10 text-center shadow-xl md:p-16'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5146F5] text-white'>
              <Route size={27} />
            </div>

            <h2 className='mt-6 text-4xl font-extrabold text-white md:text-5xl'>
              Your career path starts here.
            </h2>

            <p className='mx-auto mt-4 max-w-xl leading-7 text-slate-300'>
              Discover your direction, build your skills, and move toward the
              career you want with Pathfinder.
            </p>

            <div className='mt-8 flex flex-wrap justify-center gap-3'>
              <button
                onClick={() => navigate("/register")}
                className='flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[#111827] transition hover:bg-slate-100'
              >
                Sign Up Free
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/login")}
                className='rounded-xl border border-white/20 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10'
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className='border-t border-slate-200 bg-white py-8'>
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row lg:px-8'>
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-[#5146F5] font-bold text-white'>
              P
            </div>

            <div>
              <p className='font-bold text-[#111827]'>Pathfinder</p>
              <p className='text-xs text-[#8CA0C0]'>Your learning navigator</p>
            </div>
          </div>

          <p className='text-sm text-[#8CA0C0]'>
            © {new Date().getFullYear()} Pathfinder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
