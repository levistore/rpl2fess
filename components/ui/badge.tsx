import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "yellow" | "pink" | "green" | "white" | "ink";
  size?: "sm" | "md";
}

export const Badge = ({
  className,
  variant = "yellow",
  size = "md",
  children,
  ...props
}: BadgeProps) => {
  const variantStyles = {
    yellow: "bg-[#FFD84D] text-[#111111] border-[#111111]",
    blue: "bg-[#5B7CFF] text-[#111111] border-[#111111]",
    pink: "bg-[#FF6B9A] text-[#111111] border-[#111111]",
    green: "bg-[#8ED081] text-[#111111] border-[#111111]",
    white: "bg-[#FFFFFF] text-[#111111] border-[#111111]",
    ink: "bg-[#111111] text-[#F6F3EA] border-[#111111]",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 border-[2px]",
    md: "text-xs px-2.5 py-1 border-[2.5px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-black uppercase tracking-wider rounded-[4px] shadow-[2px_2px_0_#111111]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
