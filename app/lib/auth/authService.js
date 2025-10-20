import apiClient from "../api/client";

// Token management
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
};

const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt_token", token);
  }
};

const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt_token");
  }
};

// User management
const setUser = (userData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(userData));
  }
};

const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const removeUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

// Auth API calls
const login = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });

    if (
      response.success &&
      response.data &&
      response.data.token &&
      response.data.user
    ) {
      setToken(response.data.token);
      setUser(response.data.user);
      return { user: response.data.user };
    } else {
      throw new Error(response.message || "Login failed");
    }
  } catch (error) {
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", userData);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || "Registration failed");
    }
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  removeToken();
  removeUser();
};

const getProfile = async () => {
  try {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (email) => {
  try {
    const response = await apiClient.post("/auth/reset-password", { email });
    return response;
  } catch (error) {
    throw error;
  }
};

const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const isAuthenticated = () => {
  return !!getToken();
};

const normalizeUser = (user) => ({
  ...user,
  is2FAEnabled: user.is2FAEnabled ?? user.is_2fa_enabled ?? false,
});

export const authService = {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  login,
  register,
  logout,
  getProfile,
  resetPassword,
  changePassword,
  isAuthenticated,
};

export default authService;
