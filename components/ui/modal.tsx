"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "md",
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-[2px] animate-in fade-in duration-150">
      {/* Backdrop click */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative w-full rounded-[8px] bg-[#F6F3EA] border-[3px] border-[#111111] shadow-[10px_10px_0_#111111] z-10 p-6 md:p-8 animate-in zoom-in-95 duration-150",
          maxWidthStyles[maxWidth],
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2
              id="modal-title"
              className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#111111]"
            >
              {title}
            </h2>
            {description && (
              <p className="text-sm font-medium text-[#111111]/70 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-[4px] border-[2px] border-[#111111] bg-[#FFFFFF] shadow-[2px_2px_0_#111111] hover:bg-[#FF6B9A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-120 cursor-pointer"
          >
            <X className="w-5 h-5 text-[#111111]" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
