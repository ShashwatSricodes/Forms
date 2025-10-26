// ============================================
// frontend/src/components/questions/SignatureInput.tsx
// ============================================
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Pen } from "lucide-react";

interface SignatureInputProps {
  value: string | null; // base64 data URL
  onChange: (value: string | null) => void;
  required?: boolean;
  disabled?: boolean;
}

export function SignatureInput({
  value,
  onChange,
  required,
  disabled,
}: SignatureInputProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (value && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, [value]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onChange(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="border-2 border-dashed rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearSignature}
          disabled={disabled}
        >
          <Eraser className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Pen className="h-4 w-4" />
          Sign above with your mouse
        </p>
      </div>
    </div>
  );
}
