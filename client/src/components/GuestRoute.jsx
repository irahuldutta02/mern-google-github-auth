// client/src/components/GuestRoute.jsx
import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // While checking auth status, don't render anything or show a loader
    // Returning null prevents potential flashes of the login/register page
    return null;
    // Alternatively, show a generic loading indicator:
    // return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    // User is logged in, redirect them away from login/register to the dashboard
    // 'replace' prevents adding the login/register page to the history stack
    return <Navigate to="/dashboard" replace />;
  }

  // User is not logged in, allow access to the child route (Login/Register page)
  return children;
};

// Add PropTypes
GuestRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

export default GuestRoute;
