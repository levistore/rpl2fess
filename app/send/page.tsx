import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/queries/messages";
import { getSendPageDocumentation } from "@/lib/queries/documentation";
import { SendForm } from "@/components/messages/send-form";
import { ArrowLeft, Shield, Camera } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kirim Pesan Anonim | RPLTwoFess",
  description:
    "Kirimkan pesan, pertanyaan, atau cerita secara anonim kepada seseorang secara personal.",
};

export default async function SendPage() {
  const [settings, sendDoc] = await Promise.all([
    getSiteSettings(),
    getSendPageDocumentation(),
  ]);

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F2] flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#3D5CFF]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Navigation back & brand & theme toggle */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#181B21] border border-[#2A2D34] flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-sm">
                <Image
                  src="/images/brand/rpl-logo.png"
                  alt="RPL Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display text-lg tracking-wide uppercase">
                RPLTWOFESS
              </span>
            </Link>
          </div>
        </div>

        {/* Main Content Grid: Form (Left) + Class Photo Polaroid (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Heading */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#3D5CFF]">
                XI RPL 2 • PESAN ANONIM
              </span>
              <h1 className="text-4xl sm:text-6xl font-display font-normal uppercase tracking-tight leading-none text-[#F5F5F2]">
                KIRIM <span className="text-[#3D5CFF]">SESUATU.</span>
              </h1>
              <p className="text-sm text-[#9A9DA5] leading-relaxed">
                Sampaikan sesuatu yang ingin kamu katakan secara anonim. Tulis pesan, cerita, pertanyaan, atau sesuatu yang ingin kamu sampaikan kepada seseorang.
              </p>
            </div>

            {/* The Paper Writing Surface Form */}
            <SendForm
              acceptingMessages={settings.accepting_messages}
              maxLength={settings.max_length}
            />

            {/* Privacy note */}
            <div className="pt-1">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1.5 text-xs text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors underline underline-offset-4 font-mono"
              >
                <Shield className="w-3.5 h-3.5 text-[#42D392]" /> Pelajari bagaimana pesanmu dijaga tetap anonim
              </Link>
            </div>
          </div>

          {/* Right Column: Class Documentary Photo Frame (Scrapbook) */}
          <div className="lg:col-span-5 space-y-4">
            {sendDoc && (
              <div className="relative rounded-2xl bg-[#111318] border border-[#2A2D34] p-3 sm:p-4 shadow-2xl shadow-black/70 rotate-[1deg] hover:rotate-0 transition-transform duration-300">
                <div className="scrapbook-tape w-20 -top-2.5 left-8 rotate-[-2deg]" />
                
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#08090B]">
                  <Image
                    src={sendDoc.image_url}
                    alt={sendDoc.title || sendDoc.caption || "Dokumentasi Kirim Pesan"}
                    fill
                    className="object-cover"
                    unoptimized={sendDoc.image_url.startsWith("blob:") || sendDoc.image_url.startsWith("data:")}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />

                  {sendDoc.category_label && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-widest text-[#7B8DFF] flex items-center gap-1">
                      <Camera className="w-3 h-3 text-[#3D5CFF]" />
                      <span>{sendDoc.category_label}</span>
                    </div>
                  )}

                  {sendDoc.overlay_text && (
                    <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-[#FFB84D]">
                      {sendDoc.overlay_text}
                    </div>
                  )}
                </div>

                <div className="pt-3 pb-1 px-1 space-y-1">
                  {sendDoc.caption && (
                    <p className="font-handwriting text-xl text-[#F5F5F2]">
                      &ldquo;{sendDoc.caption}&rdquo;
                    </p>
                  )}
                  {sendDoc.meta_text && (
                    <span className="text-[10px] font-mono uppercase text-[#9A9DA5] tracking-wider block">
                      {sendDoc.meta_text}
                    </span>
                  )}
                  {(sendDoc.footer_text || sendDoc.tagline_text) && (
                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#9A9DA5]/70 border-t border-white/5 mt-1">
                      <span>{sendDoc.footer_text || ""}</span>
                      <span>{sendDoc.tagline_text || ""}</span>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* Note block */}
            <div className="p-4 rounded-xl bg-[#111318] border border-[#2A2D34] text-xs text-[#9A9DA5] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#42D392]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#F5F5F2]">
                  Jaminan Kerahasiaan
                </span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Pesan ini dikirim secara anonim tanpa perlu nama atau login. Hanya teks pesan yang sampai ke penerima secara privat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mini footer */}
      <footer className="text-center pt-10 text-xs font-mono uppercase tracking-wider text-[#9A9DA5]/50 relative z-10">
        RPLTwoFess &#8226; Kelas XI RPL 2
      </footer>
    </div>
  );
}
