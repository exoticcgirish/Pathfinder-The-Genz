import {
  loginUser,
  registerUser,
  getProfile,
} from "../services/authService";

export const loginController = async (data) => {
  const response = await loginUser(data);
  return response.data;
};

export const registerController = async (data) => {
  const response = await registerUser(data);
  return response.data;
};

export const profileController = async () => {
  const response = await getProfile();
  return response.data;
};