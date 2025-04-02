// client/src/services/api.js
import axios from "axios";

// Use environment variable for API base URL (Vite syntax)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptor to handle token expiration or other errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("API Error: Unauthorized (401)");
      // Example: Trigger logout or token refresh logic here
      // Note: Avoid direct state manipulation; use events or context updates
      // localStorage.removeItem('authToken');
      // window.location.href = '/login'; // Force redirect (can be disruptive)
    }
    return Promise.reject(error);
  }
);

export default api;
