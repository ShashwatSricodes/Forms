// frontend/src/features/responses/ResponsesList.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFormResponses, deleteResponse } from "@/lib/api/responses";
import { getFormById } from "../../lib/api/form";
import type { Response, FormWithQuestions } from "../../types/form";

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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate("/forms")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
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
                    <p className="text-sm text-muted-foreground mb-2">
                      Submitted:{" "}
                      {new Date(response.submitted_at).toLocaleString()}
                    </p>
                    <div className="space-y-2">
                      {response.answers.slice(0, 2).map((answer) => (
                        <div key={answer.id}>
                          <p className="text-sm font-medium">
                            {answer.questions?.question_text}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {answer.answer_text ||
                              (answer.selected_options?.length
                                ? `${answer.selected_options.length} option(s) selected`
                                : "No answer")}
                          </p>
                        </div>
                      ))}
                      {response.answers.length > 2 && (
                        <p className="text-sm text-muted-foreground">
                          +{response.answers.length - 2} more answers
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/responses/${response.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
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
