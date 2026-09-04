"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, ShieldCheck, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            alt="Dokumentasi Kelas RPL / PPLG 2"
            fill
            priority
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 540px"
          />

          {/* Film Viewfinder Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-mono tracking-widest text-[#7B8DFF]">
            <Camera className="w-3 h-3 text-[#3D5CFF]" />
            <span>DOKUMENTASI KELAS</span>
          </div>

          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[11px] font-mono font-bold text-[#FFB84D] tracking-wider">
            &apos;26 09 04
          </div>
        </div>

        {/* Polaroid Scrapbook Caption */}
        <div className="pt-3 pb-1 px-2 flex items-center justify-between">
          <p className="font-handwriting text-xl sm:text-2xl text-[#F5F5F2]/90 -rotate-1">
            X PPLG 2 — banyak cerita di sini &#10024;
          </p>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A9DA5]">
            Dokumentasi Resmi
          </span>
        </div>

        {/* Embedded Floating Confession Card */}
        <div className="mt-3 p-4 rounded-xl bg-[#181B21]/90 backdrop-blur-md border border-[#2A2D34] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3D5CFF] animate-pulse" />
              <span className="text-xs font-medium tracking-wide text-[#F5F5F2]">
                Pesan Masuk Anonim
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#42D392]/10 border border-[#42D392]/20 text-[#42D392]">
              Baru Saja
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#F5F5F2]/90 leading-relaxed italic">
            &ldquo;Semoga ujian komprehensif kita sekelas lulus semua! Tetap kompak ya anak-anak RPL 2 🔥&rdquo;
          </p>

          <div className="pt-1 flex items-center justify-between border-t border-white/5">
            <span className="text-[11px] text-[#9A9DA5] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#42D392]" /> 100% Rahasia
            </span>

            <Link href="/send">
              <Button variant="accent" size="sm" className="h-7 text-xs px-2.5">
                <Send className="w-3 h-3 mr-1 text-[#3D5CFF]" /> Tulis Pesanmu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
