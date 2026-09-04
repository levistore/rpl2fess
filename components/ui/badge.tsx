import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "yellow" | "pink" | "green" | "white" | "ink";
  size?: "sm" | "md";
}

export const Badge = ({
  className,
  variant = "blue",
  size = "md",
  children,
  ...props
}: BadgeProps) => {
  const variantStyles = {
    blue: "bg-[#3D5CFF]/15 text-[#7B8DFF] border-[#3D5CFF]/30",
    yellow: "bg-[#FFB84D]/15 text-[#FFB84D] border-[#FFB84D]/30",
    pink: "bg-[#FF4D4D]/15 text-[#FF4D4D] border-[#FF4D4D]/30",
    green: "bg-[#42D392]/15 text-[#42D392] border-[#42D392]/30",
    white: "bg-white/10 text-[#F5F5F2] border-white/20",
    ink: "bg-[#181B21] text-[#9A9DA5] border-[#2A2D34]",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 rounded-md border",
    md: "text-xs px-2.5 py-1 rounded-md border font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium tracking-wide",
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
