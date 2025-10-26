// ============================================
// frontend/src/components/questions/UrlInput.tsx
// ============================================
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function UrlInput({
  value,
  onChange,
  required,
  disabled,
}: UrlInputProps) {
  return (
    <div className="relative">
      <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com"
        required={required}
        disabled={disabled}
        className="w-full pl-10"
      />
    </div>
  );
}
