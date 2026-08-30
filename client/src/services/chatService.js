import api from "../api/api";

// Send message to personalized AI mentor
export const sendChatMessage = (message) => {
  return api.post("/chat/", {
    message,
  });
};

// Get previous AI mentor conversations
export const getChatHistory = () => {
  return api.get("/chat/history");
};

// Clear mentor conversation history
export const clearChatHistory = () => {
  return api.delete("/chat/history");
};