// client/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api"; // Use the configured api instance

const DashboardPage = () => {
  const { user, token, logout } = useAuth(); // Get user from context
  // No need for UserProfile type, just use the structure
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch detailed profile if needed
  useEffect(() => {
    const fetchProfile = async () => {
      if (token && !profile) {
        setLoading(true);
        setError(null);
        try {
          // Assuming context user is sufficient for this example
          // If not, fetch more details:
          const response = await api.get("/auth/profile");
          setProfile(response.data);

          // Use context user directly or fetch if needed
          // setProfile({
          //   name: user?.name || "N/A",
          //   email: user?.email || "N/A",
          //   avatarUrl: user?.avatarUrl,
          //   createdAt: "N/A", // Placeholder - fetch if needed
          // });
        } catch (err) {
          console.error("Failed to fetch profile:", err);
          setError("Could not load user profile.");
          if (err.response?.status === 401) {
            logout(); // Log out if unauthorized
          }
        } finally {
          setLoading(false);
        }
      } else if (!token) {
        setLoading(false);
      } else {
        // Profile already loaded or user from context is sufficient
        setLoading(false);
      }
    };

    // Only fetch if user exists in context (meaning token was likely valid)
    if (user) {
      fetchProfile();
    } else if (!token) {
      // No token, definitely not loading
      setLoading(false);
    }
    // If token exists but user is null, AuthContext is still loading user
    // So we rely on the initial loading state from AuthContext

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]); // Depend on token and user from context

  if (loading)
    return <div className="container mx-auto p-4">Loading dashboard...</div>;
  if (error)
    return <div className="container mx-auto p-4 text-red-600">{error}</div>;

  // Use profile state if fetched, otherwise fallback to context user
  const displayUser = profile || user;

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
              {/* Display other details like createdAt if fetched */}
              {/* <p><strong>Member Since:</strong> {displayUser.createdAt !== 'N/A' ? new Date(displayUser.createdAt).toLocaleDateString() : 'N/A'}</p> */}
            </div>
          </div>
        ) : (
          <p>Could not load user information.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
