import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getRoadmap } from "../../services/roadmapService";
import {
  completePhase,
  getProgress,
} from "../../services/progressService";

import { sendChatMessage } from "../../services/chatService";

import "./Progress.css";


const Progress = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roadmap, setRoadmap] = useState(null);
  const [progressRecords, setProgressRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [completingPhase, setCompletingPhase] = useState(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [mentorMessage, setMentorMessage] = useState("");
  const [mentorResponse, setMentorResponse] = useState("");
  const [mentorLoading, setMentorLoading] = useState(false);



  const extractRoadmap = (response) => {
    const data = response?.data;

    if (!data) {
      return null;
    }

    return (
      data.roadmap ||
      data.data?.roadmap ||
      data.data ||
      data
    );
  };



  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [roadmapResult, progressResult] =
        await Promise.allSettled([
          getRoadmap(),
          getProgress(),
        ]);

      if (roadmapResult.status === "fulfilled") {
        const roadmapData = extractRoadmap(
          roadmapResult.value
        );

        setRoadmap(roadmapData);
      } else {
        console.error(
          "ROADMAP LOAD ERROR:",
          roadmapResult.reason
        );
      }

      if (progressResult.status === "fulfilled") {
        const progressData =
          progressResult.value?.data;

        setProgressRecords(
          progressData?.progress ||
          progressData?.data ||
          []
        );
      } else {
        console.error(
          "PROGRESS LOAD ERROR:",
          progressResult.reason
        );
      }

      if (
        roadmapResult.status === "rejected" &&
        progressResult.status === "rejected"
      ) {
        throw new Error(
          "Unable to load learning progress."
        );
      }
    } catch (err) {
      console.error(
        "PROGRESS PAGE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load your progress."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, []);



  const phases = useMemo(() => {
    return Array.isArray(roadmap?.phases)
      ? roadmap.phases
      : [];
  }, [roadmap]);


  const currentPhase = useMemo(() => {
    return (
      phases.find(
        (phase) =>
          phase.status === "available" &&
          !phase.completed
      ) || null
    );
  }, [phases]);


  const completedPhases = useMemo(() => {
    return phases.filter(
      (phase) =>
        phase.completed ||
        phase.status === "completed"
    );
  }, [phases]);


  const readinessScore = Number(
    roadmap?.readinessScore || 0
  );

  const roadmapProgress = Number(
    roadmap?.progressPercentage || 0
  );

  const weeklyHours =
    roadmap?.weeklyHours ||
    roadmap?.generatedFrom?.weeklyHours ||
    user?.profile?.weeklyHours ||
    0;


  const careerGoal =
    roadmap?.careerGoal ||
    roadmap?.generatedFrom?.careerGoal ||
    user?.profile?.careerGoal ||
    "Your Career Goal";


  const prioritySkills =
    roadmap?.prioritySkills ||
    roadmap?.generatedFrom?.prioritySkills ||
    [];




  const handleContinueLearning = (phase) => {
    if (!phase) return;

    
    const courseId =
      phase?.recommendedCourse?.id ||
      phase?.recommendedCourse?._id ||
      phase?.recommendedCourse?.courseId;

    if (courseId) {
      navigate(`/courses/${courseId}`);
      return;
    }

    
    
    const directResourceUrl =
      phase?.youtube?.url ||
      phase?.youtubeResource?.url ||
      phase?.youtubePlaylist?.url ||
      phase?.youtubePlaylistUrl ||
      phase?.youtubeUrl ||
      phase?.resource?.url ||
      phase?.recommendedResource?.url ||
      phase?.resourceUrl;

    if (directResourceUrl) {
      window.open(
        directResourceUrl,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    
    
    
    const youtubeSearchQuery =
      phase?.youtubeSearchQuery ||
      phase?.youtube?.searchQuery ||
      phase?.youtubeResource?.searchQuery ||
      phase?.youtubePlaylist?.searchQuery;

    if (youtubeSearchQuery) {
      const searchUrl =
        `https:
          youtubeSearchQuery
        )}`;

      window.open(
        searchUrl,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    
    
    navigate("/roadmap");
  };



  const handleCompletePhase = async (
    phaseNumber
  ) => {
    try {
      setCompletingPhase(
        phaseNumber
      );

      setError("");
      setSuccessMessage("");

      const response =
        await completePhase(
          phaseNumber
        );

      const data =
        response?.data?.data ||
        response?.data;

      const newReadiness =
        data?.readinessScore;

      const nextPhase =
        data?.nextPhase;

      let message =
        "Phase completed successfully!";

      if (newReadiness !== undefined) {
        message += ` Your readiness score is now ${newReadiness}%.`;
      }

      if (nextPhase?.title) {
        message += ` Next: ${nextPhase.title}.`;
      }

      setSuccessMessage(
        message
      );

      await loadData();
    } catch (err) {
      console.error(
        "COMPLETE PHASE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to complete this phase."
      );
    } finally {
      setCompletingPhase(null);
    }
  };



  const handleAskMentor = async (
    customMessage
  ) => {
    const finalMessage = (
      customMessage ||
      mentorMessage
    ).trim();

    if (!finalMessage) {
      return;
    }

    try {
      setMentorLoading(true);
      setError("");

      const response =
        await sendChatMessage(
          finalMessage
        );

      const reply =
        response?.data?.chat?.response ||
        response?.data?.response ||
        "Your mentor responded, but no message was returned.";

      setMentorResponse(
        reply
      );

      setMentorMessage("");
    } catch (err) {
      console.error(
        "MENTOR ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        "AI mentor is currently unavailable."
      );
    } finally {
      setMentorLoading(false);
    }
  };



  const getPriorityClass = (
    priority
  ) => {
    const value = String(
      priority || ""
    ).toLowerCase();

    if (value === "high") {
      return "priority-high";
    }

    if (value === "medium") {
      return "priority-medium";
    }

    return "priority-low";
  };


  const getPhaseLabel = (
    phase
  ) => {
    if (
      phase.completed ||
      phase.status === "completed"
    ) {
      return "Completed";
    }

    if (
      phase.status === "available"
    ) {
      return "Current";
    }

    return "Locked";
  };



  if (loading) {
    return (
      <div className="progress-page">
        <div className="progress-loading">
          <div className="loading-spinner" />

          <h2>
            Building your learning dashboard
          </h2>

          <p>
            Loading roadmap, skills and progress...
          </p>
        </div>
      </div>
    );
  }



  return (
    <div className="progress-page">


      <header className="progress-header">

        <div>
          <div className="brand-label">
            PATHFINDER
          </div>

          <h1>
            Learning Progress
          </h1>

          <p>
            Track your roadmap, close skill gaps
            and keep moving toward{" "}
            <strong>
              {careerGoal}
            </strong>.
          </p>
        </div>

        <div className="header-actions">

          <button
            className="secondary-button"
            onClick={() =>
              navigate("/roadmap")
            }
          >
            View Roadmap
          </button>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/chat")
            }
          >
            AI Mentor
          </button>

        </div>

      </header>



      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}



      <section className="stats-grid">

        <article className="stat-card readiness-card">

          <div className="stat-top">

            <span>
              Career Readiness
            </span>

            <span className="stat-icon">
              ◎
            </span>

          </div>

          <div className="stat-value">
            {readinessScore}%
          </div>

          <div className="stat-progress">

            <div
              className="stat-progress-fill"
              style={{
                width: `${Math.min(
                  readinessScore,
                  100
                )}%`,
              }}
            />

          </div>

          <p>
            Based on skills required for{" "}
            {careerGoal}
          </p>

        </article>


        <article className="stat-card">

          <div className="stat-top">

            <span>
              Roadmap Progress
            </span>

            <span className="stat-icon">
              ↗
            </span>

          </div>

          <div className="stat-value">
            {roadmapProgress}%
          </div>

          <div className="stat-progress">

            <div
              className="stat-progress-fill"
              style={{
                width: `${Math.min(
                  roadmapProgress,
                  100
                )}%`,
              }}
            />

          </div>

          <p>
            {completedPhases.length} of{" "}
            {phases.length} phases completed
          </p>

        </article>


        <article className="stat-card">

          <div className="stat-top">

            <span>
              Weekly Learning
            </span>

            <span className="stat-icon">
              ◷
            </span>

          </div>

          <div className="stat-value">
            {weeklyHours}
            <small> hrs</small>
          </div>

          <p>
            Personalized to your available
            learning time
          </p>

        </article>

      </section>



      {currentPhase ? (

        <section className="current-phase-card">

          <div className="phase-copy">

            <div className="eyebrow">
              CURRENT LEARNING PHASE
            </div>

            <div className="phase-number">
              Phase {currentPhase.phase}
            </div>

            <h2>
              {currentPhase.title}
            </h2>

            <p>
              {currentPhase.description ||
                currentPhase.goal ||
                "Continue building the skills required for your career goal."}
            </p>


            <div className="skill-chips">

              {(currentPhase.skills || [])
                .map((skill) => (

                  <span
                    className="skill-chip"
                    key={skill}
                  >
                    {skill}
                  </span>

                ))}

            </div>


            {currentPhase.milestone && (

              <div className="milestone-box">

                <span>
                  Milestone
                </span>

                <p>
                  {currentPhase.milestone}
                </p>

              </div>

            )}


            <div className="phase-actions">

              <button
                className="primary-button"
                onClick={() =>
                  handleContinueLearning(
                    currentPhase
                  )
                }
              >
                Continue Learning
              </button>

              <button
                className="complete-button"
                disabled={
                  completingPhase ===
                  currentPhase.phase
                }
                onClick={() =>
                  handleCompletePhase(
                    currentPhase.phase
                  )
                }
              >
                {completingPhase ===
                currentPhase.phase
                  ? "Completing..."
                  : "Mark Phase Complete"}
              </button>

            </div>

          </div>


          <div className="current-phase-meta">

            <div className="meta-item">

              <span>
                Estimated
              </span>

              <strong>
                {currentPhase.estimatedWeeks ||
                  "—"}{" "}
                weeks
              </strong>

            </div>

            <div className="meta-item">

              <span>
                Status
              </span>

              <strong className="active-text">
                Available
              </strong>

            </div>

            <div className="meta-item">

              <span>
                Focus
              </span>

              <strong>
                {(currentPhase.skills || [])
                  .slice(0, 2)
                  .join(" + ") ||
                  "Career Skills"}
              </strong>

            </div>

          </div>

        </section>

      ) : (

        <section className="current-phase-card">

          <div className="phase-copy">

            <div className="eyebrow">
              ROADMAP
            </div>

            <h2>
              All available phases completed
            </h2>

            <p>
              Great progress. Review your roadmap
              or regenerate recommendations for
              your next learning goal.
            </p>

          </div>

        </section>

      )}



      <section className="content-grid">


        <article className="panel">

          <div className="panel-header">

            <div>
              <span className="eyebrow">
                ADAPTIVE ANALYSIS
              </span>

              <h2>
                Priority Skill Gaps
              </h2>
            </div>

            <span className="panel-count">
              {prioritySkills.length}
            </span>

          </div>


          <div className="priority-list">

            {prioritySkills.length > 0 ? (

              prioritySkills.map(
                (item, index) => {

                  const skill =
                    typeof item ===
                    "string"
                      ? item
                      : item.skill;

                  const priority =
                    typeof item ===
                    "string"
                      ? "medium"
                      : item.priority;

                  const prerequisites =
                    typeof item ===
                    "object"
                      ? item.prerequisites || []
                      : [];

                  return (
                    <div
                      className="priority-item"
                      key={`${skill}-${index}`}
                    >

                      <div>

                        <strong>
                          {skill}
                        </strong>

                        {prerequisites.length >
                          0 && (

                          <small>
                            Prerequisites:{" "}
                            {prerequisites.join(
                              ", "
                            )}
                          </small>

                        )}

                      </div>

                      <span
                        className={`priority-badge ${getPriorityClass(
                          priority
                        )}`}
                      >
                        {priority}
                      </span>

                    </div>
                  );
                }
              )

            ) : (

              <div className="empty-state">

                <strong>
                  No priority gaps found
                </strong>

                <p>
                  Your skill-gap analysis will
                  appear here.
                </p>

              </div>

            )}

          </div>

        </article>



        <article className="panel mentor-panel">

          <div className="mentor-heading">

            <div className="mentor-avatar">
              ✦
            </div>

            <div>

              <span className="eyebrow">
                PERSONALIZED AI
              </span>

              <h2>
                Pathfinder Mentor
              </h2>

            </div>

          </div>


          <p className="mentor-description">
            Your mentor understands your current
            phase, skill gaps, career goal and
            learning progress.
          </p>


          <div className="quick-prompts">

            <button
              onClick={() =>
                handleAskMentor(
                  "What should I learn today?"
                )
              }
            >
              What should I learn today?
            </button>

            <button
              onClick={() =>
                handleAskMentor(
                  "Give me a small project for my current phase."
                )
              }
            >
              Give me a project
            </button>

          </div>


          <div className="mentor-input-row">

            <input
              type="text"
              value={mentorMessage}
              placeholder="Ask your AI mentor..."
              onChange={(e) =>
                setMentorMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !mentorLoading
                ) {
                  handleAskMentor();
                }
              }}
            />

            <button
              disabled={
                mentorLoading ||
                !mentorMessage.trim()
              }
              onClick={() =>
                handleAskMentor()
              }
            >
              {mentorLoading
                ? "..."
                : "Ask"}
            </button>

          </div>


          {mentorLoading && (

            <div className="mentor-thinking">
              Pathfinder is preparing your
              personalized answer...
            </div>

          )}


          {mentorResponse && (

            <div className="mentor-response">

              <div className="mentor-response-title">
                AI Mentor
              </div>

              <div className="mentor-response-text">
                {mentorResponse}
              </div>

              <button
                className="open-chat-button"
                onClick={() =>
                  navigate("/chat")
                }
              >
                Continue conversation →
              </button>

            </div>

          )}

        </article>

      </section>



      <section className="roadmap-section">

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              YOUR PATH
            </span>

            <h2>
              Personalized Roadmap
            </h2>

          </div>

          <button
            className="text-button"
            onClick={() =>
              navigate("/roadmap")
            }
          >
            Open full roadmap →
          </button>

        </div>


        <div className="roadmap-timeline">

          {phases.map(
            (phase, index) => {

              const completed =
                phase.completed ||
                phase.status ===
                  "completed";

              const available =
                phase.status ===
                "available" &&
                !completed;

              const locked =
                !completed &&
                !available;

              return (
                <div
                  className={`roadmap-phase ${
                    completed
                      ? "phase-completed"
                      : available
                      ? "phase-current"
                      : "phase-locked"
                  }`}
                  key={
                    phase.phase ||
                    index
                  }
                >

                  <div className="phase-marker">

                    {completed
                      ? "✓"
                      : available
                      ? "▶"
                      : "🔒"}

                  </div>


                  <div className="timeline-line" />


                  <div className="roadmap-phase-content">

                    <div className="phase-card-top">

                      <span>
                        Phase {phase.phase}
                      </span>

                      <span className="phase-status">
                        {getPhaseLabel(
                          phase
                        )}
                      </span>

                    </div>


                    <h3>
                      {phase.title}
                    </h3>


                    <div className="mini-skills">

                      {(phase.skills || [])
                        .slice(0, 4)
                        .map((skill) => (

                          <span
                            key={skill}
                          >
                            {skill}
                          </span>

                        ))}

                    </div>


                    {available && (

                      <button
                        className="phase-open-button"
                        onClick={() =>
                          navigate(
                            "/roadmap"
                          )
                        }
                      >
                        Continue phase
                      </button>

                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>

      </section>



      <div className="progress-footer">

        <span>
          {progressRecords.length} learning
          progress record
          {progressRecords.length === 1
            ? ""
            : "s"}
        </span>

        <span>
          Pathfinder adapts as you complete
          milestones.
        </span>

      </div>

    </div>
  );
};

export default Progress;