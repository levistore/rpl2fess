"use client";

import * as React from "react";
import QRCode from "qrcode";
import { QrCode, Copy, Check, Download, Share2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const TARGET_URL = "https://rpltwofess.zone.id/send";

interface QRShareCardProps {
  className?: string;
  variant?: "card" | "embedded";
}

export function QRShareCard({ className, variant = "card" }: QRShareCardProps) {
  const { toast } = useToast();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  // Detect Web Share API support safely using useSyncExternalStore
  const canShare = React.useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );

  // Render QR Code onto canvas on mount
  React.useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, TARGET_URL, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    }).catch((err) => {
      console.error("[QRCode] Failed to render canvas:", err);
    });
  }, []);

  // Copy Link action
  const handleCopyLink = React.useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(TARGET_URL);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = TARGET_URL;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      toast("Link berhasil disalin", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Gagal menyalin link", "error");
    }
  }, [toast]);

  // Download High-Res PNG (1024x1024)
  const handleDownloadQR = React.useCallback(async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await QRCode.toDataURL(TARGET_URL, {
        width: 1024,
        margin: 3,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = "rpltwofess-qr.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast("QR Code berhasil diunduh (PNG)", "success");
    } catch (err) {
      console.error("[QRCode] Failed to download PNG:", err);
      toast("Gagal mengunduh gambar QR Code", "error");
    } finally {
      setIsDownloading(false);
    }
  }, [toast]);

  // Web Share API action
  const handleShare = React.useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "RPLTwoFess",
          text: "Yuk kirim pesan anonim ke XI RPL 2.",
          url: TARGET_URL,
        });
        return;
      } catch (err) {
        // Ignore user cancellation (AbortError)
        if ((err as Error)?.name === "AbortError") {
          return;
        }
      }
    }

    // Fallback: Copy link
    await handleCopyLink();
  }, [handleCopyLink]);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-[#2A2D34]">
        <div className="w-8 h-8 rounded-lg bg-[#3D5CFF]/15 border border-[#3D5CFF]/30 flex items-center justify-center shrink-0">
          <QrCode className="w-4 h-4 text-[#3D5CFF]" />
        </div>
        <div>
          <h3 className="text-xl font-display uppercase tracking-wide text-[#F5F5F2]">
            Bagikan RPLTwoFess
          </h3>
          <p className="text-xs sm:text-sm text-[#9A9DA5] mt-0.5">
            Scan QR Code untuk langsung membuka form pesan anonim.
          </p>
        </div>
      </div>

      {/* Main Body: QR Code + Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* QR Code Container */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="p-3 sm:p-4 rounded-2xl bg-white shadow-xl border border-black/10 inline-flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto aspect-square rounded-lg"
              role="img"
              aria-label="QR Code link form pesan anonim RPLTwoFess"
            />
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 mt-2 font-medium">
              XI RPL 2 &#8226; SCAN ME
            </span>
          </div>
        </div>

        {/* Link & Actions */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] flex items-center gap-1.5">
              Tautan Langsung / Form Kirim
            </span>
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#181B21] border border-[#2A2D34]">
              <span className="text-xs sm:text-sm font-mono text-[#7B8DFF] truncate select-all">
                {TARGET_URL}
              </span>
              <a
                href={TARGET_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buka link di tab baru"
                className="p-1 text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <p className="text-xs text-[#9A9DA5] leading-relaxed">
            Arahkan kamera smartphone ke QR Code untuk langsung membuka form pengiriman pesan tanpa perlu mengetik link manual.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              aria-label="Salin tautan ke clipboard"
              className="flex-1 min-w-[130px]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-[#42D392]" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-[#7B8DFF]" />
                  <span>Salin Link</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleDownloadQR}
              isLoading={isDownloading}
              aria-label="Unduh QR Code format PNG resolusi tinggi"
              className="flex-1 min-w-[130px] bg-[#3D5CFF] text-white hover:bg-[#536DFF]"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-white" />
              <span>Unduh QR</span>
            </Button>

            {canShare && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleShare}
                aria-label="Bagikan link RPLTwoFess"
                className="w-full sm:w-auto"
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5 text-[#7B8DFF]" />
                <span>Bagikan</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (variant === "embedded") {
    return <div className={cn("w-full", className)}>{content}</div>;
  }

  return (
    <Card
      className={cn(
        "p-6 sm:p-8 bg-[#111318] border border-[#2A2D34]",
        className
      )}
    >
      {content}
    </Card>
  );
}
