import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseById,
  updateCourse,
} from "../../services/courseService";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    topics: "",
    level: "Beginner",
    duration: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await getCourseById(id);
        const course = response.data?.course;

        if (!course) {
          setError("Course not found");
          return;
        }

        setForm({
          title: course.title || "",
          description: course.description || "",
          skills: (course.skills || []).join(", "),
          topics: (course.topics || []).join(", "),
          level: course.level || "Beginner",
          duration: course.duration || "",
        });
      } catch (error) {
        console.error("LOAD COURSE ERROR:", error);

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

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Course title is required.");
      return;
    }

    try {
      setSaving(true);

      const data = {
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

      const response = await updateCourse(id, data);

      console.log("COURSE UPDATED:", response.data);

      if (response.data?.success) {
        alert("Course updated successfully!");
        navigate("/courses");
      } else {
        setError(
          response.data?.message ||
            "Failed to update course."
        );
      }
    } catch (error) {
      console.error("UPDATE COURSE ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update course."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading course...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">

      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => navigate("/courses")}
          className="mb-6 text-sm font-semibold text-indigo-600"
        >
          ← Back to Courses
        </button>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">

          <h1 className="text-3xl font-extrabold text-slate-900">
            Edit Course
          </h1>

          <p className="mt-2 text-slate-500">
            Update course information.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* TITLE */}
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Course Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            {/* SKILLS */}
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Skills
              </label>

              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="Java, OOP, Spring Boot"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate skills with commas.
              </p>
            </div>

            {/* TOPICS */}
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Topics
              </label>

              <input
                name="topics"
                value={form.topics}
                onChange={handleChange}
                placeholder="OOP, Collections, Multithreading"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate topics with commas.
              </p>
            </div>

            {/* LEVEL + DURATION */}
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
                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>
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
              disabled={saving}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Course"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default EditCourse;