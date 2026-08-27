import api from "../api/api";

export const generateRoadmap = () => {
  return api.post("/roadmap/generate");
};

export const getRoadmap = () => {
  return api.get("/roadmap");
};