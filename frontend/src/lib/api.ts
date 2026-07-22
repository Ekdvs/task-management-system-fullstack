import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT to every request once the app has hydrated on the client.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// If the token is invalid or expired, clear it and send the user back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      window.localStorage.removeItem("auth_token");
      window.localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: { msg: string }[] }
      | undefined;
    if (data?.errors?.length) return data.errors[0].msg;
    if (data?.message) return data.message;
  }
  return fallback;
}
