// frontend/src/types/form.ts
// UPDATED - Added new question types and features

export interface Form {
  id: string;
  title: string;
  description?: string;
  created_by: string;
  is_public: boolean;
  created_at: string;
}

export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "date"
  | "time"
  | "email" // ✉️ NEW
  | "phone" // 📱 NEW
  | "url" // 🔗 NEW
  | "rating_5" // ⭐ NEW
  | "rating_10" // ⭐ NEW
  | "file_upload" // 📎 NEW
  | "signature"; // ✍️ NEW

export interface Option {
  id: string;
  question_id: string;
  option_text: string;
  order_index: number;
}

export interface Question {
  id: string;
  form_id: string;
  question_text: string;
  question_type: QuestionType;
  is_required: boolean;
  order_index: number;
  created_at: string;
  options?: Option[];
  rating_scale?: number; // ✅ NEW - For rating questions
  file_types?: string[]; // ✅ NEW - For file_upload
  max_file_size?: number; // ✅ NEW - For file_upload
}

export interface FormWithQuestions extends Form {
  questions: Question[];
  branding?: FormBranding; // ✅ NEW
  media?: FormMedia[]; // ✅ NEW
}

export interface Answer {
  question_id: string;
  answer_text?: string;
  selected_options?: string[];
  file_data?: {
    // ✅ NEW - For file uploads
    name: string;
    type: string;
    content: string; // base64 encoded
  };
  question_type?: string; // ✅ NEW - To determine storage bucket
}

export interface Response {
  id: string;
  form_id: string;
  submitted_at: string;
  answers: ResponseAnswer[];
}

export interface ResponseAnswer {
  id: string;
  response_id: string;
  question_id: string;
  answer_text?: string;
  selected_options?: string[];
  file_url?: string; // ✅ NEW
  file_name?: string; // ✅ NEW
  file_size?: number; // ✅ NEW
  storage_path?: string; // ✅ NEW
  questions?: {
    question_text: string;
    question_type: QuestionType;
  };
}

// ✅ NEW - Form Media
export interface FormMedia {
  id: string;
  form_id: string;
  question_id?: string;
  media_type: "image" | "video" | "logo";
  media_url: string;
  storage_path: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  position: "top" | "bottom" | "left" | "right";
  created_at: string;
}

// ✅ NEW - Form Branding
export interface FormBranding {
  id: string;
  form_id: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  logo_url?: string;
  logo_storage_path?: string;
  logo_position: "top" | "center";
  font_family: string;
  heading_font_size: number;
  body_font_size: number;
  form_width: "small" | "medium" | "large" | "full";
  border_radius: number;
  custom_css?: string;
  created_at: string;
  updated_at: string;
}
