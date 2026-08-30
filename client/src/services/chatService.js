import api from "../api/api";


export const sendChatMessage = (message) => {
  return api.post("/chat/", {
    message,
  });
};


export const getChatHistory = () => {
  return api.get("/chat/history");
};


export const clearChatHistory = () => {
  return api.delete("/chat/history");
};