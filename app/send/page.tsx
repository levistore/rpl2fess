import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/queries/messages";
import { SendForm } from "@/components/messages/send-form";
import { MessageSquare, ArrowLeft, Shield, Camera } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kirim Pesan Anonim | RPLTwoFess",
  description:
    "Kirimkan pesan, pertanyaan, atau cerita secara anonim kepada seseorang secara personal.",
};

export default async function SendPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F2] flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#3D5CFF]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#181B21] border border-[#2A2D34] flex items-center justify-center text-[#3D5CFF]">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <span className="font-display text-lg tracking-wide uppercase">
              RPLTWOFESS
            </span>
          </Link>
        </div>

        {/* Main Content Grid: Form (Left) + Class Photo Polaroid (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Heading */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#3D5CFF]">
                RPL 2 • PESAN ANONIM
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
              recipientName={settings.recipient_name || "Owner RPL 2"}
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
            <div className="relative rounded-2xl bg-[#111318] border border-[#2A2D34] p-3 sm:p-4 shadow-2xl shadow-black/70 rotate-[1deg] hover:rotate-0 transition-transform duration-300">
              <div className="scrapbook-tape w-20 -top-2.5 left-8 rotate-[-2deg]" />
              
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#08090B]">
                <Image
                  src="/images/class/class-main.jpg"
                  alt="Dokumentasi Kelas RPL 2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-widest text-[#7B8DFF] flex items-center gap-1">
                  <Camera className="w-3 h-3 text-[#3D5CFF]" />
                  <span>DOCUMENTATION / NOTE</span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-[#FFB84D]">
                  &apos;26 09 04
                </div>
              </div>

              <div className="pt-3 pb-1 px-1 space-y-1">
                <p className="font-handwriting text-xl text-[#F5F5F2]">
                  &ldquo;Dokumentasi kecil dari satu kelas yang sama.&rdquo;
                </p>
                <span className="text-[10px] font-mono uppercase text-[#9A9DA5] tracking-wider block">
                  Kelas RPL 2 / 2026
                </span>
              </div>
            </div>

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
        RPLTwoFess &#8226; Kelas RPL 2
      </footer>
    </div>
  );
}
