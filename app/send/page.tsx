import Link from "next/link";
import { getSiteSettings } from "@/lib/queries/messages";
import { SendForm } from "@/components/messages/send-form";
import { MessageSquare, ArrowLeft, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kirim Pesan Anonim | RPLTwoFess",
  description:
    "Kirimkan pesan, pertanyaan, atau cerita secara anonim ke kelas RPL/PPLG 2.",
};

export default async function SendPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-[#F6F3EA] text-[#111111] flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#111111] hover:text-[#5B7CFF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[4px] bg-[#5B7CFF] border-[1.5px] border-[#111111] flex items-center justify-center text-[#111111]">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <span className="font-black text-sm uppercase tracking-tighter">
              RPLTwoFess
            </span>
          </Link>
        </div>

        {/* Page Heading */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-block px-3 py-1 rounded-[4px] bg-[#FFD84D] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] text-xs font-black uppercase tracking-wider">
            RPL / PPLG 2
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
            Kirim Sesuatu.
          </h1>
          <p className="text-sm font-bold text-[#111111]/70 max-w-md mx-auto">
            Satu Kelas. Banyak Cerita. Sampaikan pesan, cerita, pertanyaan, atau kesanmu tanpa nama.
          </p>
        </div>

        {/* The Form */}
        <SendForm
          acceptingMessages={settings.accepting_messages}
          maxLength={settings.max_length}
        />

        {/* Privacy Note */}
        <div className="text-center pt-2">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111]/60 hover:text-[#111111] underline underline-offset-2"
          >
            <Shield className="w-3.5 h-3.5 text-[#8ED081]" /> Pelajari bagaimana pesanmu dijaga tetap anonim
          </Link>
        </div>
      </div>

      {/* Mini footer */}
      <footer className="text-center pt-8 text-xs font-bold uppercase tracking-wider text-[#111111]/40">
        RPLTwoFess • Kelas RPL/PPLG 2
      </footer>
    </div>
  );
}
