import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFormById } from "@/lib/api/form";
import { submitResponse } from "@/lib/api/responses";
import type { FormWithQuestions, Answer } from "@/types/form";

export default function PublicForm() {
  const { formId } = useParams();
  const [form, setForm] = useState<FormWithQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (formId) {
      loadForm(formId);
    }
  }, [formId]);

  const loadForm = async (id: string) => {
    try {
      const data = await getFormById(id);

      if (!data.is_public) {
        alert("This form is not public");
        return;
      }

      setForm(data);
    } catch (error) {
      console.error("Failed to load form:", error);
      alert("Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleCheckboxChange = (
    questionId: string,
    optionId: string,
    checked: boolean
  ) => {
    const currentAnswers = answers[questionId] || [];
    if (checked) {
      setAnswers({ ...answers, [questionId]: [...currentAnswers, optionId] });
    } else {
      setAnswers({
        ...answers,
        [questionId]: currentAnswers.filter((id: string) => id !== optionId),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form || !formId) return;

    const missingRequired = form.questions.filter(
      (q) => q.is_required && !answers[q.id]
    );

    if (missingRequired.length > 0) {
      alert("Please answer all required questions");
      return;
    }

    const formattedAnswers: Answer[] = form.questions.map((question) => {
      const answer = answers[question.id];

      if (["multiple_choice", "dropdown"].includes(question.question_type)) {
        return {
          question_id: question.id,
          selected_options: [answer],
        };
      } else if (question.question_type === "checkboxes") {
        return {
          question_id: question.id,
          selected_options: answer || [],
        };
      } else {
        return {
          question_id: question.id,
          answer_text: answer || "",
        };
      }
    });

    setSubmitting(true);
    try {
      await submitResponse(formId, formattedAnswers);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit response:", error);
      alert("Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading form...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Form not found</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground">
              Your response has been recorded successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{form.title}</CardTitle>
            {form.description && (
              <CardDescription className="text-base mt-2">
                {form.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit}>
          {form.questions.map((question, index) => (
            <Card key={question.id} className="mb-4">
              <CardContent className="pt-6">
                <Label className="text-base font-semibold mb-4 block">
                  {index + 1}. {question.question_text}
                  {question.is_required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>

                {question.question_type === "short_text" && (
                  <Input
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    required={question.is_required}
                  />
                )}

                {question.question_type === "long_text" && (
                  <Textarea
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    required={question.is_required}
                    rows={4}
                  />
                )}

                {question.question_type === "multiple_choice" && (
                  <RadioGroup
                    value={answers[question.id]}
                    onValueChange={(value) =>
                      handleAnswerChange(question.id, value)
                    }
                    required={question.is_required}
                  >
                    {question.options?.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label
                          htmlFor={option.id}
                          className="font-normal cursor-pointer"
                        >
                          {option.option_text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.question_type === "checkboxes" && (
                  <div className="space-y-2">
                    {question.options?.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={option.id}
                          checked={(answers[question.id] || []).includes(
                            option.id
                          )}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              question.id,
                              option.id,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={option.id}
                          className="font-normal cursor-pointer"
                        >
                          {option.option_text}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {question.question_type === "dropdown" && (
                  <Select
                    value={answers[question.id]}
                    onValueChange={(value) =>
                      handleAnswerChange(question.id, value)
                    }
                    required={question.is_required}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options?.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.option_text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {question.question_type === "date" && (
                  <Input
                    type="date"
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    required={question.is_required}
                  />
                )}

                {question.question_type === "time" && (
                  <Input
                    type="time"
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    required={question.is_required}
                  />
                )}
              </CardContent>
            </Card>
          ))}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
