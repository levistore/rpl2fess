"use client";

import * as React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { DocumentationItem } from "@/types/database";

interface HeroComposerPreviewProps {
  item?: DocumentationItem | null;
}

export function HeroComposerPreview({ item }: HeroComposerPreviewProps) {
  const categoryLabel = item?.category_label || "DOCUMENTATION / 01";
  const metaText = item?.meta_text || "X RPL 2 / 2026";
  const caption = item?.caption || "X RPL 2 — awal dari banyak cerita.";
  const overlayText = item?.overlay_text || "'26 09 04";
  const footerText = item?.footer_text || "ARSIP DOKUMENTER KELAS";
  const taglineText = item?.tagline_text || "SATU KELAS. BANYAK CERITA.";
  const imageUrl = item?.image_url || "/images/class/class-main.jpg";

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Tape on Top Center */}
      <div className="scrapbook-tape w-24 -top-3 left-1/2 -translate-x-1/2 rotate-1" />

      {/* Main Photographic Frame */}
      <div className="relative rounded-2xl bg-[#111318] border border-[#2A2D34] p-3 sm:p-4 shadow-2xl shadow-black/80 rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300">
        {/* Photo Container */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#08090B] border border-white/5">
          <Image
            src={imageUrl}
            alt={caption || "Dokumentasi Kelas RPL 2"}
            fill
            priority
            unoptimized={imageUrl.startsWith("blob:") || imageUrl.startsWith("data:")}
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 540px"
          />

          {/* Film Viewfinder Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-mono tracking-widest text-[#7B8DFF]">
            <Camera className="w-3 h-3 text-[#3D5CFF]" />
            <span className="uppercase">{categoryLabel}</span>
          </div>

          {overlayText && (
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[11px] font-mono font-bold text-[#FFB84D] tracking-wider uppercase">
              {overlayText}
            </div>
          )}
        </div>

        {/* Polaroid Scrapbook Caption */}
        <div className="pt-4 pb-2 px-2 space-y-1.5 border-t border-[#2A2D34]/50 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D5CFF]">
              {categoryLabel}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A9DA5]">
              {metaText}
            </span>
          </div>

          <p className="font-handwriting text-xl sm:text-2xl text-[#F5F5F2] leading-snug">
            &ldquo;{caption}&rdquo;
          </p>

          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#9A9DA5]/70 border-t border-white/5">
            <span>{footerText}</span>
            <span>{taglineText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
