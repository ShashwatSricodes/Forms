"use client";

import { useState } from "react";
import { Trash2, Copy, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// --- Type Definitions (no changes needed) ---
type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  text: string;
  type: 'multiple-choice' | 'short-answer' | 'paragraph';
  options: Option[];
  required: boolean;
};

// --- Refactored QuestionCard Component ---
const QuestionCard = ({ question, onUpdate, onDelete }: { question: Question; onUpdate: (q: Question) => void; onDelete: () => void; }) => {
  const handleOptionChange = (optionId: string, text: string) => {
    const updatedOptions = question.options.map(opt => opt.id === optionId ? { ...opt, text } : opt);
    onUpdate({ ...question, options: updatedOptions });
  };
  
  const addOption = () => {
    const newOption: Option = { id: crypto.randomUUID(), text: `New Option` };
    onUpdate({ ...question, options: [...question.options, newOption] });
  };

  const removeOption = (optionId: string) => {
    const updatedOptions = question.options.filter(opt => opt.id !== optionId);
    onUpdate({ ...question, options: updatedOptions });
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="grid gap-2 w-full">
            <Label htmlFor={`question-${question.id}`} className="font-semibold">Question Text</Label>
            <Input
              id={`question-${question.id}`}
              placeholder="e.g., What is your favorite color?"
              value={question.text}
              onChange={(e) => onUpdate({ ...question, text: e.target.value })}
              className="p-3 text-base"
            />
          </div>
          <div className="grid gap-2 w-[240px]">
             <Label className="font-semibold">Question Type</Label>
             <Select value={question.type} onValueChange={(value) => onUpdate({ ...question, type: value as Question['type'] })}>
              <SelectTrigger className="p-3 text-base"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">Multiple choice</SelectItem>
                <SelectItem value="short-answer">Short answer</SelectItem>
                <SelectItem value="paragraph">Paragraph</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {question.type === 'multiple-choice' && (
          <div className="space-y-3 pt-2">
            <Label className="font-semibold">Options</Label>
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <RadioGroupItem value={option.id} disabled />
                <Input
                  placeholder="Option text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  className="p-2 text-base"
                />
                <Button variant="ghost" size="icon" onClick={() => removeOption(option.id)}><X className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addOption} className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end items-center gap-4 bg-gray-50 py-3 px-6">
        <Button variant="ghost" size="icon"><Copy className="h-4 w-4 text-gray-500" /></Button>
        <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 className="h-4 w-4 text-red-500" /></Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <Label htmlFor={`required-${question.id}`} className="font-semibold text-sm">Required</Label>
          <Switch
            id={`required-${question.id}`}
            checked={question.required}
            onCheckedChange={(checked) => onUpdate({ ...question, required: checked })}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

// --- Refactored Main Page Component ---
export default function FormBuilderPage() {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: crypto.randomUUID(),
      text: "What is your name?",
      type: "short-answer",
      options: [],
      required: true,
    },
  ]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: "",
      type: "multiple-choice",
      options: [{ id: crypto.randomUUID(), text: "Option 1" }],
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };
  
  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8 mt-8 md:rounded-t-xl">
      <div className="max-w-4xl w-full space-y-8">
        {/* Main Title */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Form Builder
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Create and customize your form below.
          </p>
        </div>

        {/* Form Details Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-bold text-gray-900">Form Details</CardTitle>
              <Badge variant="outline" className="bg-gray-100">Step 1</Badge>
            </div>
            <p className="text-gray-600 pt-1">Start by giving your form a title and description.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="formTitle" className="text-base font-semibold">Form Title <span className="text-red-500">*</span></Label>
              <Input id="formTitle" placeholder="e.g., Customer Feedback Survey" value={title} onChange={(e) => setTitle(e.target.value)} className="p-3 text-base"/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="formDescription" className="text-base font-semibold">Form Description</Label>
              <Textarea id="formDescription" placeholder="Provide a brief description of your form." value={description} onChange={(e) => setDescription(e.target.value)} className="p-3 text-base"/>
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <div className="space-y-6">
          {questions.map((q, index) => (
             <QuestionCard key={q.id} question={q} onUpdate={updateQuestion} onDelete={() => deleteQuestion(q.id)} />
          ))}
        </div>
        
        {/* Add Question Button */}
        <div className="text-center">
            <Button onClick={addQuestion} size="lg">
                <Plus className="h-5 w-5 mr-2" /> Add Question
            </Button>
        </div>
      </div>
    </div>
  );
}