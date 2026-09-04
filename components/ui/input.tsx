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
            className="block text-xs font-medium uppercase tracking-wider text-[#9A9DA5]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "w-full h-11 px-4 rounded-lg bg-[#111318] text-[#F5F5F2] font-normal placeholder:text-[#9A9DA5]/40 border border-[#2A2D34] focus:outline-none focus:border-[#3D5CFF] focus:shadow-[0_0_20px_-4px_rgba(61,92,255,0.4)] transition-all duration-150 disabled:opacity-50 disabled:bg-[#08090B]",
            error && "border-[#FF4D4D] focus:border-[#FF4D4D] focus:shadow-[0_0_20px_-4px_rgba(255,77,77,0.4)]",
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

Input.displayName = "Input";
