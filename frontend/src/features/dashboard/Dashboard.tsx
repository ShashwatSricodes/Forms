"use client";
import Navbar from "./components/Navbar";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  Folder,
  MoreHorizontal,
  MoreVertical,
  Plus,
} from "lucide-react";
import { TemplateModal } from "./components/Popup";

// --- Type Definition ---
type Form = {
  id: number;
  title: string;
  responses: number;
};

// --- Reusable Form Card Component ---
function FormCard({ form }: { form: Form }) {
  const responseText =
    form.responses === 1 ? "1 response" : `${form.responses} responses`;

  return (
    <Card className="h-48 flex flex-col justify-between">
      <CardContent className="pt-6">
        <h3 className="font-semibold">{form.title}</h3>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <span>{form.responses === 0 ? "No responses" : responseText}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

// --- Main Dashboard Page ---
export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const forms: Form[] = [
    { id: 1, title: "My Form", responses: 0 },
    { id: 2, title: "My Form", responses: 1 },
    { id: 3, title: "Survey Form", responses: 3 },
    { id: 4, title: "Feedback Form", responses: 0 },
    { id: 5, title: "Registration Form", responses: 2 },
  ];

  return (
    <>
 
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-12 md:pt-16 mt-8">
        {/* Responsive header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          {/* Left buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" className="flex items-center gap-2">
              <Folder className="h-4 w-4" /> My Workspace{" "}
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="hidden sm:flex items-center gap-2">
              <Plus className="h-4 w-4" /> Invite Team
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Right actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search your forms..."
              className="w-full sm:w-64"
            />
            <Select defaultValue="newest">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Created (new → old)</SelectItem>
                <SelectItem value="oldest">Created (old → new)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Button>
          </div>
        </header>

        {/* Responsive grid of forms */}
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {forms.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      <TemplateModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
