import api from "../api/api";

// Start tracking a course
export const startCourse = (courseId, data = {}) => {
  return api.post(`/progress/start/${courseId}`, data);
};

// Get logged-in learner progress
export const getProgress = () => {
  return api.get("/progress");
};

// Update course progress
export const updateProgress = (progressId, data) => {
  return api.put(`/progress/${progressId}`, data);
};

// Complete a roadmap phase
export const completePhase = (phaseNumber) => {
  return api.post(`/progress/phase/${phaseNumber}/complete`);
};