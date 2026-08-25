import { useState } from "react";
import { updateMyProfile } from "../../services/userService";

const Profile = () => {
  const [form, setForm] = useState({
    careerGoal: "",
    experienceLevel: "",
    learningPreference: "",
    interests: [],
  });

  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addInterest = () => {
    const value = interest.trim();

    if (!value) return;

    if (!form.interests.includes(value)) {
      setForm({
        ...form,
        interests: [...form.interests, value],
      });
    }

    setInterest("");
  };

  const removeInterest = (item) => {
    setForm({
      ...form,
      interests: form.interests.filter((i) => i !== item),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      await updateMyProfile(form);

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Your profile
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Build your learning profile
          </h1>

          <p className="mt-2 text-slate-500">
            Tell Pathfinder about your goals so we can personalize
            your learning journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          {message && (
            <div className="mb-6 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
              {message}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Career goal
              </label>

              <input
                type="text"
                name="careerGoal"
                value={form.careerGoal}
                onChange={handleChange}
                placeholder="e.g. Machine Learning Engineer"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Experience level
              </label>

              <select
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">
                  Intermediate
                </option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Learning preference
              </label>

              <select
                name="learningPreference"
                value={form.learningPreference}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select preference</option>
                <option value="project-based">
                  Project based
                </option>
                <option value="video">Video</option>
                <option value="reading">Reading</option>
                <option value="practice">Practice</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Learning interests
              </label>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInterest();
                    }
                  }}
                  placeholder="e.g. Python"
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={addInterest}
                  className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  Add
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {form.interests.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => removeInterest(item)}
                    className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
                  >
                    {item} ×
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;