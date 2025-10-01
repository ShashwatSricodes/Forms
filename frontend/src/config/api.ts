// src/config/api.ts
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

if (!BASE_URL) {
  console.error("⚠️ VITE_BACKEND_URL is not defined in .env file");
}

export const API = {
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGIN: `${BASE_URL}/auth/login`,
};

// Helper function for API calls (optional but recommended)
export const fetchAPI = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    return { response, data };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
