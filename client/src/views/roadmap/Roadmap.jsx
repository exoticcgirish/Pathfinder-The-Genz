import { useEffect, useState } from "react";
import {
  getRoadmap,
  generateRoadmap,
} from "../../services/roadmapService";

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRoadmap();

      console.log("ROADMAP RESPONSE:", response.data);

      const data = response.data?.roadmap;

      if (Array.isArray(data)) {
        setRoadmap(data);
      } else if (Array.isArray(data?.courses)) {
        setRoadmap(data.courses);
      } else if (Array.isArray(data?.phases)) {
        setRoadmap(data.phases);
      } else {
        // No usable roadmap items
        setRoadmap([]);
      }

      // If backend returned an empty roadmap, generate it
      if (
        !Array.isArray(data) &&
        !Array.isArray(data?.courses) &&
        !Array.isArray(data?.phases)
      ) {
        setGenerating(true);

        const generated = await generateRoadmap();

        console.log(
          "GENERATED ROADMAP:",
          generated.data
        );

        const generatedData = generated.data?.roadmap;

        if (Array.isArray(generatedData)) {
          setRoadmap(generatedData);
        } else if (Array.isArray(generatedData?.courses)) {
          setRoadmap(generatedData.courses);
        } else if (Array.isArray(generatedData?.phases)) {
          setRoadmap(generatedData.phases);
        }
      }
    } catch (error) {
      console.error("ROADMAP ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load roadmap."
      );
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  if (loading || generating) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <h1 className="text-3xl font-bold text-slate-900">
          My Learning Roadmap
        </h1>

        <p className="mt-4 text-slate-500">
          {generating
            ? "Creating your personalized roadmap..."
            : "Loading your roadmap..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <h1 className="text-3xl font-bold text-slate-900">
          My Learning Roadmap
        </h1>

        <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!roadmap.length) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <h1 className="text-3xl font-bold text-slate-900">
          My Learning Roadmap
        </h1>

        <div className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold">
            No roadmap available
          </h2>

          <p className="mt-2 text-slate-500">
            Add your skills, interests and career goal to
            generate a personalized learning roadmap.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <p className="text-sm font-semibold text-indigo-600">
            PERSONALIZED LEARNING
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
            My Learning Roadmap
          </h1>

          <p className="mt-2 text-slate-500">
            Follow these courses to build your career step by step.
          </p>
        </div>

        <div className="space-y-6">

          {roadmap.map((item, index) => {

            const course = item.course || item;

            return (
              <div
                key={course?.id || course?._id || index}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                <div className="flex gap-5">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    {item.phase || index + 1}
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-indigo-600">
                      PHASE {item.phase || index + 1}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      {course?.title || "Course"}
                    </h2>

                    {course?.description && (
                      <p className="mt-2 text-slate-500">
                        {course.description}
                      </p>
                    )}

                    {course?.skills?.length > 0 && (
                      <div className="mt-4">

                        <p className="text-xs font-bold text-slate-400">
                          SKILLS
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">

                          {course.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                            >
                              {skill}
                            </span>
                          ))}

                        </div>

                      </div>
                    )}

                    {course?.topics?.length > 0 && (
                      <div className="mt-4">

                        <p className="text-xs font-bold text-slate-400">
                          TOPICS
                        </p>

                        <p className="mt-1 text-slate-600">
                          {course.topics.join(", ")}
                        </p>

                      </div>
                    )}

                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default Roadmap;