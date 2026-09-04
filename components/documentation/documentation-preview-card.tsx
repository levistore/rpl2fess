"use client";

import * as React from "react";
import Image from "next/image";

interface DocumentationPreviewCardProps {
  title?: string;
  caption: string;
  categoryLabel: string;
  metaText: string;
  overlayText?: string | null;
  imageUrl: string;
}

export function DocumentationPreviewCard({
  caption,
  categoryLabel,
  metaText,
  overlayText,
  imageUrl,
}: DocumentationPreviewCardProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative rounded-xl bg-[#111318] border border-[#2A2D34] p-3.5 shadow-2xl shadow-black/80 flex flex-col justify-between">
        {/* Tape Accent */}
        <div className="scrapbook-tape w-16 -top-2.5 left-6 rotate-[-2deg]" />

        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#08090B] border border-[#2A2D34]/50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={caption || "Preview Dokumentasi"}
              fill
              unoptimized={imageUrl.startsWith("blob:") || imageUrl.startsWith("data:")}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 360px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#555A64] p-4 text-center">
              <span className="text-xs font-mono uppercase tracking-wider">Foto Belum Dipilih</span>
            </div>
          )}

          {/* Overlay Text if specified */}
          {overlayText && (
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-widest text-[#F5F5F2] uppercase shadow-md">
              {overlayText}
            </div>
          )}
        </div>

        {/* Editorial Content */}
        <div className="pt-3.5 pb-1 px-1 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D5CFF] block">
            {categoryLabel || "DOCUMENTATION"}
          </span>
          <p className="font-handwriting text-lg text-[#F5F5F2] leading-snug">
            &ldquo;{caption || "Tulis caption dokumentasi..."}&rdquo;
          </p>
          <span className="text-[10px] font-mono text-[#9A9DA5] block">
            {metaText || "X RPL 2 / 2026"}
          </span>
        </div>
      </div>
    </div>
  );
}
