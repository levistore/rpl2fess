"use client";

import * as React from "react";
import { QrCode } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { QRShareCard } from "./qr-share-card";
import { Button } from "@/components/ui/button";

interface ShareTriggerProps {
  className?: string;
  variant?: "badge" | "button";
}

export function ShareTrigger({ className, variant = "badge" }: ShareTriggerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {variant === "badge" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B21] border border-[#2A2D34] hover:border-[#3D5CFF]/60 hover:text-[#F5F5F2] transition-colors text-xs font-mono text-[#9A9DA5] cursor-pointer"
          aria-label="Buka QR Code Bagikan RPLTwoFess"
        >
          <QrCode className="w-3.5 h-3.5 text-[#3D5CFF]" />
          <span>Bagikan QR</span>
        </button>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(true)}
          className={className}
          aria-label="Buka QR Code Bagikan RPLTwoFess"
        >
          <QrCode className="w-3.5 h-3.5 mr-1.5 text-[#3D5CFF]" />
          <span>Bagikan QR</span>
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Bagikan RPLTwoFess — Poster Generator"
        maxWidth="5xl"
      >
        <QRShareCard variant="embedded" />
      </Modal>
    </>
  );
}
