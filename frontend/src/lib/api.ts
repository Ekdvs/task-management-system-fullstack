import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send httpOnly refresh cookie
});


// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


let isRefreshing = false;

let refreshQueue: Array<() => void> = [];


// Handle expired access token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;


    // Avoid infinite refresh loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;


      // If refresh already running, wait
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push(() => {
            resolve(api(originalRequest));
          });
        });
      }


      isRefreshing = true;


      try {
        // Uses httpOnly refresh_token cookie automatically
        const response = await api.post("/auth/refresh");


        const newToken = response.data.data.token;


        localStorage.setItem(
          "auth_token",
          newToken
        );


        // Retry waiting requests
        refreshQueue.forEach((callback) => callback());

        refreshQueue = [];


        // Retry original failed request
        return api(originalRequest);


      } catch (refreshError) {


        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");


        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }


        return Promise.reject(refreshError);


      } finally {

        isRefreshing = false;

      }
    }


    return Promise.reject(error);
  }
);



export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {

  if (axios.isAxiosError(error)) {

    const data = error.response?.data as
      | {
          message?: string;
          errors?: { msg: string }[];
        }
      | undefined;


    if (data?.errors?.length) {
      return data.errors[0].msg;
    }


    if (data?.message) {
      return data.message;
    }

  }


  return fallback;
}