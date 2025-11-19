// ✅ src/utils/api.js
import axios from "axios";
import EncryptedStorage from "./encryptedStorage";

// 🔹 Backend Base URL
// const BASE_URL = "https://battle-hub-server.vercel.app/api"; // change when deployed
const BASE_URL = "http://localhost:5000/api"; // for local development

// 🔹 Create a single axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Automatically attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const storedUser = EncryptedStorage.get("battlehub_user");
    if (storedUser) {
      const token = JSON.parse(storedUser)?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Global error handler (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized! Logging out...");
      // Optionally redirect to login
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
