import api from "../api/api";


export const startCourse = (courseId, data = {}) => {
  return api.post(`/progress/start/${courseId}`, data);
};


export const getProgress = () => {
  return api.get("/progress");
};


export const updateProgress = (progressId, data) => {
  return api.put(`/progress/${progressId}`, data);
};


export const completePhase = (phaseNumber) => {
  return api.post(`/progress/phase/${phaseNumber}/complete`);
};