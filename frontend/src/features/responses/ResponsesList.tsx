// frontend/src/features/responses/ResponsesList.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Trash2,
  FileText,
  Download,
  Star,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFormResponses, deleteResponse } from "@/lib/api/responses";
import { getFormById } from "../../lib/api/form";
import type { Response, FormWithQuestions } from "../../types/form";
import { getQuestionTypeLabel } from "@/lib/questionTypes";

export default function ResponsesList() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormWithQuestions | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formId) {
      loadData(formId);
    }
  }, [formId]);

  const loadData = async (id: string) => {
    try {
      const [formData, responsesData] = await Promise.all([
        getFormById(id),
        getFormResponses(id),
      ]);
      setForm(formData);
      setResponses(responsesData);
    } catch (error) {
      console.error("Failed to load data:", error);
      alert("Failed to load responses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (responseId: string) => {
    if (!confirm("Delete this response?")) return;

    try {
      await deleteResponse(responseId);
      setResponses(responses.filter((r) => r.id !== responseId));
    } catch (error) {
      console.error("Failed to delete response:", error);
      alert("Failed to delete response");
    }
  };

  const exportToCSV = () => {
    if (!form || responses.length === 0) return;

    // Create CSV header
    const headers = [
      "Submitted At",
      ...form.questions.map((q) => q.question_text),
    ];

    // Create CSV rows
    const rows = responses.map((response) => {
      const row = [new Date(response.submitted_at).toLocaleString()];

      form.questions.forEach((question) => {
        const answer = response.answers.find(
          (a) => a.question_id === question.id
        );

        if (!answer) {
          row.push("");
          return;
        }

        // Handle different answer types
        if (answer.file_url) {
          row.push(answer.file_name || "File uploaded");
        } else if (
          answer.selected_options &&
          answer.selected_options.length > 0
        ) {
          const optionTexts = answer.selected_options
            .map((optId) => {
              const option = question.options?.find((o) => o.id === optId);
              return option?.option_text || optId;
            })
            .join(", ");
          row.push(optionTexts);
        } else {
          row.push(answer.answer_text || "");
        }
      });

      return row;
    });

    // Combine headers and rows
    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${form.title}_responses.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderAnswerPreview = (answer: Response["answers"][0]) => {
    // File upload or signature
    if (answer.file_url) {
      return (
        <div className="flex items-center gap-2">
          <File className="h-4 w-4 text-primary" />
          <span className="text-sm">{answer.file_name || "File uploaded"}</span>
        </div>
      );
    }

    // Rating
    if (
      answer.questions?.question_type === "rating_5" ||
      answer.questions?.question_type === "rating_10"
    ) {
      const rating = parseInt(answer.answer_text || "0");
      if (answer.questions?.question_type === "rating_5") {
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        );
      } else {
        return (
          <Badge variant="outline" className="font-semibold">
            {rating}/10
          </Badge>
        );
      }
    }

    // Multiple choice options
    if (answer.selected_options && answer.selected_options.length > 0) {
      return (
        <span className="text-sm text-muted-foreground">
          {answer.selected_options.length} option(s) selected
        </span>
      );
    }

    // Text answer
    return (
      <p className="text-sm text-muted-foreground line-clamp-2">
        {answer.answer_text || "No answer"}
      </p>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading responses...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Form not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {responses.length > 0 && (
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
          <CardDescription>
            {responses.length} response{responses.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
      </Card>

      {responses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No responses yet</h3>
            <p className="text-muted-foreground">
              Responses will appear here once people submit your form
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {responses.map((response) => (
            <Card key={response.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      Submitted:{" "}
                      {new Date(response.submitted_at).toLocaleString()}
                    </p>
                    <div className="space-y-3">
                      {response.answers.slice(0, 3).map((answer) => (
                        <div
                          key={answer.id}
                          className="border-l-2 border-muted pl-3"
                        >
                          <p className="text-sm font-medium mb-1">
                            {answer.questions?.question_text}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {getQuestionTypeLabel(
                                answer.questions?.question_type || ""
                              )}
                            </Badge>
                            {renderAnswerPreview(answer)}
                          </div>
                        </div>
                      ))}
                      {response.answers.length > 3 && (
                        <p className="text-sm text-muted-foreground pl-3">
                          +{response.answers.length - 3} more answers
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/responses/${response.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Full
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(response.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
