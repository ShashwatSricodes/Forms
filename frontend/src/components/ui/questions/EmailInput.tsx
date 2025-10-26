// frontend/src/components/questions/EmailInput.tsx
import { Input } from "@/components/ui/input";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function EmailInput({
  value,
  onChange,
  required,
  disabled,
}: EmailInputProps) {
  return (
    <Input
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="email@example.com"
      required={required}
      disabled={disabled}
      className="w-full"
    />
  );
}
