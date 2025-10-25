// frontend/src/lib/api/media.ts
import { API, fetchWithAuth } from "@/config/api";
import type { FormMedia } from "../../types/form";
import { supabase } from "@/config/supabaseClient";

// Upload media (image/video) to form
export async function uploadFormMedia(
  formId: string,
  file: File,
  questionId?: string,
  position?: string
): Promise<FormMedia> {
  // Get auth token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  formData.append("file", file);
  if (questionId) formData.append("question_id", questionId);
  if (position) formData.append("position", position);

  const response = await fetch(`${API.MEDIA}/${formId}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to upload media");
  }

  return data.media;
}

// Get all media for a form
export async function getFormMedia(formId: string): Promise<FormMedia[]> {
  const response = await fetch(`${API.MEDIA}/${formId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch media");
  }

  return data.media;
}

// Delete media
export async function deleteFormMedia(mediaId: string): Promise<void> {
  await fetchWithAuth(`${API.MEDIA}/${mediaId}`, {
    method: "DELETE",
  });
}
