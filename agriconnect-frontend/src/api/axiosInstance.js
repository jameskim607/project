import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const API = axios.create({
  baseURL: API_URL,  // ← Now correct — no double /api
});

// Request interceptor to add token to headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Ensure Bearer prefix is present
    if (!token.startsWith("Bearer ")) {
      req.headers.Authorization = `Bearer ${token}`;
    } else {
      req.headers.Authorization = token;
    }
  }
  return req;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
