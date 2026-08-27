import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById } from "../../services/courseService";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await getCourseById(id);

        setCourse(response.data?.course || null);
      } catch (error) {
        console.error("GET COURSE ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading course...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-red-600">
            {error || "Course not found"}
          </h2>

          <button
            onClick={() => navigate("/courses")}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">

          <button
            onClick={() => navigate("/courses")}
            className="text-sm font-semibold text-indigo-600"
          >
            ← Back to Courses
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

            <div>
              <h1 className="text-4xl font-extrabold text-slate-900">
                {course.title}
              </h1>

              <p className="mt-3 text-slate-500">
                {course.description}
              </p>
            </div>

            <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600">
              {course.level}
            </span>

          </div>

          {course.duration && (
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase text-slate-400">
                Duration
              </h3>

              <p className="mt-2 text-slate-700">
                {course.duration}
              </p>
            </div>
          )}

          {course.skills?.length > 0 && (
            <div className="mt-8">

              <h3 className="text-sm font-bold uppercase text-slate-400">
                Skills
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">

                {course.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700"
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </div>
          )}

          {course.topics?.length > 0 && (
            <div className="mt-8">

              <h3 className="text-sm font-bold uppercase text-slate-400">
                Topics
              </h3>

              <ul className="mt-3 space-y-2">

                {course.topics.map((topic, index) => (
                  <li
                    key={index}
                    className="rounded-xl bg-slate-50 px-4 py-3 text-slate-700"
                  >
                    {topic}
                  </li>
                ))}

              </ul>

            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default CourseDetails;