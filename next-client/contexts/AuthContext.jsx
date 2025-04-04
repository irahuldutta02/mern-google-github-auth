// ./contexts/AuthContext.jsx
"use client"; // <-- Mark as a Client Component

import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../services/api"; // Adjust path if needed

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Initialize token later in useEffect
  const [isLoading, setIsLoading] = useState(true); // Start loading
  const [error, setError] = useState(null);

  // Load token from localStorage only on the client-side
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
    // Initial load user attempt if token exists
    if (storedToken) {
      loadUser(storedToken);
    } else {
      setIsLoading(false); // No token, not loading
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const setupAuth = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (authToken) {
      localStorage.setItem("authToken", authToken);
      // Axios interceptor handles setting the header now
    } else {
      localStorage.removeItem("authToken");
      // Axios interceptor won't add header if token is null/removed
    }
    // Don't set isLoading here, let loadUser handle it
  };

  const login = (userData, authToken) => {
    setupAuth(userData, authToken);
    setError(null);
    setIsLoading(false); // Login successful, loading finished
  };

  const logout = () => {
    setupAuth(null, null);
    setError(null);
    setIsLoading(false); // Logout finished
  };

  const loadUser = async (currentToken) => {
    // If currentToken isn't passed, try getting from state (might be null initially)
    const tokenToUse = currentToken || token;
    if (!tokenToUse) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Axios interceptor will add the header
      const response = await api.get("/auth/profile");
      setupAuth(response.data, tokenToUse); // Use the token we verified with
    } catch (err) {
      console.error("Failed to load user:", err);
      logout(); // Clear invalid token/user state
      setError("Session expired. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        error,
        login,
        logout,
        loadUser: () => loadUser(token), // Pass current token when called externally
        setError,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
