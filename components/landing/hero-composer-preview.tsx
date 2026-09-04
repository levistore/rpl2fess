"use client";

import * as React from "react";
import Link from "next/link";
import { Send, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroComposerPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:max-w-none">
      {/* Decorative background shadow card */}
      <div className="absolute inset-0 bg-[#FFD84D] rounded-[8px] border-[3px] border-[#111111] translate-x-3 translate-y-3 -rotate-1" />

      {/* Main Card */}
      <div className="relative rounded-[8px] bg-[#FFFFFF] border-[3px] border-[#111111] p-6 sm:p-7 shadow-[6px_6px_0_#111111] rotate-1 space-y-4">
        <div className="flex items-center justify-between border-b-[2px] border-[#111111] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FF6B9A] border-[1.5px] border-[#111111] flex items-center justify-center text-xs font-black text-[#111111]">
              ?
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#111111]">
              Pesan Anonim Masuk
            </span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-[4px] bg-[#8ED081] border-[1.5px] border-[#111111]">
            Baru Saja
          </span>
        </div>

        {/* Mock Message Display */}
        <div className="p-4 rounded-[6px] bg-[#F6F3EA] border-[2px] border-[#111111] space-y-2">
          <p className="font-bold text-sm sm:text-base text-[#111111] leading-relaxed">
            “Kalian keren banget waktu presentasi proyek aplikasi kemarin! Semoga sukses terus ya anak RPL 2 🔥”
          </p>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#111111]/50 pt-1">
            <span>Anonim • 2 menit lalu</span>
            <span className="text-[#8ED081] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
            </span>
          </div>
        </div>

        {/* Direct CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] font-bold text-[#111111]/60 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#5B7CFF]" /> Tanpa perlu login
          </span>

          <Link href="/send" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto">
              <Send className="w-3.5 h-3.5 mr-1.5" /> Kirim Pesanmu Sekarang <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
