"use client";

import axios from "axios";
import { setupInterceptors } from "./interceptors";

// Base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com",
  timeout: 15000, // 15s timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Setup global interceptors (auth, logging, errors, etc.)
setupInterceptors(apiClient);

export default apiClient;
