// frontend/src/lib/api/form.ts
import { API, fetchWithAuth } from "@/config/api";
import type { Form, FormWithQuestions, QuestionType } from "../../types/form";

// Create a new form
export async function createForm(
  title: string,
  description?: string
): Promise<Form> {
  const data = await fetchWithAuth(API.FORMS, {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
  return data.form;
}

// Get all user's forms
export async function getUserForms(): Promise<Form[]> {
  const data = await fetchWithAuth(API.FORMS);
  return data.forms;
}

// Get single form with questions
export async function getFormById(formId: string): Promise<FormWithQuestions> {
  const response = await fetch(API.FORM_BY_ID(formId));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch form");
  }

  return data.form;
}

// Update form
export async function updateForm(
  formId: string,
  updates: Partial<Pick<Form, "title" | "description" | "is_public">>
): Promise<Form> {
  const data = await fetchWithAuth(API.FORM_BY_ID(formId), {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.form;
}

// Delete form
export async function deleteForm(formId: string): Promise<void> {
  await fetchWithAuth(API.FORM_BY_ID(formId), {
    method: "DELETE",
  });
}

// Add question to form (UPDATED - supports new question types)
export async function addQuestion(
  formId: string,
  questionData: {
    question_text: string;
    question_type: QuestionType;
    is_required?: boolean;
    options?: string[];
    rating_scale?: number; // ✅ NEW - For rating questions
    file_types?: string[]; // ✅ NEW - For file_upload questions
    max_file_size?: number; // ✅ NEW - For file_upload questions
  }
) {
  const data = await fetchWithAuth(API.ADD_QUESTION(formId), {
    method: "POST",
    body: JSON.stringify(questionData),
  });
  return data.question;
}

// Update question
export async function updateQuestion(
  questionId: string,
  updates: {
    question_text?: string;
    question_type?: QuestionType;
    is_required?: boolean;
  }
) {
  const data = await fetchWithAuth(API.UPDATE_QUESTION(questionId), {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.question;
}

// Delete question
export async function deleteQuestion(questionId: string): Promise<void> {
  await fetchWithAuth(API.DELETE_QUESTION(questionId), {
    method: "DELETE",
  });
}
