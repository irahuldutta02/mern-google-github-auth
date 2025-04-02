// client/src/components/ProtectedRoute.jsx
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // Get current location

  if (isLoading) {
    // Show a loading indicator while checking auth status
    return <div>Loading...</div>; // Replace with a proper spinner component
  }

  if (!isAuthenticated) {
    // User not authenticated, redirect to login page
    // Pass the current location object in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the child component
  return children;
};

// Add PropTypes for ProtectedRoute
ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired, // Expecting a single JSX element
};

export default ProtectedRoute;
