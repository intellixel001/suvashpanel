"use client";
import handleError from "./handleError";

export const setupInterceptors = (axiosInstance) => {
  // 🔹 Request Interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      // Example: Add auth token if exists
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }

      // Add correlation ID or tracing header for observability
      // config.headers["X-Request-ID"] = crypto.randomUUID();

      return config;
    },
    (error) => Promise.reject(error)
  );

  // 🔹 Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => response.data, // Simplify response
    async (error) => {
      const originalRequest = error.config;

      // Example: Refresh token logic (optional)
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        typeof window !== "undefined"
      ) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token");

          const res = await axiosInstance.post("/auth/refresh", {
            refreshToken,
          });
          const newAccessToken = res.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          // If refresh fails — logout
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      // Centralized error handler
      handleError(error);
      return Promise.reject(error);
    }
  );
};
