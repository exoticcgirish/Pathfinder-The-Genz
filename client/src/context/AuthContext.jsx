import { createContext, useContext, useEffect, useState } from "react";

import {
  getProfile,
  loginUser as loginApi,
  registerUser as registerApi,
} from "../services/authService";

import { storage } from "../utils/storage";

const AuthContext = createContext(null);

const getUserRole = (user) => {
  if (!user) return null;

  return (
    user.role ||
    user.userRole ||
    user.roleName ||
    user.accountType ||
    null
  );
};

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    role: getUserRole(user),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = storage.getUser();
    return normalizeUser(savedUser);
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // RESTORE LOGGED-IN USER
  // =========================
  useEffect(() => {
    const loadUser = async () => {
      const token = storage.getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile();

        const profileUser =
          response.data?.user ||
          response.data?.data ||
          response.data;

        const normalizedUser = normalizeUser(profileUser);

        console.log("RESTORED USER:", normalizedUser);
        console.log("RESTORED ROLE:", normalizedUser?.role);

        setUser(normalizedUser);
        storage.setUser(normalizedUser);
      } catch (error) {
        console.error("AUTH RESTORE ERROR:", error);

        storage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // =========================
  // REGISTER
  // =========================
  const register = async (formData) => {
    try {
      console.log("REGISTER REQUEST:", formData);

      const response = await registerApi(formData);

      const data = response.data;

      console.log("REGISTER RESPONSE:", data);

      if (!data?.success) {
        throw new Error(data?.message || "Registration failed");
      }

      return data;
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      console.error("REGISTER RESPONSE ERROR:", error.response?.data);

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Registration failed"
      );
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    try {
      const response = await loginApi({
        email,
        password,
      });

      const data = response.data;

      console.log("LOGIN RESPONSE:", data);

      if (!data?.success || !data?.token) {
        throw new Error(data?.message || "Login failed");
      }

      storage.setToken(data.token);

      let loggedUser = data.user || null;

      try {
        const profileResponse = await getProfile();

        loggedUser =
          profileResponse.data?.user ||
          profileResponse.data?.data ||
          profileResponse.data ||
          loggedUser;
      } catch (error) {
        console.warn("PROFILE FETCH ERROR:", error);
      }

      const normalizedUser = normalizeUser(loggedUser);

      console.log("LOGIN USER:", normalizedUser);
      console.log("LOGIN ROLE:", normalizedUser?.role);

      storage.setUser(normalizedUser);
      setUser(normalizedUser);

      return {
        ...data,
        user: normalizedUser,
      };
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    storage.clear();
    setUser(null);
  };

  // =========================
  // REFRESH USER
  // =========================
  const refreshUser = async () => {
    try {
      const response = await getProfile();

      const updatedUser =
        response.data?.user ||
        response.data?.data ||
        response.data;

      const normalizedUser = normalizeUser(updatedUser);

      storage.setUser(normalizedUser);
      setUser(normalizedUser);

      return normalizedUser;
    } catch (error) {
      console.error("REFRESH USER ERROR:", error);
      throw error;
    }
  };

  const role = getUserRole(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!storage.getToken(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};