export const storage = {
  getToken() {
    return localStorage.getItem("token");
  },

  setToken(token) {
    localStorage.setItem("token", token);
  },

  removeToken() {
    localStorage.removeItem("token");
  },

  getUser() {
    const user = localStorage.getItem("user");

    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem("user");
  },

  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};