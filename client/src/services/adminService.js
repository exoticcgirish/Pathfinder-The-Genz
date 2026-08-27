import api from "../api/api";

export const createContentManager = (data) => {
  return api.post("/admin/content-managers", data);
};