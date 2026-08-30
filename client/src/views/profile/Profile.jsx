import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Bot,
  ChevronRight,
  Sparkles,
  Target,
  User,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  updateMyProfile,
} from "../../services/userService";

import {
  generateRoadmap,
} from "../../services/roadmapService";


const SUPPORTED_CAREER_GOALS = [
  "Java Backend Developer",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
];


const Profile = () => {
  const navigate = useNavigate();

  const {
    user,
    refreshUser,
  } = useAuth();


  // =========================================
  // FORM STATE
  // =========================================

  const [
    form,
    setForm,
  ] = useState({
    careerGoal: "",
    experienceLevel: "",
    learningPreference: "",
    interests: [],
    weeklyHours: 0,
  });


  const [
    originalProfile,
    setOriginalProfile,
  ] = useState(null);


  const [
    interest,
    setInterest,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    warning,
    setWarning,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  // =========================================
  // USER INFO
  // =========================================

  const name =
    user?.name ||
    user?.fullName ||
    "Learner";


  // =========================================
  // LOAD SAVED PROFILE
  // =========================================

  useEffect(() => {
    const profile =
      user?.profile || {};


    const normalizedProfile = {

      careerGoal:
        profile.careerGoal ||
        "",

      experienceLevel:
        profile.experienceLevel ||
        "",

      learningPreference:
        profile.learningPreference ||
        "",

      interests:
        Array.isArray(
          profile.interests
        )
          ? profile.interests
          : [],

      weeklyHours:
        Number(
          profile.weeklyHours ||
          0
        ),
    };


    setForm(
      normalizedProfile
    );

    setOriginalProfile(
      normalizedProfile
    );

  }, [user]);


  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setForm(
      (
        previous
      ) => ({
        ...previous,

        [name]:
          name ===
          "weeklyHours"
            ? Number(
                value
              )
            : value,
      })
    );
  };


  // =========================================
  // ADD INTEREST
  // =========================================

  const addInterest = () => {

    const value =
      interest.trim();


    if (!value) {
      return;
    }


    const exists =
      form.interests.some(
        (item) =>
          String(item)
            .trim()
            .toLowerCase() ===
          value.toLowerCase()
      );


    if (!exists) {

      setForm(
        (
          previous
        ) => ({
          ...previous,

          interests: [
            ...previous.interests,
            value,
          ],
        })
      );
    }


    setInterest("");
  };


  // =========================================
  // REMOVE INTEREST
  // =========================================

  const removeInterest = (
    item
  ) => {

    setForm(
      (
        previous
      ) => ({
        ...previous,

        interests:
          previous.interests.filter(
            (
              interestItem
            ) =>
              interestItem !==
              item
          ),
      })
    );
  };


  // =========================================
  // CHECK PROFILE CHANGES
  // =========================================

  const personalizationChanged =
    useMemo(() => {

      if (!originalProfile) {
        return false;
      }


      const oldInterests =
        [
          ...(
            originalProfile
              .interests ||
            []
          ),
        ]
          .map(
            (item) =>
              String(item)
                .trim()
                .toLowerCase()
          )
          .sort();


      const newInterests =
        [
          ...(
            form.interests ||
            []
          ),
        ]
          .map(
            (item) =>
              String(item)
                .trim()
                .toLowerCase()
          )
          .sort();


      return (

        originalProfile
          .careerGoal !==
          form.careerGoal ||

        originalProfile
          .experienceLevel !==
          form.experienceLevel ||

        originalProfile
          .learningPreference !==
          form.learningPreference ||

        Number(
          originalProfile
            .weeklyHours
        ) !==
          Number(
            form.weeklyHours
          ) ||

        JSON.stringify(
          oldInterests
        ) !==
          JSON.stringify(
            newInterests
          )

      );

    }, [
      form,
      originalProfile,
    ]);


  // =========================================
  // PROFILE COMPLETION
  // =========================================

  const profileCompletion =
    useMemo(() => {

      const fields = [

        form.careerGoal,

        form.experienceLevel,

        form.learningPreference,

        Array.isArray(
          form.interests
        ) &&
          form.interests.length >
            0,

        Number(
          form.weeklyHours
        ) > 0,

      ];


      const completed =
        fields.filter(
          Boolean
        ).length;


      return Math.round(
        (
          completed /
          fields.length
        ) * 100
      );

    }, [form]);


  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    setMessage("");
    setWarning("");
    setError("");


    // =====================================
    // VALIDATION
    // =====================================

    if (!form.careerGoal) {

      setError(
        "Please select your career goal."
      );

      return;
    }


    if (
      !SUPPORTED_CAREER_GOALS.includes(
        form.careerGoal
      )
    ) {

      setError(
        "Please select a supported career goal."
      );

      return;
    }


    if (
      !form.experienceLevel
    ) {

      setError(
        "Please select your experience level."
      );

      return;
    }


    if (
      !form.learningPreference
    ) {

      setError(
        "Please select your learning preference."
      );

      return;
    }


    if (
      !Array.isArray(
        form.interests
      ) ||
      form.interests.length ===
        0
    ) {

      setError(
        "Please add at least one learning interest."
      );

      return;
    }


    if (
      !form.weeklyHours ||
      Number(
        form.weeklyHours
      ) < 1
    ) {

      setError(
        "Please select your weekly learning time."
      );

      return;
    }


    // =====================================
    // SAVE
    // =====================================

    setLoading(true);


    try {

      const shouldRegenerate =
        personalizationChanged;


      const response =
        await updateMyProfile({

          ...form,

          weeklyHours:
            Number(
              form.weeklyHours
            ),

        });


      console.log(
        "PROFILE UPDATED:",
        response?.data
      );


      const updatedProfile =

        response?.data
          ?.profile ||

        response?.data
          ?.user
          ?.profile ||

        form;


      const normalizedProfile = {

        careerGoal:
          updatedProfile
            .careerGoal ||
          form.careerGoal,

        experienceLevel:
          updatedProfile
            .experienceLevel ||
          form.experienceLevel,

        learningPreference:
          updatedProfile
            .learningPreference ||
          form.learningPreference,

        interests:
          Array.isArray(
            updatedProfile
              .interests
          )
            ? updatedProfile
                .interests
            : form.interests,

        weeklyHours:
          Number(
            updatedProfile
              .weeklyHours ||
            form.weeklyHours
          ),
      };


      setForm(
        normalizedProfile
      );


      setOriginalProfile(
        normalizedProfile
      );


      // =====================================
      // REFRESH AUTH USER
      // =====================================

      await refreshUser();


      // =====================================
      // REGENERATE ROADMAP
      // =====================================

      if (
        shouldRegenerate
      ) {

        try {

          const roadmapResponse =
            await generateRoadmap();


          console.log(
            "ROADMAP REGENERATED:",
            roadmapResponse?.data
          );


          setMessage(
            "Profile updated and your personalized roadmap was regenerated successfully."
          );

        } catch (
          roadmapError
        ) {

          console.error(
            "ROADMAP REGENERATION ERROR:",
            roadmapError
          );


          setMessage(
            "Profile updated successfully."
          );


          setWarning(
            roadmapError
              ?.response
              ?.data
              ?.message ||

              "Your profile was saved, but Pathfinder could not regenerate the roadmap. Please try again from the Roadmap page."
          );
        }

      } else {

        setMessage(
          "Profile updated successfully."
        );
      }

    } catch (err) {

      console.error(
        "PROFILE UPDATE ERROR:",
        err
      );


      setError(
        err
          ?.response
          ?.data
          ?.message ||

        "Failed to update profile."
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="min-h-screen bg-[#f5f8fc] text-slate-800">


      {/* =====================================
          HEADER
      ====================================== */}

      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 pl-20 backdrop-blur md:px-8 lg:pl-8">


        <button
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
          className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 sm:flex"
        >

          <ArrowLeft
            size={18}
          />

          Dashboard

        </button>


        <div className="ml-auto flex items-center gap-3">


          <button
            onClick={() =>
              navigate(
                "/chat"
              )
            }
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:flex"
          >

            <Bot
              size={18}
            />

            AI Mentor

          </button>


          <button
            onClick={() =>
              navigate(
                "/profile"
              )
            }
            title="Profile"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700"
          >

            {name
              .charAt(0)
              .toUpperCase()}

          </button>


        </div>

      </header>


      {/* =====================================
          CONTENT
      ====================================== */}

      <main className="mx-auto max-w-5xl px-5 py-8 md:px-8 lg:px-10">


        {/* PAGE TITLE */}

        <div className="mb-8 flex items-start gap-4">


          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">

            <User
              size={27}
            />

          </div>


          <div>

            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
              Your profile
            </p>


            <h1 className="mt-1 text-3xl font-extrabold text-slate-900 md:text-4xl">

              {name}'s Learning Profile

            </h1>


            <p className="mt-2 text-slate-500">

              Manage your career goal,
              experience, interests and
              learning preferences.

            </p>

          </div>

        </div>


        {/* =====================================
            PROFILE FORM
        ====================================== */}

        <form
          onSubmit={
            handleSubmit
          }
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >


          {/* SUCCESS */}

          {message && (

            <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">

              {message}

            </div>

          )}


          {/* WARNING */}

          {warning && (

            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">

              {warning}

            </div>

          )}


          {/* ERROR */}

          {error && (

            <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">

              {error}

            </div>

          )}


          {/* =====================================
              ACCOUNT INFO
          ====================================== */}

          <div className="mb-8 rounded-2xl bg-slate-50 p-5">


            <div className="flex items-center gap-4">


              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">

                {name
                  .charAt(0)
                  .toUpperCase()}

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


          {/* =====================================
              COMPLETENESS
          ====================================== */}

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
                style={{
                  width:
                    `${profileCompletion}%`,
                }}
              />


            </div>

          </div>


          {/* =====================================
              FIELDS
          ====================================== */}

          <div className="grid gap-6 md:grid-cols-2">


            {/* CAREER GOAL */}

            <div className="md:col-span-2">


              <label className="mb-2 block text-sm font-semibold text-slate-700">

                Career goal

              </label>


              <select
                name="careerGoal"
                value={
                  form.careerGoal
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >


                <option value="">

                  Select career goal

                </option>


                {SUPPORTED_CAREER_GOALS.map(
                  (
                    career
                  ) => (

                    <option
                      key={
                        career
                      }
                      value={
                        career
                      }
                    >

                      {career}

                    </option>

                  )
                )}


              </select>


              <p className="mt-2 text-xs text-slate-400">

                Pathfinder supports these career paths.
                Changing your personalization will regenerate
                your roadmap after saving.

              </p>


            </div>


            {/* EXPERIENCE */}

            <div>


              <label className="mb-2 block text-sm font-semibold text-slate-700">

                Experience level

              </label>


              <select
                name="experienceLevel"
                value={
                  form.experienceLevel
                }
                onChange={
                  handleChange
                }
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
                value={
                  form.learningPreference
                }
                onChange={
                  handleChange
                }
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


            {/* WEEKLY TIME */}

            <div>


              <label className="mb-2 block text-sm font-semibold text-slate-700">

                Weekly learning time

              </label>


              <select
                name="weeklyHours"
                value={
                  form.weeklyHours
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >


                <option value={0}>
                  Select weekly time
                </option>

                <option value={3}>
                  2–4 hours / week
                </option>

                <option value={6}>
                  5–8 hours / week
                </option>

                <option value={10}>
                  8–12 hours / week
                </option>

                <option value={15}>
                  12+ hours / week
                </option>


              </select>


            </div>


            {/* INTERESTS */}

            <div className="md:col-span-2">


              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">


                <Sparkles
                  size={16}
                  className="text-indigo-500"
                />


                Learning interests


              </label>


              <div className="flex gap-3">


                <input
                  type="text"
                  value={
                    interest
                  }
                  onChange={(
                    event
                  ) =>
                    setInterest(
                      event
                        .target
                        .value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {

                    if (
                      event.key ===
                      "Enter"
                    ) {

                      event.preventDefault();

                      addInterest();
                    }
                  }}
                  placeholder="e.g. Java, Spring Boot, Cloud"
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />


                <button
                  type="button"
                  onClick={
                    addInterest
                  }
                  className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                >

                  Add

                </button>


              </div>


              {form.interests.length >
              0 ? (


                <div className="mt-4 flex flex-wrap gap-2">


                  {form.interests.map(
                    (
                      item
                    ) => (


                      <button
                        key={
                          item
                        }
                        type="button"
                        onClick={() =>
                          removeInterest(
                            item
                          )
                        }
                        className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-red-50 hover:text-red-600"
                        title="Click to remove"
                      >

                        {item} ×

                      </button>


                    )
                  )}


                </div>


              ) : (


                <p className="mt-3 text-sm text-slate-400">

                  No interests added yet.

                </p>


              )}


            </div>


          </div>


          {/* =====================================
              SAVE
          ====================================== */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">


            <p className="text-xs text-slate-400">

              {personalizationChanged
                ? "Your personalized roadmap will be regenerated after saving."
                : "Your profile is up to date."}

            </p>


            <button
              type="submit"
              disabled={
                loading
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >


              {loading
                ? "Saving & personalizing..."
                : "Save profile"}


              {!loading && (

                <ChevronRight
                  size={17}
                />

              )}


            </button>


          </div>


        </form>


        {/* =====================================
            HELP
        ====================================== */}

        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">


          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">

            <Target
              size={20}
            />

          </div>


          <div>


            <p className="font-bold text-slate-800">

              Why keep your profile updated?

            </p>


            <p className="mt-1 text-sm leading-6 text-slate-600">

              Pathfinder uses your career goal,
              experience, interests, learning
              preference and weekly schedule to
              recalculate skill gaps,
              recommendations and your personalized
              roadmap.

            </p>


          </div>


        </div>


      </main>


    </div>
  );
};


export default Profile;