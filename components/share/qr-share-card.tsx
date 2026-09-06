"use client";

import * as React from "react";
import Image from "next/image";
import {
  Download,
  Share2,
  Copy,
  Check,
  Image as ImageIcon,
  Smartphone,
  Square,
  Monitor,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  renderPoster,
  PosterTemplate,
  PosterFormat,
  FORMAT_CONFIG,
} from "./poster-renderer";

const TARGET_URL = "https://rpltwofess.zone.id/send";

export interface PhotoOption {
  id: string;
  title: string;
  url: string;
}

const DEFAULT_PHOTOS: PhotoOption[] = [
  {
    id: "class-main",
    title: "Foto Utama",
    url: "/images/class/class-main.jpg",
  },
  {
    id: "class-02",
    title: "Momen 1",
    url: "/images/class/class-02.jpg",
  },
  {
    id: "class-03",
    title: "Momen 2",
    url: "/images/class/class-03.jpg",
  },
  {
    id: "class-04",
    title: "Momen 3",
    url: "/images/class/class-04.jpg",
  },
];

interface QRShareCardProps {
  className?: string;
  variant?: "card" | "embedded";
  availablePhotos?: PhotoOption[];
}

export function QRShareCard({
  className,
  variant = "card",
  availablePhotos = [],
}: QRShareCardProps) {
  const { toast } = useToast();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // States
  const [template, setTemplate] = React.useState<PosterTemplate>("editorial");
  const [format, setFormat] = React.useState<PosterFormat>("story");
  const [selectedPhoto, setSelectedPhoto] = React.useState<string | null>(
    "/images/class/class-main.jpg"
  );
  const [isRendering, setIsRendering] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Combined photo options (defaults + uploaded photos if provided)
  const allPhotos = React.useMemo(() => {
    const combined = [...DEFAULT_PHOTOS];
    for (const p of availablePhotos) {
      if (!combined.some((item) => item.url === p.url)) {
        combined.push(p);
      }
    }
    return combined;
  }, [availablePhotos]);

  // Safe Web Share detection
  const canShare = React.useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );

  // Re-render poster whenever template, format, or photo changes
  const updatePoster = React.useCallback(async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);
    try {
      await renderPoster(canvasRef.current, {
        template,
        format,
        photoUrl: selectedPhoto,
        targetUrl: TARGET_URL,
      });
    } catch (err) {
      console.error("[QRShareCard] Render error:", err);
    } finally {
      setIsRendering(false);
    }
  }, [template, format, selectedPhoto]);

  React.useEffect(() => {
    updatePoster();
  }, [updatePoster]);

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
      toast("Link berhasil disalin ke clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Gagal menyalin link", "error");
    }
  }, [toast]);

  // Download High-Res PNG
  const handleDownloadPoster = React.useCallback(() => {
    if (!canvasRef.current) return;
    setIsDownloading(true);

    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = "rpltwofess-share-poster.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast("Poster berhasil diunduh (PNG)", "success");
    } catch (err) {
      console.error("[QRShareCard] Failed to download poster:", err);
      toast("Gagal mengunduh poster gambar", "error");
    } finally {
      setIsDownloading(false);
    }
  }, [toast]);

  // Web Share API (shares image file if possible, otherwise fallback to link)
  const handleShare = React.useCallback(async () => {
    if (!canvasRef.current) return;
    setIsSharing(true);

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        // Try file sharing first if supported
        if (typeof navigator.canShare === "function") {
          const blob = await new Promise<Blob | null>((resolve) => {
            canvasRef.current?.toBlob(resolve, "image/png");
          });

          if (blob) {
            const file = new File([blob], "rpltwofess-share-poster.png", {
              type: "image/png",
            });

            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: "RPLTwoFess",
                text: "Yuk kirim pesan anonim ke XI RPL 2: https://rpltwofess.zone.id/send",
              });
              toast("Poster berhasil dibagikan!", "success");
              return;
            }
          }
        }

        // Fallback to text share
        await navigator.share({
          title: "RPLTwoFess",
          text: "Yuk kirim pesan anonim ke XI RPL 2.",
          url: TARGET_URL,
        });
        toast("Tautan berhasil dibagikan!", "success");
        return;
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        console.warn("[QRShareCard] Share failed:", err);
      } else {
        return; // User cancelled
      }
    } finally {
      setIsSharing(false);
    }

    // Fallback if share unavailable
    handleDownloadPoster();
    await handleCopyLink();
  }, [handleDownloadPoster, handleCopyLink, toast]);

  const content = (
    <div className="space-y-6 sm:space-y-8 w-full overflow-hidden">
      {/* Header: Full on Dashboard Card, streamlined when embedded in Modal */}
      {variant !== "embedded" ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2A2D34]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#3D5CFF]/15 border border-[#3D5CFF]/30 text-xs font-mono font-medium text-[#7B8DFF] uppercase tracking-wider mb-2">
              <Smartphone className="w-3.5 h-3.5" /> POSTER GENERATOR
            </div>
            <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-[#F5F5F2]">
              Bagikan RPLTwoFess
            </h2>
            <p className="text-xs sm:text-sm text-[#9A9DA5] mt-1">
              Pilih template & ukuran untuk membuat poster QR yang siap diposting ke IG Story atau WA Status.
            </p>
          </div>

          {/* Direct Link Box */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181B21] border border-[#2A2D34] w-fit shrink-0">
            <span className="text-xs font-mono text-[#7B8DFF] select-all max-w-[220px] truncate">
              {TARGET_URL}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Salin link langsung"
              className="text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors p-1"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#42D392]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2A2D34]">
          <p className="text-xs text-[#9A9DA5]">
            Pilih template & format poster untuk diunduh atau dibagikan ke status/story media sosial.
          </p>
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#181B21] border border-[#2A2D34] w-fit shrink-0 text-xs font-mono text-[#7B8DFF]">
            <span className="select-all truncate max-w-[200px]">{TARGET_URL}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Salin link langsung"
              className="text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors p-0.5"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#42D392]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Grid: Poster Live Preview (Left on Desktop, Top on Mobile) + Controls (Right on Desktop, Bottom on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
        {/* Left Column: Live Canvas Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3 w-full">
          <div className="w-full flex justify-center py-1">
            <div
              className={cn(
                "relative w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px] rounded-2xl overflow-hidden bg-[#07090E] border border-[#2A2D34] shadow-2xl p-2 sm:p-2.5 flex items-center justify-center transition-all mx-auto",
                format === "story" && "aspect-[9/16] max-h-[480px] sm:max-h-[530px]",
                format === "square" && "aspect-square max-h-[340px] sm:max-h-[380px]",
                format === "landscape" && "aspect-[16/9] max-h-[220px] sm:max-h-[260px]"
              )}
            >
              {/* Live Canvas */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain rounded-xl shadow-inner"
              />

              {/* Rendering Overlay Spinner */}
              {isRendering && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center gap-2 text-xs font-mono text-[#F5F5F2]">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#3D5CFF]" />
                  <span>Memperbarui poster...</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] font-mono text-[#9A9DA5] flex items-center gap-1.5 text-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#42D392] shrink-0" />
            <span>Resolusi Export: {FORMAT_CONFIG[format].width} × {FORMAT_CONFIG[format].height} px</span>
          </p>
        </div>

        {/* Right Column: Customization Controls & Actions */}
        <div className="lg:col-span-7 space-y-5 w-full">
          {/* 1. Template Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] flex items-center gap-1.5">
              <span>1. PILIH TEMPLATE POSTER</span>
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {[
                {
                  id: "editorial" as PosterTemplate,
                  name: "Editorial",
                  desc: "Minimal & Elegan",
                },
                {
                  id: "scrapbook" as PosterTemplate,
                  name: "Scrapbook",
                  desc: "Polaroid & Tape",
                },
                {
                  id: "clean" as PosterTemplate,
                  name: "Clean Blue",
                  desc: "Modern Tech",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTemplate(item.id)}
                  className={cn(
                    "p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 min-h-[62px] sm:min-h-[68px]",
                    template === item.id
                      ? "bg-[#3D5CFF]/15 border-[#3D5CFF] text-[#F5F5F2] shadow-[0_0_15px_-3px_rgba(61,92,255,0.4)]"
                      : "bg-[#181B21] border-[#2A2D34] text-[#9A9DA5] hover:text-[#F5F5F2] hover:border-[#3E424C]"
                  )}
                >
                  <span className="text-xs font-bold font-display uppercase tracking-wide block truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#9A9DA5] block truncate">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Format / Aspect Ratio Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] flex items-center gap-1.5">
              <span>2. UKURAN & FORMAT</span>
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {[
                {
                  id: "story" as PosterFormat,
                  label: "Story 9:16",
                  icon: Smartphone,
                },
                {
                  id: "square" as PosterFormat,
                  label: "Persegi 1:1",
                  icon: Square,
                },
                {
                  id: "landscape" as PosterFormat,
                  label: "Landscape",
                  icon: Monitor,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormat(item.id)}
                    className={cn(
                      "p-2.5 sm:p-3 rounded-xl border flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer text-xs font-medium min-h-[44px]",
                      format === item.id
                        ? "bg-[#3D5CFF]/15 border-[#3D5CFF] text-[#7B8DFF] shadow-[0_0_12px_-2px_rgba(61,92,255,0.3)]"
                        : "bg-[#181B21] border-[#2A2D34] text-[#9A9DA5] hover:text-[#F5F5F2] hover:border-[#3E424C]"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="text-[11px] sm:text-xs truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Photo Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#3D5CFF]" />
                <span>3. FOTO KELAS PADA POSTER</span>
              </label>
              {selectedPhoto && (
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="text-[11px] font-mono text-[#7B8DFF] hover:underline cursor-pointer"
                >
                  Hapus Foto (Grafis Saja)
                </button>
              )}
            </div>

            {/* Clean Horizontal Scroll Container for Thumbnails */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 overscroll-x-contain w-full scrollbar-none">
              {/* Option: Tanpa Foto */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className={cn(
                  "shrink-0 w-20 h-16 sm:w-22 sm:h-18 rounded-xl border flex flex-col items-center justify-center p-1.5 text-center transition-all cursor-pointer",
                  selectedPhoto === null
                    ? "bg-[#3D5CFF]/15 border-[#3D5CFF] text-[#7B8DFF]"
                    : "bg-[#181B21] border-[#2A2D34] text-[#9A9DA5] hover:border-[#3E424C]"
                )}
              >
                <span className="text-[10px] font-mono font-bold leading-tight uppercase">
                  Tanpa Foto
                </span>
                <span className="text-[9px] text-[#9A9DA5] mt-0.5">Grafis Saja</span>
              </button>

              {/* Photo Thumbnails */}
              {allPhotos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedPhoto(photo.url)}
                  className={cn(
                    "relative shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border transition-all cursor-pointer group",
                    selectedPhoto === photo.url
                      ? "border-[#3D5CFF] ring-2 ring-[#3D5CFF]/50 shadow-md"
                      : "border-[#2A2D34] hover:border-[#3E424C] opacity-75 hover:opacity-100"
                  )}
                  title={photo.title}
                >
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {selectedPhoto === photo.url && (
                    <div className="absolute inset-0 bg-[#3D5CFF]/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: Responsive & Anti-Overflow */}
          <div className="pt-4 border-t border-[#2A2D34] space-y-2.5 w-full">
            {/* Primary Action Button: Full Width */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleDownloadPoster}
              isLoading={isDownloading}
              className="w-full bg-[#3D5CFF] text-white hover:bg-[#536DFF] shadow-[0_4px_16px_rgba(61,92,255,0.4)] h-12 text-sm sm:text-base font-semibold"
            >
              <Download className="w-4 h-4 mr-2 text-white shrink-0" />
              <span>Download Poster PNG</span>
            </Button>

            {/* Secondary Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              {canShare && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleShare}
                  isLoading={isSharing}
                  className="w-full h-11"
                >
                  <Share2 className="w-4 h-4 mr-2 text-[#7B8DFF] shrink-0" />
                  <span>Bagikan</span>
                </Button>
              )}

              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleCopyLink}
                className={cn("w-full h-11", !canShare && "sm:col-span-2")}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-[#42D392] shrink-0" />
                    <span>Link Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2 text-[#7B8DFF] shrink-0" />
                    <span>Salin Link</span>
                  </>
                )}
              </Button>
            </div>
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
        "p-5 sm:p-7 md:p-8 bg-[#111318] border border-[#2A2D34] w-full overflow-hidden",
        className
      )}
    >
      {content}
    </Card>
  );
}
