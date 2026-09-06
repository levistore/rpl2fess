"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

import { motion, AnimatePresence } from "motion/react";

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
        <AnimatePresence mode="popLayout" initial={false}>
          {toasts.map((t) => {
            const typeStyles = {
              success: "border-l-4 border-l-[#42D392] text-[#F5F5F2]",
              error: "border-l-4 border-l-[#FF4D4D] text-[#F5F5F2]",
              warning: "border-l-4 border-l-[#FFB84D] text-[#F5F5F2]",
              info: "border-l-4 border-l-[#3D5CFF] text-[#F5F5F2]",
            };

            const icons = {
              success: <CheckCircle2 className="w-4 h-4 shrink-0 text-[#42D392]" />,
              error: <XCircle className="w-4 h-4 shrink-0 text-[#FF4D4D]" />,
              warning: <AlertTriangle className="w-4 h-4 shrink-0 text-[#FFB84D]" />,
              info: <Info className="w-4 h-4 shrink-0 text-[#7B8DFF]" />,
            };

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#181B21] border border-[#2A2D34] shadow-2xl shadow-black/80 font-normal text-xs sm:text-sm",
                  typeStyles[t.type]
                )}
              >
                <div className="flex items-center gap-2.5">
                  {icons[t.type]}
                  <span className="leading-snug">{t.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="p-1 hover:bg-white/10 text-[#9A9DA5] hover:text-[#F5F5F2] rounded-md cursor-pointer transition-colors"
                  aria-label="Dismiss toast"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
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
