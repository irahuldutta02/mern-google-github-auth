// ./app/auth/callback/page.jsx
"use client"; // <-- Needs hooks

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext"; // Adjust path
import api from "../../../services/api"; // Adjust path

export default function AuthCallbackPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    // Decode the redirect path passed from the backend
    const redirectParam = searchParams.get("redirect");
    const redirectPath = redirectParam
      ? decodeURIComponent(redirectParam)
      : "/dashboard";

    const handleAuth = async () => {
      if (token) {
        // 1. Store token immediately (localStorage is client-side)
        localStorage.setItem("authToken", token);
        // Axios interceptor will now pick this up for the next request

        // 2. Fetch user data using the new token to confirm
        try {
          const response = await api.get("/auth/profile");
          // 3. Update AuthContext fully
          login(response.data, token);
          // 4. Redirect user using Next.js router
          router.replace(redirectPath); // Use replace to avoid callback in history
        } catch (error) {
          console.error(
            "Failed to fetch user profile after OAuth callback:",
            error
          );
          localStorage.removeItem("authToken");
          // Redirect to login with an error message
          router.replace(`/login?error=callback_profile_fetch_failed`);
        }
      } else {
        // No token found in URL params
        console.error("OAuth callback missing token.");
        router.replace("/login?error=callback_token_missing");
      }
    };

    handleAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Depend only on searchParams

  // Display a loading message while processing
  return (
    <div className="flex items-center justify-center min-h-screen">
      Processing authentication...
    </div>
  );
}
