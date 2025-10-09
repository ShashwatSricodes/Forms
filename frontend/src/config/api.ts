// frontend/src/config/api.ts
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

if (!BASE_URL) {
  console.error("⚠️ VITE_BACKEND_URL is not defined in .env file");
}

export const API = {
  // Auth
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGIN: `${BASE_URL}/auth/login`,

  // Forms
  FORMS: `${BASE_URL}/forms`,
  FORM_BY_ID: (id: string) => `${BASE_URL}/forms/${id}`,

  // Questions
  ADD_QUESTION: (formId: string) => `${BASE_URL}/forms/${formId}/questions`,
  UPDATE_QUESTION: (questionId: string) =>
    `${BASE_URL}/forms/questions/${questionId}`,
  DELETE_QUESTION: (questionId: string) =>
    `${BASE_URL}/forms/questions/${questionId}`,

  // Responses
  SUBMIT_RESPONSE: (formId: string) => `${BASE_URL}/responses/${formId}/submit`,
  FORM_RESPONSES: (formId: string) => `${BASE_URL}/responses/${formId}`,
  RESPONSE_BY_ID: (responseId: string) =>
    `${BASE_URL}/responses/single/${responseId}`,
  DELETE_RESPONSE: (responseId: string) =>
    `${BASE_URL}/responses/${responseId}`,
};

// Helper function for authenticated API calls
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};
