import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courseService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses();

        console.log("COURSES RESPONSE:", response.data);

        setCourses(response.data.courses || []);
      } catch (err) {
        console.error("COURSES ERROR:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#111827]">
      {/* Header */}
      <header className="h-[100px] bg-white border-b border-[#e5e7eb] flex items-center justify-between px-8">
        <div>
          <p className="text-sm font-semibold text-[#6b7280]">
            LEARNING
          </p>

          <h1 className="text-2xl font-bold mt-1">
            Explore Courses
          </h1>
        </div>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#e0e4ef] bg-white text-[#475569] font-medium hover:bg-[#f5f6ff] transition"
        >
          <span>←</span>
          Dashboard
        </Link>
      </header>

      {/* Main */}
      <main className="px-8 py-8 max-w-[1400px] mx-auto">

        {/* Intro */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Find your next skill
          </h2>

          <p className="text-[#64748b] mt-2">
            Explore courses that match your learning goals and career direction.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-10 text-center">
            <p className="text-[#64748b]">
              Loading courses...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-5">
            {error}
          </div>
        )}

        {/* Courses */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-[#94a3b8]">
                  AVAILABLE COURSES
                </p>

                <h3 className="text-xl font-bold mt-1">
                  {courses.length} courses
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl border border-[#e5e7eb] p-6 hover:shadow-lg transition duration-200 flex flex-col"
                >
                  {/* Course icon */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#eef0ff] flex items-center justify-center text-[#5141ff] text-xl">
                      📚
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.level === "advanced"
                          ? "bg-purple-100 text-purple-600"
                          : course.level === "intermediate"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#64748b] text-sm leading-6 mb-5">
                    {course.description}
                  </p>

                  {/* Course information */}
                  <div className="flex items-center gap-5 text-sm text-[#64748b] mb-5">
                    <div className="flex items-center gap-2">
                      <span>⏱</span>
                      <span>{course.duration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span>
                        {course.topics?.length || 0} topics
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  {course.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {course.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-lg bg-[#f1f3ff] text-[#5141ff] text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Button */}
                  <div className="mt-auto pt-4">
                    <button
                      className="w-full bg-[#5141ff] hover:bg-[#4535e8] text-white py-3 rounded-xl font-semibold transition"
                    >
                      Start Learning →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Courses;