import { createContext, useContext, useEffect, useState } from "react";
import {
  getProfile,
  loginUser as loginApi,
} from "../services/authService";
import { storage } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(true);

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

        setUser(profileUser);
        storage.setUser(profileUser);
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

  const login = async (email, password) => {
    const response = await loginApi({
      email,
      password,
    });

    const data = response.data;

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

    storage.setUser(loggedUser);
    setUser(loggedUser);

    return {
      ...data,
      user: loggedUser,
    };
  };

  const logout = () => {
    storage.clear();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await getProfile();

      const updatedUser =
        response.data?.user ||
        response.data?.data ||
        response.data;

      storage.setUser(updatedUser);
      setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      console.error("REFRESH USER ERROR:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
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