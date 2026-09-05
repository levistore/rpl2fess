"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "compact";
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "", variant = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isLight = mounted && theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Beralih ke Dark Mode" : "Beralih ke Light Mode"}
      title={isLight ? "Beralih ke Dark Mode" : "Beralih ke Light Mode"}
      className={`relative inline-flex items-center justify-center rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3D5CFF]/40 cursor-pointer ${
        isLight
          ? "bg-[#FFFFFF] border-[#D9DCE2] text-[#111318] hover:bg-[#ECEEF2] hover:border-[#BFC4CE] shadow-sm"
          : "bg-[#181B21] border-[#2A2D34] text-[#F5F5F2] hover:bg-[#1E222A] hover:border-[#3D5CFF]/60 hover:text-[#7B8DFF] shadow-black/40"
      } ${
        variant === "compact"
          ? "w-8 h-8 p-1.5"
          : "w-9 h-9 p-2"
      } ${className}`}
    >
      {isLight ? (
        <Moon className="w-4 h-4 text-[#3D5CFF] transition-transform duration-200 rotate-0 scale-100" />
      ) : (
        <Sun className="w-4 h-4 text-[#FFB84D] transition-transform duration-200 rotate-0 scale-100" />
      )}
    </button>
  );
}
