// frontend/src/features/responses/ResponsesList.tsx
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Download,
  Eye,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import { getFormById } from "@/lib/api/form"
import { getFormResponses, deleteResponse } from "@/lib/api/responses"
import type { FormWithQuestions, Response } from "@/types/form"

export default function ResponsesList() {
  const { formId } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormWithQuestions | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!formId) return

    Promise.all([getFormById(formId), getFormResponses(formId)])
      .then(([formData, responsesData]) => {
        setForm(formData)
        setResponses(responsesData)
      })
      .finally(() => setLoading(false))
  }, [formId])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this response?")) return
    await deleteResponse(id)
    setResponses((prev) => prev.filter((r) => r.id !== id))
  }

  const exportToCSV = () => {
    if (!form || responses.length === 0) return

    const headers = [
      "Submitted At",
      ...form.questions.map((q) => q.question_text),
    ]

    const rows = responses.map((r) => {
      const row = [new Date(r.submitted_at).toLocaleString()]
      form.questions.forEach((q) => {
        const ans = r.answers.find((a) => a.question_id === q.id)
        row.push(ans?.answer_text || "")
      })
      return row
    })

    const csv = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${form.title}_responses.csv`
    link.click()
  }

  if (loading) return <div className="p-8">Loading…</div>
  if (!form) return <div className="p-8">Form not found</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dashboard
        </Button>

        <Button variant="outline" onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">{form.title}</h1>
        <p className="text-sm text-muted-foreground">
          {responses.length} response{responses.length !== 1 && "s"}
        </p>
      </div>

      {/* Table */}
      <Card className="border-border/60">
        <CardHeader className="pb-2" />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  {form.questions.map((q) => (
                    <TableHead
                      key={q.id}
                      className="whitespace-nowrap font-medium"
                    >
                      {q.question_text}
                    </TableHead>
                  ))}
                  <TableHead className="whitespace-nowrap">
                    Submitted
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {responses.map((response) => (
                  <TableRow
                    key={response.id}
                    className="hover:bg-muted/30"
                  >
                    {form.questions.map((q) => {
                      const ans = response.answers.find(
                        (a) => a.question_id === q.id
                      )
                      return (
                        <TableCell
                          key={q.id}
                          className="py-4 align-top"
                        >
                          <div className="max-w-xs truncate">
                            {ans?.answer_text || "—"}
                          </div>
                        </TableCell>
                      )
                    })}

                    <TableCell className="py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(
                        response.submitted_at
                      ).toLocaleString()}
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            navigate(`/responses/${response.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(response.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
