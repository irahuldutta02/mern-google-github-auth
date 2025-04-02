// client/src/components/OAuthButtons.jsx
import React from "react";
import { useLocation } from "react-router-dom";
// Import icons if desired (e.g., from react-icons)
// import { FaGoogle, FaGithub } from 'react-icons/fa';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const OAuthButtons = () => {
  const location = useLocation();

  // Determine the redirect path
  const redirectPath = location.state?.from?.pathname || location.pathname;

  // Construct the backend OAuth URLs
  const googleLoginUrl = `${API_BASE_URL}/auth/google?redirect=${encodeURIComponent(
    redirectPath
  )}`;
  const githubLoginUrl = `${API_BASE_URL}/auth/github?redirect=${encodeURIComponent(
    redirectPath
  )}`;

  const handleOAuthRedirect = (url) => {
    window.location.href = url;
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Google Button */}
        <button
          onClick={() => handleOAuthRedirect(googleLoginUrl)}
          type="button" // Add type="button" to prevent form submission if inside a form
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          {/* <FaGoogle className="w-5 h-5 mr-2" /> */}
          <span className="sr-only">Sign in with Google</span>
          {/* Placeholder SVG or Icon */}
          <svg className="w-5 h-5 mr-2" /* ... Google SVG props ... */>
            {/* Google Icon Path */}
          </svg>
          Google
        </button>

        {/* GitHub Button */}
        <button
          onClick={() => handleOAuthRedirect(githubLoginUrl)}
          type="button" // Add type="button"
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          {/* <FaGithub className="w-5 h-5 mr-2" /> */}
          <span className="sr-only">Sign in with GitHub</span>
          {/* Placeholder SVG or Icon */}
          <svg className="w-5 h-5 mr-2" /* ... GitHub SVG props ... */>
            {/* GitHub Icon Path */}
          </svg>
          GitHub
        </button>
      </div>
    </div>
  );
};

export default OAuthButtons;
