import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertOctagon, HelpCircle } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl bg-[#111318] border border-[#2A2D34] shadow-xl shadow-black/50",
        className
      )}
    >
      <div className="w-14 h-14 rounded-xl border border-[#2A2D34] bg-[#181B21] flex items-center justify-center mb-5 text-[#7B8DFF] shadow-[0_0_20px_-5px_rgba(61,92,255,0.2)]">
        {icon || <HelpCircle className="w-6 h-6" />}
      </div>
      <h3 className="text-xl font-bold tracking-tight text-[#F5F5F2] mb-2">
        {title}
      </h3>
      <p className="text-sm font-normal text-[#9A9DA5] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-[#111318] border border-[#FF4D4D]/30 shadow-xl shadow-black/50",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl border border-[#FF4D4D]/40 bg-[#FF4D4D]/10 flex items-center justify-center mb-4 text-[#FF4D4D]">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-[#F5F5F2] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#9A9DA5] max-w-md mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
}

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[#181B21] border border-[#2A2D34]/50",
        className
      )}
      {...props}
    />
  );
}
