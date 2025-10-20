"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/app/lib/auth/authService";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children, showLoading = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = authService.getUser();
      const token = authService.getToken();

      if (token && storedUser) {
        setUser(storedUser);
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const updatedUser = await authService.getProfile();
      if (updatedUser) {
        setUser(updatedUser);
        authService.setUser(updatedUser);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // Optional: handle error, e.g., logout user if session is invalid
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    // Clear all authentication tokens
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");

    // Clear cookies if used
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Reset auth state
    setUser(null);

    // Force a page reload to clear any remaining state
    window.location.href = "/";
  };

  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await authService.changePassword(currentPassword, newPassword);
  };

  const signInWithGoogle = async () => {
    throw new Error("Google sign-in is not implemented yet");
  };

  // Modified value object to match Firebase auth patterns
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    resetPassword,
    changePassword,
    signInWithGoogle,
    isAuthenticated: !!user,
    refreshUser,
  };

  // Show loading state if needed
  if (loading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
