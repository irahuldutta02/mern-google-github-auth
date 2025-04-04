// ./app/login/page.jsx
"use client"; // <-- Needs hooks, router, context

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // <-- Next.js hooks
import { useAuth } from "../../contexts/AuthContext"; // Adjust path
import api from "../../services/api"; // Adjust path
import OAuthButtons from "../../components/OAuthButtons"; // Adjust path

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false); // Renamed to avoid conflict

  const {
    login,
    error: authError,
    setError: setAuthError,
    clearError,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // For getting query params like 'error' or 'from'

  // --- Guest Protection ---
  useEffect(() => {
    // Redirect if user is already authenticated and auth is not loading
    if (!isAuthLoading && isAuthenticated) {
      // Check for a 'from' query parameter to redirect back after login attempt
      const fromPath = searchParams.get("from") || "/dashboard";
      router.replace(fromPath); // Use replace to not add login to history
    }
  }, [isAuthenticated, isAuthLoading, router, searchParams]);

  // --- Handle OAuth Errors ---
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setAuthError(`Login failed: ${oauthError.replace(/_/g, " ")}`);
      // Clean the URL query params - navigate to the same path without query
      router.replace("/login");
    }
    // Clear errors on mount/navigation
    clearError();
    setLocalError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Rerun when query params change

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    setLocalError(null);
    clearError();

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data, response.data.token);
      // Redirect after successful login - check 'from' param or default
      const fromPath = searchParams.get("from") || "/dashboard";
      router.replace(fromPath); // Use replace here too
    } catch (err) {
      console.error("Login failed:", err);
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setLocalError(message);
    } finally {
      setIsLoadingForm(false);
    }
  };

  // Don't render the form if auth is loading or user is authenticated (while redirecting)
  if (isAuthLoading || isAuthenticated) {
    return <div>Loading...</div>; // Or a better loading indicator
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg sm:w-full md:w-1/2 lg:w-1/3">
        <h3 className="text-2xl font-bold text-center">
          Login to your account
        </h3>
        {(localError || authError) && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
            {localError || authError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* ... (Form JSX is the same as React version, but use next/link for Register link) ... */}
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 disabled:opacity-50"
                disabled={isLoadingForm}
              >
                {isLoadingForm ? "Logging in..." : "Login"}
              </button>
              <Link
                href="/register"
                className="text-sm text-blue-600 hover:underline"
              >
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </form>
        <OAuthButtons />
      </div>
    </div>
  );
}
