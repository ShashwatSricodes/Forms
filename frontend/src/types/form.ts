// frontend/src/types/forms.ts

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
  | "time";

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
}

export interface FormWithQuestions extends Form {
  questions: Question[];
}

export interface Answer {
  question_id: string;
  answer_text?: string;
  selected_options?: string[];
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
  questions?: {
    question_text: string;
    question_type: QuestionType;
  };
}
