// ./features/forms/types.ts

export type Option = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  type: "multiple-choice" | "short-answer" | "paragraph";
  options: Option[];
  required: boolean;
};