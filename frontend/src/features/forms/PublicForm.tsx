// frontend/src/features/forms/PublicForm.tsx
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
import { submitResponse, fileToBase64 } from "@/lib/api/responses";
import type { FormWithQuestions, Answer } from "@/types/form";

// Import new question components
import { EmailInput } from "@/components/ui/questions/EmailInput";
import { PhoneInput } from "@/components/ui/questions/PhoneInput";
import { UrlInput } from "@/components/ui/questions/UrlInput";
import { RatingInput } from "@/components/ui/questions/RatingInput";
import { FileUploadInput } from "@/components/ui/questions/FileUploadInput";
import { SignatureInput } from "@/components/ui/questions/SignatureInput";

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

    const formattedAnswers: Answer[] = await Promise.all(
      form.questions.map(async (question) => {
        const answer = answers[question.id];

        // Handle file uploads (file_upload and signature)
        if (
          question.question_type === "file_upload" &&
          answer instanceof File
        ) {
          const base64Content = await fileToBase64(answer);
          return {
            question_id: question.id,
            file_data: {
              name: answer.name,
              type: answer.type,
              content: base64Content,
            },
            question_type: question.question_type,
          };
        }

        if (question.question_type === "signature" && answer) {
          // Signature is already a base64 data URL, extract the base64 part
          const base64Content = answer.split(",")[1];
          return {
            question_id: question.id,
            file_data: {
              name: `signature_${question.id}.png`,
              type: "image/png",
              content: base64Content,
            },
            question_type: question.question_type,
          };
        }

        // Handle rating questions
        if (
          (question.question_type === "rating_5" ||
            question.question_type === "rating_10") &&
          answer
        ) {
          return {
            question_id: question.id,
            answer_text: answer.toString(),
          };
        }

        // Handle multiple choice and dropdown
        if (
          ["multiple_choice", "dropdown"].includes(question.question_type) &&
          answer
        ) {
          return {
            question_id: question.id,
            selected_options: [answer],
          };
        }

        // Handle checkboxes
        if (question.question_type === "checkboxes" && answer) {
          return {
            question_id: question.id,
            selected_options: answer || [],
          };
        }

        // Handle all text-based inputs (short_text, long_text, email, phone, url, date, time)
        return {
          question_id: question.id,
          answer_text: answer || "",
        };
      })
    );

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

                {/* Short Text */}
                {question.question_type === "short_text" && (
                  <Input
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    required={question.is_required}
                  />
                )}

                {/* Long Text */}
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

                {/* Email */}
                {question.question_type === "email" && (
                  <EmailInput
                    value={answers[question.id] || ""}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                    required={question.is_required}
                  />
                )}

                {/* Phone */}
                {question.question_type === "phone" && (
                  <PhoneInput
                    value={answers[question.id] || ""}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                    required={question.is_required}
                  />
                )}

                {/* URL */}
                {question.question_type === "url" && (
                  <UrlInput
                    value={answers[question.id] || ""}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                    required={question.is_required}
                  />
                )}

                {/* Multiple Choice */}
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

                {/* Checkboxes */}
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

                {/* Dropdown */}
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

                {/* Date */}
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

                {/* Time */}
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

                {/* Rating - 5 stars */}
                {question.question_type === "rating_5" && (
                  <RatingInput
                    value={answers[question.id] || 0}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                    scale={5}
                    required={question.is_required}
                  />
                )}

                {/* Rating - 10 scale */}
                {question.question_type === "rating_10" && (
                  <RatingInput
                    value={answers[question.id] || 0}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                    scale={10}
                    required={question.is_required}
                  />
                )}

                {/* File Upload */}
                {question.question_type === "file_upload" && (
                  <FileUploadInput
                    value={answers[question.id] || null}
                    onChange={(file) => handleAnswerChange(question.id, file)}
                    acceptedTypes={
                      question.file_types || ["pdf", "jpg", "png", "docx"]
                    }
                    maxSize={question.max_file_size || 5242880}
                    required={question.is_required}
                  />
                )}

                {/* Signature */}
                {question.question_type === "signature" && (
                  <SignatureInput
                    value={answers[question.id] || null}
                    onChange={(signature) =>
                      handleAnswerChange(question.id, signature)
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
