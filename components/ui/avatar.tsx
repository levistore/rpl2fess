import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Avatar = ({
  src,
  alt = "User Avatar",
  name = "User",
  size = "md",
  className,
  ...props
}: AvatarProps) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeMap = {
    sm: "w-8 h-8 text-xs border-[2px]",
    md: "w-12 h-12 text-sm border-[3px]",
    lg: "w-20 h-20 text-xl border-[3px]",
    xl: "w-28 h-28 text-3xl border-[4px]",
  };

  const getInitials = (n: string) => {
    return n
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden shrink-0 border-[#111111] shadow-[3px_3px_0_#111111] bg-[#FFD84D] flex items-center justify-center font-black text-[#111111] select-none",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
