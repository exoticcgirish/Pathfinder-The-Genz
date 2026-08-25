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
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const response = await getCourseById(id);

      console.log("COURSE DETAILS:", response.data);

      setCourse(response.data?.data || response.data);
    } catch (err) {
      console.error("COURSE DETAILS ERROR:", err);

      setError("Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        Loading course...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-red-500">
          {error || "Course not found."}
        </p>

        <button
          onClick={() => navigate("/courses")}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">

        <button
          onClick={() => navigate("/courses")}
          className="mb-6 text-indigo-600"
        >
          ← Back to Courses
        </button>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-600">
            {course.level || "Beginner"}
          </span>

          <h1 className="mt-5 text-4xl font-bold text-slate-900">
            {course.title || course.name}
          </h1>

          <p className="mt-5 text-slate-600">
            {course.description || "No description available."}
          </p>

        </div>

      </div>
    </div>
  );
};

export default CourseDetails;