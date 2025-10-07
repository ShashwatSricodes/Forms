// ./features/forms/components/QuestionCard.tsx

"use client";
import {
  Trash2, Copy, MessageSquare, TextCursorInput, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AutoResizeTextarea } from "./AutoResizeTextarea";
import { QuestionOptions } from "./QuestionOptions";
import type { Question } from "../types";

type QuestionCardProps = {
  question: Question;
  onUpdate: (q: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isActive: boolean;
  onClick: () => void;
};

export function QuestionCard({
  question, onUpdate, onDelete, onDuplicate, isActive, onClick
}: QuestionCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-300 border bg-white",
        isActive ? "border-primary" : "border-border"
      )}
    >
      <CardHeader className="p-4 pb-2">
        <AutoResizeTextarea
          placeholder="Type your question here"
          value={question.text}
          onChange={(e) => onUpdate({ ...question, text: e.target.value })}
          rows={1}
          className="text-base font-bold w-full bg-transparent border-none focus-visible:ring-0 p-2 leading-normal"
        />
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-4">
        <div className="space-y-4">
          {question.type === "multiple-choice" && (
            <QuestionOptions question={question} onUpdate={onUpdate} />
          )}
          {question.type === "short-answer" && (
            <Input
              placeholder="Short answer text..."
              readOnly
              className="text-base p-2 border-b-2 border-dotted rounded-none w-1/2 focus-visible:ring-0 bg-transparent"
            />
          )}
          {question.type === "paragraph" && (
            <Textarea
              placeholder="Long answer text..."
              readOnly
              className="text-base p-2 border-b-2 border-dotted rounded-none min-h-[40px] focus-visible:ring-0 bg-transparent resize-none"
            />
          )}
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <Select
            value={question.type}
            onValueChange={(value) => onUpdate({ ...question, type: value as Question["type"] })}
          >
            <SelectTrigger className="w-full sm:w-[200px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice"><div className="flex items-center gap-2 text-sm"><List className="h-4 w-4" /> Multiple choice</div></SelectItem>
              <SelectItem value="short-answer"><div className="flex items-center gap-2 text-sm"><TextCursorInput className="h-4 w-4" /> Short answer</div></SelectItem>
              <SelectItem value="paragraph"><div className="flex items-center gap-2 text-sm"><MessageSquare className="h-4 w-4" /> Paragraph</div></SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 flex-wrap">
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={onDuplicate}><Copy className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Duplicate</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button></TooltipTrigger><TooltipContent><p>Delete</p></TooltipContent></Tooltip>
            <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Label htmlFor={`required-${question.id}`} className="font-medium text-xs sr-only">Required</Label>
              <Switch id={`required-${question.id}`} checked={question.required} onCheckedChange={(checked) => onUpdate({ ...question, required: checked })} />
              <span className="font-medium text-xs">Required</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}