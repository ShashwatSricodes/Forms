// ============================================
// frontend/src/components/questions/FileUploadInput.tsx
// ============================================
import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadInputProps {
  value: File | null;
  onChange: (file: File | null) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  required?: boolean;
  disabled?: boolean;
}

export function FileUploadInput({
  value,
  onChange,
  acceptedTypes = ["pdf", "jpg", "png", "docx"],
  maxSize = 5242880, // 5MB
  required,
  disabled,
}: FileUploadInputProps) {
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(
        `File size must be less than ${(maxSize / 1048576).toFixed(1)}MB`
      );
      return;
    }

    // Validate file type
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (fileExt && !acceptedTypes.includes(fileExt)) {
      setError(`Only ${acceptedTypes.join(", ")} files are allowed`);
      return;
    }

    setError("");
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    setError("");
  };

  return (
    <div className="w-full">
      {!value ? (
        <label
          className={cn(
            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-muted-foreground">
              {acceptedTypes.join(", ").toUpperCase()} (max{" "}
              {(maxSize / 1048576).toFixed(1)}MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedTypes.map((t) => `.${t}`).join(",")}
            required={required}
            disabled={disabled}
          />
        </label>
      ) : (
        <div className="flex items-center gap-3 p-4 border-2 rounded-lg bg-muted/50">
          <File className="h-8 w-8 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {(value.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
