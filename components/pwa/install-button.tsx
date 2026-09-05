"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { usePWA } from "./pwa-provider";
import { cn } from "@/lib/utils";

interface InstallButtonProps extends Omit<ButtonProps, "onClick"> {
  onInstallSuccess?: () => void;
}

export function InstallButton({
  className,
  variant = "primary",
  size = "md",
  onInstallSuccess,
  ...props
}: InstallButtonProps) {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [isPrompting, setIsPrompting] = React.useState(false);

  // Hide button if already installed or not installable via beforeinstallprompt
  if (isInstalled || !isInstallable) {
    return null;
  }

  const handleClick = async () => {
    setIsPrompting(true);
    try {
      const accepted = await promptInstall();
      if (accepted && onInstallSuccess) {
        onInstallSuccess();
      }
    } finally {
      setIsPrompting(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      isLoading={isPrompting}
      className={cn(
        "bg-[#3D5CFF] text-white hover:bg-[#536DFF] shadow-[0_2px_10px_rgba(61,92,255,0.3)]",
        className
      )}
      {...props}
    >
      <Download className="w-4 h-4 mr-2 text-white shrink-0" />
      <span>Install RPLTwoFess</span>
    </Button>
  );
}
