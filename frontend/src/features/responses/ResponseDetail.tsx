// frontend/src/features/responses/ResponseDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Star, File, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getResponseById } from "@/lib/api/responses";
import type { Response } from "@/types/form";
import { getQuestionTypeLabel } from "@/lib/questionTypes";

export default function ResponseDetail() {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (responseId) {
      loadResponse(responseId);
    }
  }, [responseId]);

  const loadResponse = async (id: string) => {
    try {
      const data = await getResponseById(id);
      setResponse(data);
    } catch (error) {
      console.error("Failed to load response:", error);
      alert("Failed to load response");
    } finally {
      setLoading(false);
    }
  };

  const renderAnswer = (answer: Response["answers"][0]) => {
    const questionType = answer.questions?.question_type;

    // File upload
    if (questionType === "file_upload" && answer.file_url) {
      return (
        <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
          <File className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="font-medium">{answer.file_name}</p>
            <p className="text-sm text-muted-foreground">
              {answer.file_size
                ? `${(answer.file_size / 1024).toFixed(1)} KB`
                : "Unknown size"}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={answer.file_url} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        </div>
      );
    }

    // Signature
    if (questionType === "signature" && answer.file_url) {
      return (
        <div className="border rounded-lg p-4 bg-white">
          <img
            src={answer.file_url}
            alt="Signature"
            className="max-w-full h-auto"
          />
        </div>
      );
    }

    // Rating - 5 stars
    if (questionType === "rating_5") {
      const rating = parseInt(answer.answer_text || "0");
      return (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-8 w-8 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-lg font-semibold">{rating}/5</span>
        </div>
      );
    }

    // Rating - 10 scale
    if (questionType === "rating_10") {
      const rating = parseInt(answer.answer_text || "0");
      return (
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div
              key={num}
              className={`w-10 h-10 rounded-lg border-2 font-semibold flex items-center justify-center ${
                num <= rating
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border"
              }`}
            >
              {num}
            </div>
          ))}
          <span className="ml-2 text-lg font-semibold">{rating}/10</span>
        </div>
      );
    }

    // URL
    if (questionType === "url" && answer.answer_text) {
      return (
        <a
          href={answer.answer_text}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:underline"
        >
          {answer.answer_text}
          <ExternalLink className="h-4 w-4" />
        </a>
      );
    }

    // Email
    if (questionType === "email" && answer.answer_text) {
      return (
        <a
          href={`mailto:${answer.answer_text}`}
          className="text-primary hover:underline"
        >
          {answer.answer_text}
        </a>
      );
    }

    // Phone
    if (questionType === "phone" && answer.answer_text) {
      return (
        <a
          href={`tel:${answer.answer_text}`}
          className="text-primary hover:underline"
        >
          {answer.answer_text}
        </a>
      );
    }

    // Multiple choice / checkboxes / dropdown with selected options
    if (answer.selected_options && answer.selected_options.length > 0) {
      // Note: In a real implementation, you'd need to fetch the question's options
      // to map the IDs to option texts. For now, we'll just show the IDs.
      return (
        <div className="flex flex-wrap gap-2">
          {answer.selected_options.map((optionId) => (
            <Badge key={optionId} variant="secondary">
              {optionId}
            </Badge>
          ))}
        </div>
      );
    }

    // Text answer (short_text, long_text, date, time)
    if (answer.answer_text) {
      return (
        <p className="text-base whitespace-pre-wrap">{answer.answer_text}</p>
      );
    }

    return <p className="text-muted-foreground">No answer provided</p>;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading response...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Response not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/forms/${response.form_id}/responses`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Responses
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Response Details</CardTitle>
          <CardDescription>
            Submitted on {new Date(response.submitted_at).toLocaleString()}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {response.answers.map((answer, index) => (
          <Card key={answer.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {index + 1}. {answer.questions?.question_text}
                  </CardTitle>
                </div>
                <Badge variant="outline">
                  {getQuestionTypeLabel(answer.questions?.question_type || "")}
                </Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">{renderAnswer(answer)}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
