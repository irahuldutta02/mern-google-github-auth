// ./app/register/page.jsx
"use client"; // <-- Needs hooks, router, context

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path
import api from "../../services/api"; // Adjust path
import OAuthButtons from "../../components/OAuthButtons"; // Adjust path

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const {
    login,
    error: authError,
    clearError,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Guest Protection ---
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      const fromPath = searchParams.get("from") || "/dashboard";
      router.replace(fromPath);
    }
  }, [isAuthenticated, isAuthLoading, router, searchParams]);

  useEffect(() => {
    // Clear errors on mount
    clearError();
    setLocalError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingForm(true);
    setLocalError(null);
    clearError();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      setIsLoadingForm(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      login(response.data, response.data.token);
      const fromPath = searchParams.get("from") || "/dashboard";
      router.replace(fromPath);
    } catch (err) {
      console.error("Registration failed:", err);
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setLocalError(message);
    } finally {
      setIsLoadingForm(false);
    }
  };

  // Don't render the form if auth is loading or user is authenticated
  if (isAuthLoading || isAuthenticated) {
    return <div>Loading...</div>; // Or a better loading indicator
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg sm:w-full md:w-1/2 lg:w-1/3">
        <h3 className="text-2xl font-bold text-center">Create an account</h3>
        {(localError || authError) && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
            {localError || authError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* ... (Form JSX is the same as React version, use next/link for Login link) ... */}
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mt-4">
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
            <div className="mt-4">
              <label className="block" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-900 disabled:opacity-50"
                disabled={isLoadingForm}
              >
                {isLoadingForm ? "Registering..." : "Register"}
              </button>
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </form>
        <OAuthButtons />
      </div>
    </div>
  );
}
