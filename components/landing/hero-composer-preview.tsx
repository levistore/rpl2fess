"use client";

import * as React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

export function HeroComposerPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Tape on Top Center */}
      <div className="scrapbook-tape w-24 -top-3 left-1/2 -translate-x-1/2 rotate-1" />

      {/* Main Photographic Frame */}
      <div className="relative rounded-2xl bg-[#111318] border border-[#2A2D34] p-3 sm:p-4 shadow-2xl shadow-black/80 rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300">
        {/* Photo Container */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#08090B] border border-white/5">
          <Image
            src="/images/class/class-main.jpg"
            alt="Dokumentasi Kelas RPL 2"
            fill
            priority
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 540px"
          />

          {/* Film Viewfinder Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-mono tracking-widest text-[#7B8DFF]">
            <Camera className="w-3 h-3 text-[#3D5CFF]" />
            <span>DOCUMENTATION / 01</span>
          </div>

          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[11px] font-mono font-bold text-[#FFB84D] tracking-wider">
            &apos;26 09 04
          </div>
        </div>

        {/* Polaroid Scrapbook Caption */}
        <div className="pt-4 pb-2 px-2 space-y-1.5 border-t border-[#2A2D34]/50 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D5CFF]">
              DOCUMENTATION / 01
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A9DA5]">
              X RPL 2 / 2026
            </span>
          </div>

          <p className="font-handwriting text-xl sm:text-2xl text-[#F5F5F2] leading-snug">
            &ldquo;X RPL 2 — awal dari banyak cerita.&rdquo;
          </p>

          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#9A9DA5]/70 border-t border-white/5">
            <span>ARSIP DOKUMENTER KELAS</span>
            <span>SATU KELAS. BANYAK CERITA.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
