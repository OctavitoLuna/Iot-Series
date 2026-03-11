/// <reference types="vite/client" />
import axios from "axios";

// Change this IP to your local Flask server IP
const FLASK_API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export const apiClient = axios.create({
  baseURL: FLASK_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// We will use a mock service for demonstration purposes.
// You can replace the mock calls in the components with actual apiClient calls.
