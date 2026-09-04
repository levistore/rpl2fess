"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const value = React.useMemo(
    () => ({
      toast: addToast,
      success: (msg: string) => addToast(msg, "success"),
      error: (msg: string) => addToast(msg, "error"),
      warning: (msg: string) => addToast(msg, "warning"),
      info: (msg: string) => addToast(msg, "info"),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4"
      >
        {toasts.map((t) => {
          const typeStyles = {
            success: "bg-[#8ED081] text-[#111111]",
            error: "bg-[#FF6B9A] text-[#111111]",
            warning: "bg-[#FFD84D] text-[#111111]",
            info: "bg-[#5B7CFF] text-[#111111]",
          };

          const icons = {
            success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
            error: <XCircle className="w-5 h-5 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 shrink-0" />,
            info: <Info className="w-5 h-5 shrink-0" />,
          };

          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-[6px] border-[3px] border-[#111111] shadow-[5px_5px_0_#111111] font-bold text-sm animate-in slide-in-from-bottom-3 duration-150",
                typeStyles[t.type]
              )}
            >
              <div className="flex items-center gap-2.5">
                {icons[t.type]}
                <span>{t.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="p-1 hover:bg-[#111111]/15 rounded-[4px] cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
