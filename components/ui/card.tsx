import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "paper" | "white" | "yellow" | "blue" | "pink" | "green";
  shadow?: "none" | "sm" | "md" | "lg";
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "white",
      shadow = "md",
      hoverEffect = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      white: "bg-[#FFFFFF] text-[#111111]",
      paper: "bg-[#F6F3EA] text-[#111111]",
      yellow: "bg-[#FFD84D] text-[#111111]",
      blue: "bg-[#5B7CFF] text-[#111111]",
      pink: "bg-[#FF6B9A] text-[#111111]",
      green: "bg-[#8ED081] text-[#111111]",
    };

    const shadowStyles = {
      none: "shadow-none",
      sm: "shadow-[3px_3px_0_#111111]",
      md: "shadow-[6px_6px_0_#111111]",
      lg: "shadow-[10px_10px_0_#111111]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[8px] border-[3px] border-[#111111] p-6 transition-all duration-150",
          variantStyles[variant],
          shadowStyles[shadow],
          hoverEffect &&
            "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#111111]",
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
