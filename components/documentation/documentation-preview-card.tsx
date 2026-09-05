"use client";

import * as React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface DocumentationPreviewCardProps {
  title?: string;
  caption: string;
  categoryLabel: string;
  metaText: string;
  overlayText?: string | null;
  footerText?: string | null;
  taglineText?: string | null;
  imageUrl: string;
}

export function DocumentationPreviewCard({
  caption,
  categoryLabel,
  metaText,
  overlayText,
  footerText,
  taglineText,
  imageUrl,
}: DocumentationPreviewCardProps) {
  const displayLabel = categoryLabel || "DOCUMENTATION / 01";
  const displayMeta = metaText || "X RPL 2 / 2026";
  const displayCaption = caption || "Tulis caption dokumentasi...";
  const displayOverlay = overlayText || "";
  const displayFooter = footerText || "ARSIP DOKUMENTER KELAS";
  const displayTagline = taglineText || "SATU KELAS. BANYAK CERITA.";

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto">
      <div className="relative rounded-2xl bg-[#111318] border border-[#2A2D34] p-3 sm:p-4 shadow-2xl shadow-black/80 flex flex-col justify-between">
        {/* Tape Accent */}
        <div className="scrapbook-tape w-20 -top-2.5 left-1/2 -translate-x-1/2 rotate-[-1deg]" />

        {/* Photo Container */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#08090B] border border-white/5">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={caption || "Preview Dokumentasi"}
              fill
              unoptimized={imageUrl.startsWith("blob:") || imageUrl.startsWith("data:")}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#555A64] p-4 text-center">
              <span className="text-xs font-mono uppercase tracking-wider">Foto Belum Dipilih</span>
            </div>
          )}

          {/* Film Viewfinder Overlay Top Left */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-widest text-[#7B8DFF]">
            <Camera className="w-3 h-3 text-[#3D5CFF]" />
            <span className="uppercase">{displayLabel}</span>
          </div>

          {/* Overlay Text if specified */}
          {displayOverlay && (
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-wider font-bold text-[#FFB84D] uppercase shadow-md">
              {displayOverlay}
            </div>
          )}
        </div>

        {/* Polaroid Scrapbook Caption */}
        <div className="pt-3.5 pb-1 px-1 space-y-1.5 border-t border-[#2A2D34]/50 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D5CFF] block">
              {displayLabel}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A9DA5] block">
              {displayMeta}
            </span>
          </div>

          <p className="font-handwriting text-xl text-[#F5F5F2] leading-snug">
            &ldquo;{displayCaption}&rdquo;
          </p>

          <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#9A9DA5]/70 border-t border-white/5">
            <span>{displayFooter}</span>
            <span>{displayTagline}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
