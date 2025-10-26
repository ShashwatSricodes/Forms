// frontend/src/lib/api/branding.ts
import { API, fetchWithAuth } from "@/config/api";
import type { FormBranding } from "../../types/form";
import { supabase } from "@/config/supabaseClient";

// Get form branding
export async function getFormBranding(formId: string): Promise<FormBranding> {
  const response = await fetch(`${API.BRANDING}/${formId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch branding");
  }

  return data.branding;
}

// Update form branding
export async function updateFormBranding(
  formId: string,
  branding: Partial<FormBranding>
): Promise<FormBranding> {
  const data = await fetchWithAuth(`${API.BRANDING}/${formId}`, {
    method: "PUT",
    body: JSON.stringify(branding),
  });

  return data.branding;
}

// Upload logo
export async function uploadLogo(
  formId: string,
  file: File
): Promise<{ logo_url: string; branding: FormBranding }> {
  // Get auth token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API.BRANDING}/${formId}/logo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to upload logo");
  }

  return data;
}
