// ./services/api.js
import axios from "axios";

// Use Next.js specific environment variable prefix
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to set Authorization header if token exists
// This is slightly different from the Vite version - we set it dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Check localStorage directly
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor (same as before)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("API Error: Unauthorized (401)");
      // Handle 401 - maybe trigger logout via context if possible,
      // or redirect. Direct localStorage manipulation here is okay,
      // but triggering a context update is cleaner if feasible.
      // localStorage.removeItem('authToken');
      // if (typeof window !== 'undefined') { // Ensure running client-side
      //   window.location.href = '/login';
      // }
    }
    return Promise.reject(error);
  }
);

export default api;
