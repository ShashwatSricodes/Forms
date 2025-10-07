// ./features/forms/forms.tsx

"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QuestionCard } from "./components/QuestionCard";
import type { Question } from "./types";

export default function FormsPage() {
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

  // ## MODIFIED FUNCTION ##
  const handleCreateForm = async () => {
    const payload = { title, description, questions };

    // 1. Get the authentication token.
    // IMPORTANT: Replace this with your actual method of getting the token
    // (e.g., from cookies, context, or a state management library).
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("❌ You are not logged in. Please log in to create a form.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 2. Add the Authorization header to send the token to the backend.
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create form");
      }
      
      alert("✅ Form created successfully!");
    } catch (err) {
      console.error(err);
      alert(`❌ ${(err as Error).message}`);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen flex justify-center py-8 px-4 bg-white">
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
            {questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onUpdate={updateQuestion}
                onDelete={() => deleteQuestion(q.id)}
                onDuplicate={() => duplicateQuestion(q.id)}
                isActive={activeQuestionId === q.id}
                onClick={() => setActiveQuestionId(q.id)}
              />
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 pt-4">
            <Button
              onClick={addQuestion}
              variant="outline"
              className="w-full sm:w-auto border-dashed text-sm sm:text-base"
            >
              <Plus className="h-5 w-5 mr-2" /> Add New Question
            </Button>

            <Button
              onClick={handleCreateForm}
              className="w-full sm:w-auto bg-[#474747] text-white hover:bg-[#3a3a3a] text-base rounded-lg transition-colors"
            >
              Create Form
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}