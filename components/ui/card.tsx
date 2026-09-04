import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "surface" | "surface-secondary" | "surface-elevated" | "white" | "paper" | "yellow" | "blue" | "pink" | "green";
  shadow?: "none" | "sm" | "md" | "lg";
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "surface",
      shadow = "md",
      hoverEffect = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      surface: "bg-[#111318] text-[#F5F5F2] border border-[#2A2D34]",
      "surface-secondary": "bg-[#181B21] text-[#F5F5F2] border border-[#2A2D34]",
      "surface-elevated": "bg-[#1E222A] text-[#F5F5F2] border border-[#3E424C]",
      white: "bg-[#111318] text-[#F5F5F2] border border-[#2A2D34]",
      paper: "bg-[#181B21] text-[#F5F5F2] border border-[#2A2D34]",
      yellow: "bg-[#111318] text-[#F5F5F2] border border-[#FFB84D]/30",
      blue: "bg-[#111318] text-[#F5F5F2] border border-[#3D5CFF]/40 shadow-[0_0_25px_-5px_rgba(61,92,255,0.12)]",
      pink: "bg-[#111318] text-[#F5F5F2] border border-[#FF4D4D]/30",
      green: "bg-[#111318] text-[#F5F5F2] border border-[#42D392]/30",
    };

    const shadowStyles = {
      none: "shadow-none",
      sm: "shadow-sm shadow-black/40",
      md: "shadow-lg shadow-black/50",
      lg: "shadow-2xl shadow-black/70",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-6 transition-all duration-200",
          variantStyles[variant],
          shadowStyles[shadow],
          hoverEffect &&
            "hover:border-[#3E424C] hover:shadow-xl hover:shadow-black/70 hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Badge } from "./badge";
