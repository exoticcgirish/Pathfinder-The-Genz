import api from "../api/api";

export const startCourse = (courseId) => {
  return api.post(`/progress/start/${courseId}`);
};