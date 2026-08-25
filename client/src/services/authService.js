import api from "../api/api";

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const getProfile = () => {
  return api.get("/users/profile");
};

export const updateProfile = (data) => {
  return api.put("/users/profile", data);
};