// frontend/src/features/forms/Form.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  Plus,
  ArrowLeft,
  Eye,
  Settings,
  Trash2,
  Copy,
  GripVertical,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  getFormById,
  updateForm,
  createForm,
  addQuestion,
} from "../../lib/api/form";
import type { FormWithQuestions, QuestionType } from "../../types/form";
import { questionTypeConfig } from "@/lib/questionTypes";

type LocalOption = { id: string; text: string };
type LocalQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  options: LocalOption[];
  required: boolean;
  rating_scale?: number;
  file_types?: string[];
  max_file_size?: number;
  isSaved?: boolean;
};

export default function Form() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!formId;

  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("Form description");
  const [isPublic, setIsPublic] = useState(true);
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (isEditMode && formId) loadForm(formId);
    else {
      // default question
      const defaultQ: LocalQuestion = {
        id: crypto.randomUUID(),
        text: "What is your primary reason for visiting today?",
        type: "multiple_choice",
        options: [
          { id: crypto.randomUUID(), text: "General Inquiry" },
          { id: crypto.randomUUID(), text: "Product Support" },
          { id: crypto.randomUUID(), text: "Feedback" },
        ],
        required: true,
      };
      setQuestions([defaultQ]);
      setActiveQuestionId(defaultQ.id);
    }
  }, [formId, isEditMode]);

  const loadForm = async (id: string) => {
    try {
      const data = await getFormById(id);
      setTitle(data.title);
      setDescription(data.description || "Form description");
      setIsPublic(data.is_public);
      const localQuestions: LocalQuestion[] = data.questions.map((q) => ({
        id: q.id,
        text: q.question_text,
        type: q.question_type,
        options:
          q.options?.map((opt) => ({
            id: opt.id,
            text: opt.option_text,
          })) || [],
        required: q.is_required,
        rating_scale: q.rating_scale,
        file_types: q.file_types,
        max_file_size: q.max_file_size,
      }));
      setQuestions(localQuestions);
      setActiveQuestionId(localQuestions[0]?.id || null);
    } catch (error) {
      console.error("Failed to load form:", error);
      alert("Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  const addQuestionHandler = () => {
    const newQuestion: LocalQuestion = {
      id: crypto.randomUUID(),
      text: "",
      type: "short_text",
      options: [{ id: crypto.randomUUID(), text: "Option 1" }],
      required: false,
    };
    setQuestions([...questions, newQuestion]);
    setActiveQuestionId(newQuestion.id);
  };

  const updateQuestion = (updatedQuestion: LocalQuestion) => {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  const duplicateQuestion = (questionId: string) => {
    const questionToDuplicate = questions.find((q) => q.id === questionId);
    if (!questionToDuplicate) return;
    const newQuestion: LocalQuestion = {
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

  const handleDeleteQuestion = (id: string) => {
    if (confirm("Delete this question?")) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleSaveForm = async () => {
    if (!title.trim()) {
      alert("Please enter a form title");
      return;
    }

    setSaving(true);
    try {
      let currentFormId = formId;

      if (!isEditMode) {
        const newForm = await createForm(title, description);
        currentFormId = newForm.id;
        if (isPublic !== undefined) {
          await updateForm(currentFormId, {
            title,
            description,
            is_public: isPublic,
          });
        }
      } else {
        await updateForm(formId!, {
          title,
          description,
          is_public: isPublic,
        });
      }

      if (currentFormId) {
        for (const q of questions) {
          if (!q.text.trim()) continue;

          const questionData: any = {
            question_text: q.text,
            question_type: q.type,
            is_required: q.required,
          };

          // Add options for choice-based questions
          if (
            ["multiple_choice", "checkboxes", "dropdown"].includes(q.type) &&
            q.options.length > 0
          ) {
            questionData.options = q.options.map((o) => o.text);
          }

          // Add rating scale for rating questions
          if (q.type === "rating_5" || q.type === "rating_10") {
            questionData.rating_scale =
              q.rating_scale || (q.type === "rating_5" ? 5 : 10);
          }

          // Add file constraints for file upload
          if (q.type === "file_upload") {
            questionData.file_types = q.file_types || [
              "pdf",
              "jpg",
              "png",
              "docx",
            ];
            questionData.max_file_size = q.max_file_size || 5242880;
          }

          await addQuestion(currentFormId, questionData);
        }
      }

      alert(
        `Form saved successfully! Status: ${isPublic ? "Public" : "Private"}`
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save form:", error);
      alert("Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!title.trim()) {
      alert("Please enter a form title");
      return;
    }

    try {
      if (isEditMode && formId) {
        await updateForm(formId, {
          title,
          description,
          is_public: isPublic,
        });
        alert("Settings saved successfully!");
      }
      setSettingsOpen(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <TooltipProvider>
      <div className="min-h-screen flex justify-center py-8 px-4 bg-white sm:bg-muted/40">
        <div className="w-full max-w-3xl space-y-8">
          {/* Top Bar */}
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <div className="flex gap-2">
              {isEditMode && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/form/${formId}`)}
                >
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
              )}
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Form Settings</DialogTitle>
                  </DialogHeader>
                  <Card className="border bg-white shadow-sm mt-4">
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="form-title">Form Title</Label>
                        <Input
                          id="form-title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Form title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form-description">Description</Label>
                        <Textarea
                          id="form-description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Form description"
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="is-public"
                          checked={isPublic}
                          onCheckedChange={setIsPublic}
                        />
                        <Label htmlFor="is-public">
                          Make form public {isPublic ? "(Public)" : "(Private)"}
                        </Label>
                      </div>
                      {isEditMode && (
                        <Button onClick={handleSaveSettings} className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Save Settings
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3 text-center">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Form Title"
              className="!text-4xl font-extrabold border-none text-center bg-transparent focus-visible:ring-0"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Form description..."
              className="!text-lg border-none text-center bg-transparent focus-visible:ring-0 resize-none"
              rows={2}
            />
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            {questions.map((q, index) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={index}
                onUpdate={updateQuestion}
                onDelete={() => handleDeleteQuestion(q.id)}
                onDuplicate={() => duplicateQuestion(q.id)}
                isActive={activeQuestionId === q.id}
                onClick={() => setActiveQuestionId(q.id)}
              />
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <Button
              onClick={addQuestionHandler}
              variant="outline"
              className="flex-1 border-dashed py-5"
            >
              <Plus className="h-5 w-5 mr-2" /> Add Question
            </Button>

            <Button
              onClick={handleSaveForm}
              className="flex-1 py-5"
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Form"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Current status: {isPublic ? "Public" : "Private"}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

/* QUESTION CARD */
function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  isActive,
  onClick,
}: {
  question: LocalQuestion;
  index: number;
  onUpdate: (q: LocalQuestion) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isActive: boolean;
  onClick: () => void;
}) {
  const handleOptionChange = (id: string, text: string) => {
    onUpdate({
      ...question,
      options: question.options.map((o) => (o.id === id ? { ...o, text } : o)),
    });
  };

  const addOption = () => {
    onUpdate({
      ...question,
      options: [
        ...question.options,
        {
          id: crypto.randomUUID(),
          text: `Option ${question.options.length + 1}`,
        },
      ],
    });
  };

  const removeOption = (id: string) => {
    onUpdate({
      ...question,
      options: question.options.filter((o) => o.id !== id),
    });
  };

  const needsOptions = ["multiple_choice", "checkboxes", "dropdown"].includes(
    question.type
  );
  const isRating =
    question.type === "rating_5" || question.type === "rating_10";
  const isFileUpload = question.type === "file_upload";

  return (
    <Card
      onClick={onClick}
      className={cn(
        "transition-all duration-300 border bg-white shadow-sm",
        isActive ? "border-primary" : "border-border"
      )}
    >
      <CardHeader className="flex justify-between items-center p-4">
        <p className="font-semibold text-lg">Question {index + 1}</p>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <Input
          placeholder="Type your question here"
          value={question.text}
          onChange={(e) => onUpdate({ ...question, text: e.target.value })}
          className="p-4 text-lg border-2 border-gray-200 focus:border-primary rounded-xl"
        />

        {/* Options for choice-based questions */}
        {needsOptions && (
          <div className="space-y-2">
            {question.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2 group">
                <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                <Input
                  value={opt.text}
                  onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                  className="bg-gray-50 border border-gray-200 focus:border-primary rounded-lg transition"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(opt.id)}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addOption}>
              <Plus className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>
        )}

        {/* Preview for simple input types */}
        {question.type === "short_text" && (
          <Input placeholder="Short answer text..." readOnly />
        )}
        {question.type === "long_text" && (
          <Textarea placeholder="Long answer text..." readOnly rows={3} />
        )}
        {question.type === "email" && (
          <Input type="email" placeholder="email@example.com" readOnly />
        )}
        {question.type === "phone" && (
          <Input type="tel" placeholder="+1 (555) 000-0000" readOnly />
        )}
        {question.type === "url" && (
          <Input type="url" placeholder="https://example.com" readOnly />
        )}
        {question.type === "date" && <Input type="date" readOnly />}
        {question.type === "time" && <Input type="time" readOnly />}

        {/* Rating scale selector */}
        {isRating && (
          <div className="space-y-2">
            <Label>Rating Scale</Label>
            <Select
              value={
                question.rating_scale?.toString() ||
                (question.type === "rating_5" ? "5" : "10")
              }
              onValueChange={(v) =>
                onUpdate({ ...question, rating_scale: parseInt(v) })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {question.type === "rating_5" && (
                  <SelectItem value="5">1-5 Stars</SelectItem>
                )}
                {question.type === "rating_10" && (
                  <SelectItem value="10">1-10 Scale</SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {question.type === "rating_5"
                ? "⭐⭐⭐⭐⭐"
                : "1 2 3 4 5 6 7 8 9 10"}
            </p>
          </div>
        )}

        {/* File upload settings */}
        {isFileUpload && (
          <div className="space-y-3">
            <div>
              <Label>Allowed File Types</Label>
              <Input
                value={(
                  question.file_types || ["pdf", "jpg", "png", "docx"]
                ).join(", ")}
                onChange={(e) =>
                  onUpdate({
                    ...question,
                    file_types: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
                placeholder="pdf, jpg, png, docx"
              />
            </div>
            <div>
              <Label>Max File Size (MB)</Label>
              <Input
                type="number"
                value={(question.max_file_size || 5242880) / 1048576}
                onChange={(e) =>
                  onUpdate({
                    ...question,
                    max_file_size: parseFloat(e.target.value) * 1048576,
                  })
                }
              />
            </div>
          </div>
        )}

        {question.type === "signature" && (
          <div className="border-2 border-dashed rounded-lg p-4 text-center text-muted-foreground">
            Signature pad will appear here
          </div>
        )}

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Select
            value={question.type}
            onValueChange={(v) =>
              onUpdate({
                ...question,
                type: v as QuestionType,
                options: ["multiple_choice", "checkboxes", "dropdown"].includes(
                  v
                )
                  ? question.options
                  : [],
              })
            }
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(questionTypeConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {config.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onDuplicate}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2">
              <Switch
                id={`required-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) =>
                  onUpdate({ ...question, required: checked })
                }
              />
              <Label className="text-sm">Required</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
