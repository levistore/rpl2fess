"use client";

import * as React from "react";
import Link from "next/link";
import { sendAnonymousMessageAction } from "@/lib/actions/messages";
import { Button } from "@/components/ui/button";
import {
  Send,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  ArrowLeft,
  Lock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface SendFormProps {
  acceptingMessages: boolean;
  maxLength: number;
  recipientName?: string;
}

export function SendForm({
  acceptingMessages,
  maxLength = 500,
  recipientName = "Owner RPL 2",
}: SendFormProps) {
  const [content, setContent] = React.useState("");
  const [senderName, setSenderName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("content", content.trim());
    if (recipientName.trim()) {
      formData.append("recipient_name", recipientName.trim());
    }
    if (senderName.trim()) {
      formData.append("sender_name", senderName.trim());
    }

    try {
      const res = await sendAnonymousMessageAction(formData);

      if (res.success) {
        setIsSuccess(true);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#3D5CFF", "#536DFF", "#7B8DFF", "#42D392", "#F5F5F2"],
          });
        } catch {
          // ignore if canvas unavailable
        }
      } else {
        setError(res.error || "Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setContent("");
    setSenderName("");
    setError(null);
    setIsSuccess(false);
  };

  if (!acceptingMessages) {
    return (
      <div className="relative rounded-2xl bg-[#0E1015] border border-[#2A2D34] p-8 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 flex items-center justify-center mx-auto text-[#FF4D4D]">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-display uppercase tracking-tight text-[#F5F5F2]">
          PENERIMAAN PESAN DITUTUP
        </h2>
        <p className="text-sm text-[#9A9DA5] max-w-sm mx-auto">
          Admin RPLTwoFess sedang menonaktifkan penerimaan pesan untuk sementara waktu.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="relative rounded-2xl bg-[#0E1015] border border-[#3D5CFF]/40 p-8 sm:p-10 text-center animate-in zoom-in-95 duration-200 space-y-6 shadow-2xl shadow-black/80">
        {/* Scrapbook Tape */}
        <div className="scrapbook-tape w-24 -top-3 left-1/2 -translate-x-1/2 rotate-1" />

        <div className="w-14 h-14 rounded-2xl bg-[#3D5CFF]/15 border border-[#3D5CFF]/40 flex items-center justify-center mx-auto text-[#42D392]">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div className="space-y-1.5 border-b border-[#2A2D34] pb-5">
          <span className="text-xs font-mono uppercase tracking-widest text-[#42D392]">
            STATUS: TERSIMPAN DI ARSIP
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
            MESSAGE SENT.
          </h2>
          <p className="text-sm text-[#9A9DA5] max-w-md mx-auto leading-relaxed">
            {senderName.trim()
              ? `Pesanmu telah dikirim kepada ${recipientName} dengan nama "${senderName.trim()}".`
              : `Pesanmu telah dikirim kepada ${recipientName} secara anonim.`}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            type="button"
            variant="primary"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Tulis Pesan Lain
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Recipient Target Header */}
      <div className="p-4 rounded-xl bg-[#111318] border border-[#2A2D34] flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7B8DFF] block">
            UNTUK
          </span>
          <span className="text-sm sm:text-base font-semibold text-[#F5F5F2] font-display uppercase tracking-tight">
            {recipientName || "Owner RPL 2"}
          </span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-[#3D5CFF]/10 border border-[#3D5CFF]/30 text-[10px] font-mono text-[#7B8DFF] uppercase tracking-wider">
          PESAN PERSONAL
        </div>
      </div>

      {/* 2. Optional Sender Name Field */}
      <div className="p-4 rounded-xl bg-[#111318] border border-[#2A2D34] space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="sender-name" className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#7B8DFF]" />
            <span>NAMA PENGIRIM</span>
            <span className="text-[#555A64] font-sans lowercase">(opsional)</span>
          </label>
          <span className="text-[10px] font-mono text-[#555A64]">
            {senderName.length} / 50
          </span>
        </div>
        <input
          id="sender-name"
          name="sender_name"
          type="text"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          maxLength={50}
          placeholder="Masukkan nama atau panggilan"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#181B21] border border-[#2A2D34] px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F5F2] placeholder-[#555A64] focus:outline-none focus:border-[#3D5CFF] focus:ring-1 focus:ring-[#3D5CFF] transition-all"
        />
        <p className="text-[11px] text-[#9A9DA5] leading-tight">
          Kosongkan jika ingin tetap anonim.
        </p>
      </div>

      {/* 3. Paper Writing Surface */}
      <div className="relative rounded-2xl bg-[#0E1015] border border-[#2A2D34] p-5 sm:p-7 shadow-2xl shadow-black/80 space-y-4">
        {/* Tape Accent */}
        <div className="scrapbook-tape w-24 -top-3 left-8 rotate-[-1.5deg]" />

        {/* Paper Sheet Header */}
        <div className="flex items-center justify-between border-b border-[#2A2D34]/80 pb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#3D5CFF] font-semibold tracking-wider uppercase">
              RPLTWOFESS / NOTE 01
            </span>
          </div>
          <span className="text-[#9A9DA5] uppercase tracking-wider text-[11px]">
            RPL 2 / 2026
          </span>
        </div>

        {/* Paper Handwritten Prompt */}
        <div className="pt-1">
          <p className="font-handwriting text-2xl sm:text-3xl text-[#F5F5F2] leading-none">
            Tulis sesuatu untuk seseorang.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 text-xs font-medium text-[#FF4D4D] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D] inline-block shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Native Textarea on Paper Surface */}
        <div className="relative pt-1 pb-2">
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={maxLength}
            placeholder="Tulis pesan, cerita, pertanyaan, atau sesuatu yang ingin kamu sampaikan kepada seseorang..."
            rows={7}
            disabled={isLoading}
            required
            className="w-full bg-transparent text-[#F5F5F2] placeholder-[#9A9DA5]/40 text-sm sm:text-base font-sans resize-y focus:outline-none leading-[32px] border-0 p-0 selection:bg-[#3D5CFF] selection:text-white"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 31px, rgba(255, 255, 255, 0.05) 31px, rgba(255, 255, 255, 0.05) 32px)",
              lineHeight: "32px",
              paddingTop: "2px",
            }}
          />
        </div>

        {/* Paper Sheet Bottom Metadata */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2A2D34]/80 text-xs font-mono">
          <span
            className={cn(
              content.length > maxLength * 0.9
                ? "text-[#FF4D4D] font-bold"
                : "text-[#9A9DA5]"
            )}
          >
            {content.length} / {maxLength}
          </span>
          <div className="text-right text-[#9A9DA5] text-[11px]">
            <span>RPL 2</span>
            <span className="mx-1.5">/</span>
            <span>2026</span>
          </div>
        </div>
      </div>

      {/* Action and Privacy Note */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <p className="text-xs text-[#9A9DA5] flex items-center gap-2 leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-[#42D392] shrink-0" />
          <span>Pesan ini dikirim secara privat &amp; hanya dapat dibaca oleh penerima.</span>
        </p>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={!content.trim() || isLoading}
          className="w-full sm:w-auto px-7"
        >
          <Send className="w-4 h-4 mr-2" /> Kirim Pesan Anonim
        </Button>
      </div>
    </form>
  );
}
