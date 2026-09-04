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
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-black uppercase tracking-wider text-[#111111]"
            >
              {label}
            </label>
          )}
          {maxLength && (
            <span
              className={cn(
                "text-xs font-bold px-2 py-0.5 rounded-[4px] border-[2px] border-[#111111]",
                isOverLimit
                  ? "bg-[#FF6B9A] text-[#111111]"
                  : isNearLimit
                  ? "bg-[#FFD84D] text-[#111111]"
                  : "bg-[#FFFFFF] text-[#111111]/70"
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
            "w-full min-h-[140px] p-4 rounded-[6px] bg-[#FFFFFF] text-[#111111] font-medium placeholder:text-[#111111]/40 border-[3px] border-[#111111] shadow-[3px_3px_0_#111111] focus:outline-none focus:border-[#5B7CFF] focus:shadow-[5px_5px_0_#111111] transition-all duration-120 resize-y disabled:opacity-60 disabled:bg-[#ECE6D8]",
            error && "border-[#FF6B9A] focus:border-[#FF6B9A] shadow-[3px_3px_0_#FF6B9A]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs font-medium text-[#111111]/70">{hint}</p>
        )}
        {error && (
          <p className="text-xs font-bold text-[#FF6B9A] flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
