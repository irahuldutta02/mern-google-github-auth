// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import api from "../services/api";

// No need for TypeScript interfaces here

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to set user and token, update local storage and API headers
  const setupAuth = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (authToken) {
      localStorage.setItem("authToken", authToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      localStorage.removeItem("authToken");
      delete api.defaults.headers.common["Authorization"];
    }
    setIsLoading(false); // Finished loading/setting up
  };

  // Login function
  const login = (userData, authToken) => {
    setupAuth(userData, authToken);
    setError(null); // Clear previous errors on successful login
  };

  // Logout function
  const logout = () => {
    setupAuth(null, null);
    // Optionally: could call a backend logout endpoint if needed
  };

  // Load user data if token exists on initial load or refresh
  const loadUser = async () => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && !user) {
      setIsLoading(true);
      setError(null);
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        const response = await api.get("/auth/profile"); // Fetch user profile
        setupAuth(response.data, storedToken);
      } catch (err) {
        console.error("Failed to load user:", err);
        logout(); // Clear invalid token and user state
        setError("Session expired. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false); // No token, loading finished
    }
  };

  // Effect to load user on component mount
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

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
        loadUser,
        setError, // Pass setError down
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Add PropTypes for AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
