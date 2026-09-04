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
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-[8px] bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[6px_6px_0_#111111]",
        className
      )}
    >
      <div className="w-16 h-16 rounded-[8px] border-[3px] border-[#111111] bg-[#FFD84D] shadow-[4px_4px_0_#111111] flex items-center justify-center mb-5 text-[#111111]">
        {icon || <HelpCircle className="w-8 h-8" />}
      </div>
      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#111111] mb-2">
        {title}
      </h3>
      <p className="text-sm font-medium text-[#111111]/70 max-w-md mb-6 leading-relaxed">
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
        "flex flex-col items-center justify-center text-center p-8 rounded-[8px] bg-[#FF6B9A]/20 border-[3px] border-[#111111] shadow-[6px_6px_0_#111111]",
        className
      )}
    >
      <div className="w-14 h-14 rounded-[6px] border-[3px] border-[#111111] bg-[#FF6B9A] shadow-[4px_4px_0_#111111] flex items-center justify-center mb-4 text-[#111111]">
        <AlertOctagon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight text-[#111111] mb-2">
        {title}
      </h3>
      <p className="text-sm font-medium text-[#111111]/80 max-w-md mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="white" size="sm" onClick={onRetry}>
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
        "animate-pulse rounded-[4px] border-[2px] border-[#111111]/20 bg-[#111111]/10",
        className
      )}
      {...props}
    />
  );
}
