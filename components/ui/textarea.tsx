import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  currentLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      maxLength = 500,
      currentLength,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const count =
      currentLength !== undefined
        ? currentLength
        : typeof value === "string"
        ? value.length
        : 0;

    const isNearLimit = count > maxLength * 0.9;
    const isOverLimit = count >= maxLength;

    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-medium uppercase tracking-wider text-[#9A9DA5]"
            >
              {label}
            </label>
          )}
          {maxLength && (
            <span
              className={cn(
                "text-xs px-2.5 py-0.5 rounded-md border font-mono transition-colors",
                isOverLimit
                  ? "bg-[#FF4D4D]/15 border-[#FF4D4D]/40 text-[#FF4D4D]"
                  : isNearLimit
                  ? "bg-[#FFB84D]/15 border-[#FFB84D]/40 text-[#FFB84D]"
                  : "bg-[#181B21] border-[#2A2D34] text-[#9A9DA5]"
              )}
            >
              {count} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          maxLength={maxLength}
          value={value}
          className={cn(
            "w-full min-h-[150px] p-4 rounded-xl bg-[#111318] text-[#F5F5F2] font-normal placeholder:text-[#9A9DA5]/40 border border-[#2A2D34] focus:outline-none focus:border-[#3D5CFF] focus:shadow-[0_0_25px_-5px_rgba(61,92,255,0.4)] transition-all duration-150 resize-y disabled:opacity-50 disabled:bg-[#08090B] leading-relaxed",
            error && "border-[#FF4D4D] focus:border-[#FF4D4D] shadow-[0_0_20px_-4px_rgba(255,77,77,0.4)]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-[#9A9DA5]/70">{hint}</p>
        )}
        {error && (
          <p className="text-xs font-medium text-[#FF4D4D] flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
