// ============================================
// frontend/src/components/questions/PhoneInput.tsx
// ============================================
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  required,
  disabled,
}: PhoneInputProps) {
  return (
    <Input
      type="tel"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="+1 (555) 000-0000"
      required={required}
      disabled={disabled}
      className="w-full"
    />
  );
}
