// ============================================
// frontend/src/components/questions/RatingInput.tsx
// ============================================
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  scale: 5 | 10;
  required?: boolean;
  disabled?: boolean;
}

export function RatingInput({
  value,
  onChange,
  scale,
  required,
  disabled,
}: RatingInputProps) {
  if (scale === 5) {
    // Star rating (1-5)
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => !disabled && onChange(rating)}
            disabled={disabled}
            className={cn(
              "transition-all hover:scale-110",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Star
              className={cn(
                "h-8 w-8",
                rating <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    );
  }

  // Number scale (1-10)
  return (
    <div className="flex gap-2 flex-wrap">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => !disabled && onChange(rating)}
          disabled={disabled}
          className={cn(
            "w-10 h-10 rounded-lg border-2 font-semibold transition-all hover:scale-105",
            rating <= value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground border-border hover:border-primary",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {rating}
        </button>
      ))}
    </div>
  );
}
