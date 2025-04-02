// client/src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import OAuthButtons from "../components/OAuthButtons";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    login,
    error: authError,
    setError: setAuthError,
    clearError,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    clearError();
    setLocalError(null);

    const queryParams = new URLSearchParams(location.search);
    const oauthError = queryParams.get("error");
    if (oauthError) {
      setAuthError(`Login failed: ${oauthError.replace(/_/g, " ")}`);
      navigate(location.pathname, { replace: true }); // Clean URL
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);
    clearError();

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data, response.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setLocalError(message);
    } finally {
      setIsLoading(false);
    }
  };

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
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
              <Link
                to="/register"
                className="text-sm text-blue-600 hover:underline"
              >
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </form>
        {/* --- OAuth Buttons --- */}
        <OAuthButtons />
      </div>
    </div>
  );
};

export default LoginPage;
