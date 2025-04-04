// ./app/dashboard/page.jsx
"use client"; // <-- Needs hooks, context

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path
// No need to import api directly if just displaying context data

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [displayUser, setDisplayUser] = useState(null);

  // --- Protected Route Logic ---
  useEffect(() => {
    // If finished loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      // Pass the current path as 'from' so login can redirect back
      router.replace(`/login?from=${encodeURIComponent("/dashboard")}`);
    }
    // If authenticated, set the user data for display
    if (isAuthenticated && user) {
      setDisplayUser(user);
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading state while checking auth
  if (isLoading || !isAuthenticated) {
    // Also show loading if redirecting
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  // Render dashboard content if authenticated
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        {displayUser ? (
          <div className="flex items-center space-x-4">
            {displayUser.avatarUrl && (
              <img
                src={displayUser.avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p>
                <strong>Name:</strong> {displayUser.name}
              </p>
              <p>
                <strong>Email:</strong> {displayUser.email}
              </p>
              {/* Add other details if available in user object */}
            </div>
          </div>
        ) : (
          <p>Loading user information...</p> // Should be brief as redirect happens quickly
        )}
      </div>
    </div>
  );
}
