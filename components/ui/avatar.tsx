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
    sm: "w-8 h-8 text-xs border",
    md: "w-10 h-10 text-sm border",
    lg: "w-16 h-16 text-lg border",
    xl: "w-24 h-24 text-2xl border",
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
        "relative rounded-full overflow-hidden shrink-0 border-[#2A2D34] bg-[#181B21] text-[#F5F5F2] flex items-center justify-center font-bold select-none",
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
