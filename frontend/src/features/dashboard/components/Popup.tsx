import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

// 1. Define the type for TemplateCard's props
type TemplateCardProps = {
  title: string;
  bgColor?: string; // '?' makes this prop optional
};

// 2. Apply the type to the function's parameters
function TemplateCard({ title, bgColor = 'bg-gray-100' }: TemplateCardProps) {
  const isBlank = title === "Blank Form";
  return (
    <div className="cursor-pointer group">
      <div className={`aspect-[4/3] rounded-md flex items-center justify-center transition-transform group-hover:scale-105 ${bgColor}`}>
        {isBlank && <Plus className="h-10 w-10 text-gray-400" />}
      </div>
      <p className="text-sm font-medium mt-2 text-center text-gray-700">{title}</p>
    </div>
  );
}

// 3. Define the type for TemplateModal's props
type TemplateModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

// 4. Apply the type to the function's parameters
export function TemplateModal({ isOpen, onOpenChange }: TemplateModalProps) {
  const templates = [
    { title: "Blank Form" },
    { title: "Job application template", bgColor: "bg-yellow-200" },
    { title: "Customer feedback form...", bgColor: "bg-blue-300" },
    { title: "Name + email signup template", bgColor: "bg-stone-200" },
    { title: "Two inputs Template", bgColor: "bg-lime-400" },
    { title: "Exit Survey Template", bgColor: "bg-amber-200" },
    { title: "Product Launch Survey...", bgColor: "bg-orange-300" },
    { title: "Contract Consulting Form...", bgColor: "bg-sky-200" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Select a template</DialogTitle>
          <div className="text-center">
            <a href="#" className="text-sm text-blue-600 hover:underline">...or import from Typeform</a>
          </div>
        </DialogHeader>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search over 500+ templates..." className="pl-9" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6 max-h-[60vh] overflow-y-auto pr-2">
          {templates.map((template) => (
            <TemplateCard key={template.title} title={template.title} bgColor={template.bgColor} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}