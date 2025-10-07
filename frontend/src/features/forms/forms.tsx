"use client";

import { useState } from "react";
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

type Option = { id: string; text: string };
type Question = {
  id: string;
  text: string;
  type: "multiple-choice" | "short-answer" | "paragraph";
  options: Option[];
  required: boolean;
};

const getPlaceholderForType = (type: Question["type"]) => {
  switch (type) {
    case "short-answer":
      return "Short answer text...";
    case "paragraph":
      return "Long answer text...";
    case "multiple-choice":
      return "Select an option...";
    default:
      return "";
  }
};

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
        "cursor-pointer transition-all duration-300 border border-border bg-white shadow-sm",
        isActive && "border-primary"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <p className="font-medium text-lg text-muted-foreground">
          Question <span className="block sm:inline">{index + 1}</span>
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        <div className="space-y-4">
          <Input
            placeholder="Type your question here"
            value={question.text}
            onChange={(e) => onUpdate({ ...question, text: e.target.value })}
            className="p-5 h-auto text-lg lg:text-lg font-medium border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-300 bg-white shadow-sm hover:border-primary/50"
          />

          {question.type === "multiple-choice" && (
            <div className="space-y-2 pt-2">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center gap-2 group">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Option text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(option.id, e.target.value)
                    }
                    className="text-xl sm:text-lg p-2 sm:p-3"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(option.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                className="mt-2 text-muted-foreground"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Option
              </Button>
            </div>
          )}

          {question.type === "paragraph" && (
            <Textarea
              placeholder="Long answer text..."
              value={question.text}
              onChange={(e) => onUpdate({ ...question, text: e.target.value })}
              className="text-lg lg:text-base p-3 border-2 rounded-md min-h-[100px] focus:border-primary focus:ring-0"
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
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" /> Multiple choice
                </div>
              </SelectItem>
              <SelectItem value="short-answer">
                <div className="flex items-center gap-2">
                  <TextCursorInput className="h-4 w-4" /> Short answer
                </div>
              </SelectItem>
              <SelectItem value="paragraph">
                <div className="flex items-center gap-2">
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
                className="font-medium text-sm sr-only"
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
              <span className="font-medium text-sm">Required</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
          {/* Form Header */}
          <div className="space-y-3 text-center">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Form Title"
              className="!text-4xl sm:!text-3xl font-extrabold tracking-tight border-none p-0 focus-visible:ring-0 shadow-none h-auto bg-transparent leading-tight text-center"
            />

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Form description..."
              className="!text-base sm:!text-xl text-muted-foreground w-full border-none p-0 resize-none focus-visible:ring-0 shadow-none bg-transparent text-center"
              rows={2}
            />
          </div>

          <Separator />

          {/* Questions Section */}
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

          {/* Add Question Button */}
          <Button
            onClick={addQuestion}
            variant="outline"
            className="w-full border-dashed py-6"
          >
            <Plus className="h-5 w-5 mr-2" /> Add New Question
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
