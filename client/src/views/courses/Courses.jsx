import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, deleteCourse } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isManager = user?.role === "content_manager" || user?.role === "admin";

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourses();

      setCourses(response.data?.courses || []);
    } catch (error) {
      console.error("GET COURSES ERROR:", error);

      setError(error.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmDelete) return;

    try {
      await deleteCourse(id);

      setCourses((previous) => previous.filter((course) => course._id !== id));
    } catch (error) {
      console.error("DELETE COURSE ERROR:", error);

      alert(error.response?.data?.message || "Failed to delete course.");
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-slate-500'>Loading courses...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* HEADER */}
      <header className='border-b bg-white'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-5'>
          <div>
            <h1 className='text-2xl font-extrabold text-slate-900'>Courses</h1>

            <p className='text-sm text-slate-500'>
              Explore available learning courses
            </p>
          </div>

          {isManager && (
            <button
              onClick={() => navigate("/content-manager/courses/add")}
              className='rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700'
            >
              + Add Course
            </button>
          )}
        </div>
      </header>

      {/* CONTENT */}
      <main className='mx-auto max-w-7xl px-6 py-10'>
        {error && (
          <div className='mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600'>
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className='rounded-2xl border bg-white p-10 text-center'>
            <h2 className='text-xl font-bold text-slate-900'>
              No courses found
            </h2>

            <p className='mt-2 text-slate-500'>
              No courses have been added yet.
            </p>

            {isManager && (
              <button
                onClick={() => navigate("/content-manager/courses/add")}
                className='mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white'
              >
                Add First Course
              </button>
            )}
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {courses.map((course) => (
              <div
                key={course._id}
                className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
              >
                <div className='mb-4 flex items-start justify-between gap-3'>
                  <h2 className='text-xl font-bold text-slate-900'>
                    {course.title}
                  </h2>

                  <span className='rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600'>
                    {course.level || "Beginner"}
                  </span>
                </div>

                <p className='line-clamp-3 text-sm text-slate-500'>
                  {course.description || "No description available."}
                </p>

                {/* SKILLS */}
                {course.skills?.length > 0 && (
                  <div className='mt-4'>
                    <p className='mb-2 text-xs font-bold uppercase text-slate-400'>
                      Skills
                    </p>

                    <div className='flex flex-wrap gap-2'>
                      {course.skills.map((skill, index) => (
                        <span
                          key={index}
                          className='rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOPICS */}
                {course.topics?.length > 0 && (
                  <div className='mt-4'>
                    <p className='mb-2 text-xs font-bold uppercase text-slate-400'>
                      Topics
                    </p>

                    <p className='text-sm text-slate-600'>
                      {course.topics.join(", ")}
                    </p>
                  </div>
                )}

                {course.duration && (
                  <p className='mt-4 text-sm text-slate-500'>
                    ⏱ {course.duration}
                  </p>
                )}

                {/* ACTIONS */}
                <div className='mt-6 flex gap-3'>
                  <button
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className='flex-1 rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50'
                  >
                    View
                  </button>

                  {isManager && (
                    <button
                      onClick={() =>
                        navigate(`/content-manager/courses/edit/${course._id}`)
                      }
                      className='rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700'
                    >
                      Edit
                    </button>
                  )}

                  {isManager && (
                    <button
                      onClick={() => handleDelete(course._id)}
                      className='rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-600 hover:bg-red-50'
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
