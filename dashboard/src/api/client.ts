import axios from "axios";

const client = axios.create({
  baseURL: process.env.CC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token expiration
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          `${process.env.CC_API_URL || "http://localhost:8000"}/auth/refresh`,
          {
            refreshToken,
          },
        );

        const { authToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("authToken", authToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        client.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
        originalRequest.headers.Authorization = `Bearer ${authToken}`;

        return client(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default client;
