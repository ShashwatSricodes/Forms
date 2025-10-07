"use client";

import { useState, useRef, useLayoutEffect } from "react";
import * as React from "react";
import {
  Trash2,
  Copy,
  Plus,
  X,
  GripVertical,
  MessageSquare,
  TextCursorInput,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// --- TYPE DEFINITIONS ---
type Option = { id: string; text: string };
type Question = {
  id: string;
  text: string;
  type: "multiple-choice" | "short-answer" | "paragraph";
  options: Option[];
  required: boolean;
};

// --- AUTO-RESIZING TEXTAREA COMPONENT ---
const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef =
    (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

  useLayoutEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [props.value, textAreaRef]);

  return (
    <Textarea
      ref={textAreaRef}
      className={cn("resize-none overflow-hidden", className)}
      {...props}
    />
  );
});
AutoResizeTextarea.displayName = "AutoResizeTextarea";

// --- QUESTION CARD COMPONENT ---
const QuestionCard = ({
  question,
  onUpdate,
  onDelete,
  onDuplicate,
  isActive,
  onClick,
  index,
}: {
  question: Question;
  onUpdate: (q: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) => {
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
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-300 border bg-white shadow-sm",
        isActive ? "border-primary " : "border-border"
      )}
    >
      <CardHeader className="p-4 pb-2">
        {/* Question Title: Bold and same size as options */}
        <AutoResizeTextarea
          placeholder="Type your question here"
          value={question.text}
          onChange={(e) => onUpdate({ ...question, text: e.target.value })}
          rows={1}
          className="text-base font-bold w-full bg-transparent border-none focus-visible:ring-0 p-2 leading-normal"
        />
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-4">
        <div className="space-y-4">
          {question.type === "multiple-choice" && (
            <div className="space-y-2 pt-2">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center gap-2 group">
                  <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  <Input
                    placeholder="Option text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(option.id, e.target.value)
                    }
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
          )}

          {question.type === "short-answer" && (
            <Input
              placeholder="Short answer text..."
              readOnly
              className="text-base p-2 border-b-2 border-dotted rounded-none w-1/2 focus-visible:ring-0 bg-transparent"
            />
          )}

          {question.type === "paragraph" && (
            <Textarea
              placeholder="Long answer text..."
              readOnly
              className="text-base p-2 border-b-2 border-dotted rounded-none min-h-[40px] focus-visible:ring-0 bg-transparent resize-none"
            />
          )}
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <Select
            value={question.type}
            onValueChange={(value) =>
              onUpdate({ ...question, type: value as Question["type"] })
            }
          >
            <SelectTrigger className="w-full sm:w-[200px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice">
                <div className="flex items-center gap-2 text-sm">
                  <List className="h-4 w-4" /> Multiple choice
                </div>
              </SelectItem>
              <SelectItem value="short-answer">
                <div className="flex items-center gap-2 text-sm">
                  <TextCursorInput className="h-4 w-4" /> Short answer
                </div>
              </SelectItem>
              <SelectItem value="paragraph">
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4" /> Paragraph
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onDuplicate}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Duplicate</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>

            <Separator
              orientation="vertical"
              className="h-6 mx-2 hidden sm:block"
            />

            <div className="flex items-center gap-2">
              <Label
                htmlFor={`required-${question.id}`}
                className="font-medium text-xs sr-only"
              >
                Required
              </Label>
              <Switch
                id={`required-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) =>
                  onUpdate({ ...question, required: checked })
                }
              />
              <span className="font-medium text-xs">Required</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function FormBuilderPage() {
  const [title, setTitle] = useState("Form Title");
  const [description, setDescription] = useState(
    "This is a form description. Click to edit it."
  );
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: crypto.randomUUID(),
      text: "What is your primary reason for visiting today?",
      type: "multiple-choice",
      options: [
        { id: crypto.randomUUID(), text: "General Inquiry" },
        { id: crypto.randomUUID(), text: "Product Support" },
        { id: crypto.randomUUID(), text: "Feedback" },
      ],
      required: true,
    },
  ]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    questions[0]?.id || null
  );

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: "",
      type: "short-answer",
      options: [{ id: crypto.randomUUID(), text: "Option 1" }],
      required: false,
    };
    setQuestions([...questions, newQuestion]);
    setActiveQuestionId(newQuestion.id);
  };

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
    if (activeQuestionId === questionId) setActiveQuestionId(null);
  };

  const duplicateQuestion = (questionId: string) => {
    const questionToDuplicate = questions.find((q) => q.id === questionId);
    if (!questionToDuplicate) return;
    const newQuestion: Question = {
      ...questionToDuplicate,
      id: crypto.randomUUID(),
      options: questionToDuplicate.options.map((opt) => ({
        ...opt,
        id: crypto.randomUUID(),
      })),
    };
    const index = questions.findIndex((q) => q.id === questionId);
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    setQuestions(newQuestions);
    setActiveQuestionId(newQuestion.id);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen flex justify-center py-8 px-4 bg-white sm:bg-muted/40">
        <div className="w-full max-w-3xl space-y-8">
          <div className="space-y-3 text-center">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Form Title"
              className="!text-3xl sm:!text-4xl font-extrabold tracking-tight border-none p-0 focus-visible:ring-0 shadow-none h-auto bg-transparent leading-tight text-center"
            />

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Form description..."
              className="!text-sm sm:!text-base text-muted-foreground w-full border-none p-0 resize-none focus-visible:ring-0 shadow-none bg-transparent text-center"
              rows={2}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            {questions.map((q, index) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={index}
                onUpdate={updateQuestion}
                onDelete={() => deleteQuestion(q.id)}
                onDuplicate={() => duplicateQuestion(q.id)}
                isActive={activeQuestionId === q.id}
                onClick={() => setActiveQuestionId(q.id)}
              />
            ))}
          </div>

          <Button
            onClick={addQuestion}
            variant="outline"
            className="w-full border-dashed py-6 text-sm sm:text-base"
          >
            <Plus className="h-5 w-5 mr-2" /> Add New Question
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
