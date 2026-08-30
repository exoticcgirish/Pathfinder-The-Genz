import api from "../api/api";


export const getCourses = () => {
  return api.get("/courses");
};


export const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};


export const createCourse = (data) => {
  return api.post("/courses", data);
};


export const updateCourse = (id, data) => {
  return api.put(`/courses/${id}`, data);
};


export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`);
};