"use client";

import * as React from "react";
import Link from "next/link";
import { sendAnonymousMessageAction } from "@/lib/actions/messages";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";

interface SendFormProps {
  acceptingMessages: boolean;
  maxLength: number;
}

export function SendForm({
  acceptingMessages,
  maxLength = 500,
}: SendFormProps) {
  const [content, setContent] = React.useState("");
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
    setError(null);
    setIsSuccess(false);
  };

  if (!acceptingMessages) {
    return (
      <Card variant="surface" className="p-8 text-center border border-[#2A2D34] space-y-4">
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
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card
        variant="surface"
        className="p-8 sm:p-10 text-center animate-in zoom-in-95 duration-200 border border-[#3D5CFF]/40 space-y-5 shadow-2xl shadow-black/80"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#3D5CFF]/15 border border-[#3D5CFF]/40 flex items-center justify-center mx-auto text-[#3D5CFF] shadow-[0_0_30px_-5px_rgba(61,92,255,0.4)]">
          <CheckCircle2 className="w-8 h-8 text-[#42D392]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-[#42D392]">
            &#8226; STATUS: TERKIRIM
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
            MESSAGE SENT.
          </h2>
          <p className="text-sm text-[#9A9DA5] max-w-sm mx-auto leading-relaxed">
            Pesanmu sudah sampai secara anonim. Identitasmu tetap menjadi rahasia.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            type="button"
            variant="primary"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Kirim Pesan Lagi
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
      </Card>
    );
  }

  return (
    <Card variant="surface" className="p-6 sm:p-8 border border-[#2A2D34] shadow-2xl shadow-black/80">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header notice */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#2A2D34]">
          <span className="text-xs font-mono text-[#7B8DFF] flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#3D5CFF]" /> FORMULIR ANONIM
          </span>
          <span className="text-[11px] font-mono text-[#42D392] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% RAHASIA
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 text-xs sm:text-sm font-medium text-[#FF4D4D]">
            &#9888; {error}
          </div>
        )}

        <Textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={maxLength}
          placeholder="Tulis pesan, cerita, pertanyaan, uneg-uneg, atau kesanmu untuk kelas RPL / PPLG 2..."
          rows={6}
          disabled={isLoading}
          required
        />

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-[11px] text-[#9A9DA5]/70 text-center sm:text-left leading-relaxed">
            Dilarang mengirim ancaman, pelecehan, atau ujaran kebencian.
          </p>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={!content.trim() || isLoading}
            className="w-full sm:w-auto"
          >
            <Send className="w-4 h-4 mr-2" /> Kirim Pesan Anonim
          </Button>
        </div>
      </form>
    </Card>
  );
}
