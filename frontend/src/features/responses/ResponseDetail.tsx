// frontend/src/features/responses/ResponseDetail.tsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Download,
  Star,
  File,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { getResponseById } from "@/lib/api/responses"
import type { Response } from "@/types/form"
import { getQuestionTypeLabel } from "@/lib/questionTypes"

export default function ResponseDetail() {
  const { responseId } = useParams()
  const navigate = useNavigate()

  const [response, setResponse] = useState<Response | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (responseId) loadResponse(responseId)
  }, [responseId])

  const loadResponse = async (id: string) => {
    try {
      const data = await getResponseById(id)
      setResponse(data)
    } catch {
      alert("Failed to load response")
    } finally {
      setLoading(false)
    }
  }

  const renderAnswer = (answer: Response["answers"][0]) => {
    const type = answer.questions?.question_type

    if (type === "file_upload" && answer.file_url) {
      return (
        <div className="flex items-center gap-3 rounded-md border px-4 py-3">
          <File className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">{answer.file_name}</p>
            <p className="text-xs text-muted-foreground">
              {answer.file_size
                ? `${(answer.file_size / 1024).toFixed(1)} KB`
                : "Unknown size"}
            </p>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <a href={answer.file_url} target="_blank" rel="noreferrer">
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      )
    }

    if (type === "signature" && answer.file_url) {
      return (
        <div className="rounded-md border bg-background p-3">
          <img
            src={answer.file_url}
            alt="Signature"
            className="max-h-40"
          />
        </div>
      )
    }

    if (type === "rating_5") {
      const rating = Number(answer.answer_text || 0)
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating}/5
          </span>
        </div>
      )
    }

    if (type === "rating_10") {
      return (
        <p className="text-sm">
          <span className="font-medium">{answer.answer_text}</span>
          <span className="text-muted-foreground"> / 10</span>
        </p>
      )
    }

    if (type === "url" && answer.answer_text) {
      return (
        <a
          href={answer.answer_text}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
        >
          {answer.answer_text}
          <ExternalLink className="h-3 w-3" />
        </a>
      )
    }

    if (type === "email" && answer.answer_text) {
      return (
        <a
          href={`mailto:${answer.answer_text}`}
          className="text-sm text-primary hover:underline"
        >
          {answer.answer_text}
        </a>
      )
    }

    if (type === "phone" && answer.answer_text) {
      return (
        <a
          href={`tel:${answer.answer_text}`}
          className="text-sm text-primary hover:underline"
        >
          {answer.answer_text}
        </a>
      )
    }

    if (answer.selected_options?.length) {
      return (
        <div className="flex flex-wrap gap-2">
          {answer.selected_options.map((id) => (
            <Badge key={id} variant="secondary">
              {id}
            </Badge>
          ))}
        </div>
      )
    }

    if (answer.answer_text) {
      return (
        <p className="whitespace-pre-wrap text-sm">
          {answer.answer_text}
        </p>
      )
    }

    return <p className="text-sm text-muted-foreground">No answer</p>
  }

  if (loading) {
    return <div className="p-8 text-sm">Loading response…</div>
  }

  if (!response) {
    return <div className="p-8 text-sm">Response not found</div>
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          navigate(`/forms/${response.form_id}/responses`)
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
          <CardDescription>
            Submitted {new Date(response.submitted_at).toLocaleString()}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {response.answers.map((answer, index) => (
            <div key={answer.id} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium leading-snug">
                  {index + 1}. {answer.questions?.question_text}
                </p>
                <Badge variant="outline" className="text-xs">
                  {getQuestionTypeLabel(
                    answer.questions?.question_type || ""
                  )}
                </Badge>
              </div>

              {renderAnswer(answer)}

              {index !== response.answers.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
