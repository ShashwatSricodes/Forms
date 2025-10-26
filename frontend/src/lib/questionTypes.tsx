// frontend/src/lib/questionTypes.tsx
// Helper to get icons and labels for question types

import {
  TextCursorInput,
  MessageSquare,
  List,
  CheckSquare,
  ChevronDown,
  Calendar,
  Clock,
  Mail,
  Phone,
  Link,
  Star,
  Upload,
  PenTool,
} from "lucide-react";

export const questionTypeConfig = {
  short_text: {
    label: "Short answer",
    icon: TextCursorInput,
    description: "Single line text input",
  },
  long_text: {
    label: "Paragraph",
    icon: MessageSquare,
    description: "Multi-line text area",
  },
  multiple_choice: {
    label: "Multiple choice",
    icon: List,
    description: "Radio buttons - single selection",
  },
  checkboxes: {
    label: "Checkboxes",
    icon: CheckSquare,
    description: "Multiple selection",
  },
  dropdown: {
    label: "Dropdown",
    icon: ChevronDown,
    description: "Select from dropdown menu",
  },
  date: {
    label: "Date",
    icon: Calendar,
    description: "Date picker",
  },
  time: {
    label: "Time",
    icon: Clock,
    description: "Time picker",
  },
  email: {
    label: "Email",
    icon: Mail,
    description: "Email address with validation",
  },
  phone: {
    label: "Phone",
    icon: Phone,
    description: "Phone number input",
  },
  url: {
    label: "URL",
    icon: Link,
    description: "Website link with validation",
  },
  rating_5: {
    label: "Star Rating",
    icon: Star,
    description: "5-star rating scale",
  },
  rating_10: {
    label: "Scale Rating",
    icon: Star,
    description: "1-10 number scale",
  },
  file_upload: {
    label: "File Upload",
    icon: Upload,
    description: "Allow file uploads",
  },
  signature: {
    label: "Signature",
    icon: PenTool,
    description: "Digital signature capture",
  },
};

export function getQuestionTypeIcon(type: string) {
  return (
    questionTypeConfig[type as keyof typeof questionTypeConfig]?.icon ||
    TextCursorInput
  );
}

export function getQuestionTypeLabel(type: string) {
  return (
    questionTypeConfig[type as keyof typeof questionTypeConfig]?.label || type
  );
}
