// ./features/forms/components/AutoResizeTextarea.tsx

"use client";
import * as React from "react";
import { useRef, useLayoutEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef =
    (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

  useLayoutEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [props.value, textAreaRef]);

  return (
    <Textarea
      ref={textAreaRef}
      className={cn("resize-none overflow-hidden", className)}
      {...props}
    />
  );
});

AutoResizeTextarea.displayName = "AutoResizeTextarea";