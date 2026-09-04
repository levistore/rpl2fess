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
      "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D5CFF] active:scale-[0.97]";

    const variantStyles = {
      primary:
        "bg-[#3D5CFF] text-[#F5F5F2] border border-[#536DFF]/50 shadow-[0_2px_10px_rgba(61,92,255,0.3)] hover:bg-[#536DFF] hover:shadow-[0_0_20px_-3px_rgba(61,92,255,0.6)]",
      secondary:
        "bg-[#181B21] text-[#F5F5F2] border border-[#2A2D34] hover:bg-[#1E222A] hover:border-[#3E424C]",
      outline:
        "bg-transparent text-[#F5F5F2] border border-[#2A2D34] hover:bg-[#181B21] hover:border-[#3E424C]",
      accent:
        "bg-[#3D5CFF]/10 text-[#7B8DFF] border border-[#3D5CFF]/30 hover:bg-[#3D5CFF]/20",
      white:
        "bg-[#F5F5F2] text-[#08090B] font-semibold hover:bg-white hover:shadow-[0_2px_10px_rgba(255,255,255,0.15)]",
      danger:
        "bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30 hover:bg-[#FF4D4D]/25",
      ghost:
        "bg-transparent text-[#9A9DA5] hover:text-[#F5F5F2] hover:bg-white/5",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-lg gap-2",
      lg: "h-13 px-6 text-sm sm:text-base rounded-xl gap-2.5 font-semibold",
      icon: "h-9 w-9 p-0 rounded-lg",
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
