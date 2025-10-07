// ./features/forms/components/QuestionOptions.tsx

"use client";
import { GripVertical, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Question, Option } from "../types";

type QuestionOptionsProps = {
  question: Question;
  onUpdate: (question: Question) => void;
};

export function QuestionOptions({ question, onUpdate }: QuestionOptionsProps) {
  const handleOptionChange = (optionId: string, text: string) => {
    const updatedOptions = question.options.map((opt) =>
      opt.id === optionId ? { ...opt, text } : opt
    );
    onUpdate({ ...question, options: updatedOptions });
  };

  const addOption = () => {
    const newOption: Option = {
      id: crypto.randomUUID(),
      text: `Option ${question.options.length + 1}`,
    };
    onUpdate({ ...question, options: [...question.options, newOption] });
  };

  const removeOption = (optionId: string) => {
    if (question.options.length <= 1) return;
    const updatedOptions = question.options.filter(
      (opt) => opt.id !== optionId
    );
    onUpdate({ ...question, options: updatedOptions });
  };

  return (
    <div className="space-y-2 pt-2">
      {question.options.map((option) => (
        <div key={option.id} className="flex items-center gap-2 group">
          <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
          <Input
            placeholder="Option text"
            value={option.text}
            onChange={(e) => handleOptionChange(option.id, e.target.value)}
            className="text-base font-normal bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 w-full p-2"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeOption(option.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={addOption}
        className="mt-2 text-muted-foreground text-sm"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Option
      </Button>
    </div>
  );
}