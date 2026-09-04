import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "white" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold tracking-wide uppercase transition-all duration-150 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:outline-none focus-visible:ring-3 focus-visible:ring-black";

    const variantStyles = {
      primary:
        "bg-[#5B7CFF] text-[#111111] border-[3px] border-[#111111] shadow-[5px_5px_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#111111] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
      secondary:
        "bg-[#FFD84D] text-[#111111] border-[3px] border-[#111111] shadow-[5px_5px_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#111111] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
      accent:
        "bg-[#8ED081] text-[#111111] border-[3px] border-[#111111] shadow-[5px_5px_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#111111] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
      danger:
        "bg-[#FF6B9A] text-[#111111] border-[3px] border-[#111111] shadow-[5px_5px_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#111111] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
      white:
        "bg-[#FFFFFF] text-[#111111] border-[3px] border-[#111111] shadow-[5px_5px_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#111111] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
      outline:
        "bg-transparent text-[#111111] border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] hover:bg-[#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#111111] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
      ghost:
        "bg-transparent text-[#111111] border-none shadow-none hover:bg-[#111111]/10 active:translate-y-[1px]",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs rounded-[6px] gap-1.5",
      md: "h-11 px-5 text-sm rounded-[6px] gap-2",
      lg: "h-14 px-7 text-base rounded-[6px] gap-2.5",
      icon: "h-11 w-11 p-0 rounded-[6px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
