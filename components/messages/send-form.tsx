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
            colors: ["#5B7CFF", "#FFD84D", "#FF6B9A", "#8ED081", "#111111"],
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
      <Card variant="white" shadow="lg" className="p-8 text-center border-[3px] border-[#111111]">
        <div className="w-14 h-14 rounded-[8px] bg-[#FF6B9A] border-[3px] border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center mx-auto mb-4 text-[#111111]">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-[#111111] mb-2">
          Penerimaan Pesan Ditutup
        </h2>
        <p className="text-sm font-bold text-[#111111]/70 max-w-sm mx-auto mb-6">
          Admin RPLTwoFess sedang menonaktifkan penerimaan pesan untuk sementara waktu.
        </p>
        <Link href="/">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
          </Button>
        </Link>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card
        variant="yellow"
        shadow="lg"
        className="p-8 sm:p-10 text-center animate-in zoom-in-95 duration-150 border-[3px] border-[#111111]"
      >
        <div className="w-16 h-16 rounded-[8px] bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] flex items-center justify-center mx-auto mb-4 text-[#111111]">
          <CheckCircle2 className="w-8 h-8 text-[#111111]" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111] mb-2">
          Pesan Terkirim.
        </h2>

        <p className="text-sm sm:text-base font-bold text-[#111111]/80 max-w-sm mx-auto mb-8 leading-relaxed">
          Pesanmu sudah sampai secara anonim. Identitasmu tetap menjadi rahasia.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            type="button"
            variant="white"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Kirim Pesan Lagi
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="primary"
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
    <Card variant="white" shadow="lg" className="p-6 sm:p-8 border-[3px] border-[#111111]">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header notice */}
        <div className="flex items-center justify-between pb-3 border-b-[2px] border-[#111111]">
          <span className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#5B7CFF]" /> Formulir Anonim
          </span>
          <span className="text-[11px] font-bold text-[#111111]/70 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8ED081]" /> 100% Rahasia
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-[6px] bg-[#FF6B9A] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] text-xs sm:text-sm font-bold text-[#111111]">
            ⚠ {error}
          </div>
        )}

        <Textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={maxLength}
          placeholder="Tulis pesan, cerita, uneg-uneg, pertanyaan, atau kesanmu untuk kelas RPL/PPLG 2..."
          rows={6}
          disabled={isLoading}
          required
        />

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-[11px] font-medium text-[#111111]/60 text-center sm:text-left leading-relaxed">
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
            <Send className="w-4 h-4 mr-2" /> Kirim Pesan
          </Button>
        </div>
      </form>
    </Card>
  );
}
