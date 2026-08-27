const TOKEN_KEY = "pathfinder_token";
const USER_KEY = "pathfinder_user";

export const storage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getUser() {
    try {
      const user = localStorage.getItem(USER_KEY);

      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("STORAGE USER ERROR:", error);
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
