import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../services/courseService";

const Courses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourses();

      console.log("COURSES RESPONSE:", response.data);

      // Backend returns { success: true, courses: [] }
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("COURSES ERROR:", err);
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#111827]">

      {/* HEADER */}
      <header className="h-[105px] bg-white border-b border-[#e5e7eb] flex items-center justify-between px-8 md:px-12">

        <div>
          <p className="text-sm font-semibold tracking-wide text-[#7c8499] uppercase">
            Learning
          </p>

          <h1 className="text-3xl font-bold mt-1">
            Explore Courses
          </h1>
        </div>

        {/* Dashboard button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#dce1eb] bg-white text-[#475569] font-semibold hover:bg-[#f8f9ff] transition"
        >
          <span className="text-xl">←</span>
          Dashboard
        </button>
      </header>

      {/* MAIN */}
      <main className="px-8 md:px-12 py-10 max-w-[1400px] mx-auto">

        {/* INTRO */}
        <section className="mb-10">
          <h2 className="text-4xl font-bold mb-3">
            Find your next skill
          </h2>

          <p className="text-lg text-[#64748b]">
            Explore courses that match your learning goals and career direction.
          </p>
        </section>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-4 mb-8">
            {error}
          </div>
        )}

        {/* COURSE HEADER */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-sm font-semibold tracking-wide text-[#94a3b8] uppercase">
              Available Courses
            </p>

            <h3 className="text-2xl font-bold mt-1">
              {courses.length} courses
            </h3>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-[#64748b]">
            Loading courses...
          </div>
        )}

        {/* COURSES GRID */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-[#e1e5ed] rounded-2xl p-7 shadow-sm hover:shadow-md transition"
              >

                {/* TOP */}
                <div className="flex items-start justify-between mb-7">

                  {/* Book icon */}
                  <div className="w-14 h-14 rounded-xl bg-[#eef0ff] flex items-center justify-center text-2xl">
                    📚
                  </div>

                  {/* LEVEL */}
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold
                      ${
                        course.level?.toLowerCase() === "beginner"
                          ? "bg-green-100 text-green-600"
                          : course.level?.toLowerCase() === "advanced"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }
                    `}
                  >
                    {course.level}
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-bold mb-4">
                  {course.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-[#64748b] leading-7 min-h-[80px]">
                  {course.description}
                </p>

                {/* COURSE INFO */}
                <div className="flex items-center gap-8 mt-6 text-[#64748b]">

                  <div className="flex items-center gap-2">
                    <span>◷</span>
                    <span>{course.duration}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <span>
                      {course.topics?.length || 0} topics
                    </span>
                  </div>

                </div>

                {/* SKILLS */}
                {course.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {course.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-[#f0f1ff] text-[#4f46e5] rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* START BUTTON */}
                <button
                  onClick={() => {
                    // Add course detail route later
                    console.log("Selected course:", course);
                  }}
                  className="w-full mt-8 py-4 rounded-xl bg-[#5141f5] text-white font-semibold text-lg hover:bg-[#4334dc] transition"
                >
                  Start Learning →
                </button>

              </div>
            ))}

          </div>
        )}

        {/* NO COURSES */}
        {!loading && !error && courses.length === 0 && (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <p className="text-lg text-[#64748b]">
              No courses available yet.
            </p>
          </div>
        )}

      </main>
    </div>
  );
};

export default Courses;