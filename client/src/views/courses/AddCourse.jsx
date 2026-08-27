import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../services/courseService";

const AddCourse = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    topics: "",
    level: "Beginner",
    duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Course title is required");
      return;
    }

    try {
      setLoading(true);

      const courseData = {
        title: form.title.trim(),
        description: form.description.trim(),

        skills: form.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        topics: form.topics
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        level: form.level,
        duration: form.duration.trim(),
      };

      const response = await createCourse(courseData);

      console.log("COURSE CREATED:", response.data);

      if (response.data?.success) {
        alert("Course created successfully!");
        navigate("/content-manager", { replace: true });
      } else {
        setError(
          response.data?.message || "Failed to create course"
        );
      }
    } catch (error) {
      console.error("CREATE COURSE ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <button
            onClick={() => navigate("/content-manager")}
            className="mb-4 text-sm font-semibold text-indigo-600"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-extrabold text-slate-900">
            Add Course
          </h1>

          <p className="mt-2 text-slate-500">
            Create a new learning course.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Course Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Full Stack Web Development"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Course description..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Skills
              </label>

              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Node.js"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate skills using commas.
              </p>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Topics
              </label>

              <input
                name="topics"
                value={form.topics}
                onChange={handleChange}
                placeholder="HTML, CSS, React, APIs"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate topics using commas.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Level
                </label>

                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">
                    Intermediate
                  </option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Duration
                </label>

                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="8 weeks"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Creating Course..." : "Create Course"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default AddCourse;