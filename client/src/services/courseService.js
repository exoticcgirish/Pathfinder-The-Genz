import api from "../api/api";

// Get all courses
export const getCourses = () => {
  return api.get("/courses");
};

// Get one course
export const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};

// Create course
export const createCourse = (data) => {
  return api.post("/courses", data);
};

// Update course
export const updateCourse = (id, data) => {
  return api.put(`/courses/${id}`, data);
};

// Delete course
export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`);
};