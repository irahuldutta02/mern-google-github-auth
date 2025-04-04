// ./components/Navbar.jsx
"use client"; // <-- Needs hooks and router

import React from "react";
import Link from "next/link"; // <-- Use Next.js Link
import { useRouter } from "next/navigation"; // <-- Use Next.js Router
import { useAuth } from "../contexts/AuthContext"; // Adjust path
import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter(); // Get router instance

  const handleLogout = () => {
    logout();
    router.push("/"); // Navigate to home after logout
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          MyApp
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <span className="flex items-center">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || "Avatar"} // Add default alt text
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8 mr-2 text-gray-400" />
                )}
                Hi, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center"
                title="Logout"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
