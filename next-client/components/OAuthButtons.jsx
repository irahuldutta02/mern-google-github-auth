// ./components/OAuthButtons.jsx
"use client"; // Needs window object for redirection

import React from "react";
// No need for useLocation here, redirect path is handled by backend query param

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const OAuthButtons = () => {
  // We need to know the *current* page's path to pass as redirect
  // In Next.js client components, we can get this from window.location
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const googleLoginUrl = `${API_BASE_URL}/auth/google?redirect=${encodeURIComponent(
    currentPath
  )}`;
  const githubLoginUrl = `${API_BASE_URL}/auth/github?redirect=${encodeURIComponent(
    currentPath
  )}`;

  const handleOAuthRedirect = (url) => {
    // Redirect the browser directly to the backend OAuth initiation endpoint
    window.location.href = url;
  };

  return (
    <div className="mt-6 space-y-4">
      {/* ... (rest of the JSX is the same as the React version) ... */}
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
          type="button"
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Sign in with Google</span>
          <svg className="w-5 h-5 mr-2" /* ... Google SVG props ... */>
            {/* Google Icon Path */}
          </svg>
          Google
        </button>

        {/* GitHub Button */}
        <button
          onClick={() => handleOAuthRedirect(githubLoginUrl)}
          type="button"
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Sign in with GitHub</span>
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
