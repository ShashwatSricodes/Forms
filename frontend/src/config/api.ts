// ============================================
// frontend/src/config/api.ts
// UPDATED - Add new endpoints
// ============================================

import { supabase } from "@/config/supabaseClient";

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

  // ✅ NEW - Media
  MEDIA: `${BASE_URL}/media`,

  // ✅ NEW - Branding
  BRANDING: `${BASE_URL}/branding`,
};

// ✅ Helper for authenticated API calls
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    console.error("⚠️ No valid Supabase session found");
    throw new Error("Invalid or expired token");
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};
