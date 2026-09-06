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
    <div className="space-y-8">
      {/* Header */}
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
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181B21] border border-[#2A2D34] w-fit">
          <span className="text-xs font-mono text-[#7B8DFF] select-all">
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

      {/* Main Studio Grid: Poster Live Preview (Left/Top) + Controls (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Canvas Preview */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-3">
          <div
            className={cn(
              "relative w-full max-w-[420px] rounded-2xl overflow-hidden bg-[#07090E] border border-[#2A2D34] shadow-2xl p-2 sm:p-3 flex items-center justify-center transition-all",
              format === "story" && "aspect-[9/16] max-h-[580px]",
              format === "square" && "aspect-square max-h-[460px]",
              format === "landscape" && "aspect-[16/9] max-h-[340px]"
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

          <p className="text-[11px] font-mono text-[#9A9DA5] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#42D392]" />
            <span>Resolusi Export: {FORMAT_CONFIG[format].width} × {FORMAT_CONFIG[format].height} px</span>
          </p>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Template Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] flex items-center gap-1.5">
              <span>1. PILIH TEMPLATE POSTER</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
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
                    "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1",
                    template === item.id
                      ? "bg-[#3D5CFF]/15 border-[#3D5CFF] text-[#F5F5F2] shadow-[0_0_15px_-3px_rgba(61,92,255,0.4)]"
                      : "bg-[#181B21] border-[#2A2D34] text-[#9A9DA5] hover:text-[#F5F5F2] hover:border-[#3E424C]"
                  )}
                >
                  <span className="text-xs font-bold font-display uppercase tracking-wide block">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#9A9DA5] block">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Format / Aspect Ratio Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] flex items-center gap-1.5">
              <span>2. UKURAN & FORMAT</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
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
                      "p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer text-xs font-medium",
                      format === item.id
                        ? "bg-[#3D5CFF]/15 border-[#3D5CFF] text-[#7B8DFF] shadow-[0_0_12px_-2px_rgba(61,92,255,0.3)]"
                        : "bg-[#181B21] border-[#2A2D34] text-[#9A9DA5] hover:text-[#F5F5F2] hover:border-[#3E424C]"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Photo Selector */}
          <div className="space-y-2.5">
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

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {/* Option: Tanpa Foto */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className={cn(
                  "h-18 rounded-xl border flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer",
                  selectedPhoto === null
                    ? "bg-[#3D5CFF]/15 border-[#3D5CFF] text-[#7B8DFF]"
                    : "bg-[#181B21] border-[#2A2D34] text-[#9A9DA5] hover:border-[#3E424C]"
                )}
              >
                <span className="text-[10px] font-mono font-bold leading-tight uppercase">
                  Tanpa Foto
                </span>
                <span className="text-[9px] text-[#9A9DA5] mt-1">Grafis Murni</span>
              </button>

              {/* Photo Thumbnails */}
              {allPhotos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedPhoto(photo.url)}
                  className={cn(
                    "relative h-18 rounded-xl overflow-hidden border transition-all cursor-pointer group",
                    selectedPhoto === photo.url
                      ? "border-[#3D5CFF] ring-2 ring-[#3D5CFF]/40 shadow-md"
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

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#2A2D34] space-y-2.5">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleDownloadPoster}
                isLoading={isDownloading}
                className="flex-1 bg-[#3D5CFF] text-white hover:bg-[#536DFF] shadow-[0_4px_16px_rgba(61,92,255,0.4)]"
              >
                <Download className="w-4 h-4 mr-2 text-white shrink-0" />
                <span>Download Poster PNG</span>
              </Button>

              {canShare && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleShare}
                  isLoading={isSharing}
                  className="sm:w-auto"
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
                className="sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-[#42D392] shrink-0" />
                    <span>Tersalin!</span>
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
        "p-6 sm:p-8 bg-[#111318] border border-[#2A2D34]",
        className
      )}
    >
      {content}
    </Card>
  );
}
