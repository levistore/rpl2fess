import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-black uppercase tracking-wider text-[#111111]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "w-full h-12 px-4 rounded-[6px] bg-[#FFFFFF] text-[#111111] font-medium placeholder:text-[#111111]/40 border-[3px] border-[#111111] shadow-[3px_3px_0_#111111] focus:outline-none focus:border-[#5B7CFF] focus:shadow-[5px_5px_0_#111111] transition-all duration-120 disabled:opacity-60 disabled:bg-[#ECE6D8]",
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

Input.displayName = "Input";
