// client/src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute"; // <-- Import GuestRoute

// Import Pages (using .jsx)
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

// Layout component including Navbar
const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes with Navbar */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  {" "}
                  {/* Dashboard remains protected */}
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Standalone Routes - Wrap Login/Register with GuestRoute */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                {/* <-- Use GuestRoute */}
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                {/* <-- Use GuestRoute */}
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Catch-all route */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
