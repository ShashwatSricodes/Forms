// frontend/src/lib/api/responses.ts
import { API, fetchWithAuth } from "@/config/api";
import type { Answer, Response } from "../../types/form";

// Submit response (public)
export async function submitResponse(
  formId: string,
  answers: Answer[]
): Promise<string> {
  const response = await fetch(API.SUBMIT_RESPONSE(formId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to submit response");
  }

  return data.response_id;
}

// Get all responses for a form (owner only)
export async function getFormResponses(formId: string): Promise<Response[]> {
  const data = await fetchWithAuth(API.FORM_RESPONSES(formId));
  return data.responses;
}

// Get single response (owner only)
export async function getResponseById(responseId: string): Promise<Response> {
  const data = await fetchWithAuth(API.RESPONSE_BY_ID(responseId));
  return data.response;
}

// Delete response (owner only)
export async function deleteResponse(responseId: string): Promise<void> {
  await fetchWithAuth(API.DELETE_RESPONSE(responseId), {
    method: "DELETE",
  });
}
