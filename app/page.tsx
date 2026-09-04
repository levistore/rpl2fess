import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroComposerPreview } from "@/components/landing/hero-composer-preview";
import {
  ArrowRight,
  Lock,
  Sparkles,
  ShieldAlert,
  Send,
  EyeOff,
} from "lucide-react";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-[#F6F3EA] text-[#111111] flex flex-col selection:bg-[#FFD84D]">
      {/* Top Navigation */}
      <Navbar />

      {/* 1. Hero Section (Editorial & Asymmetric) */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#FFD84D] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111]">
              <Sparkles className="w-4 h-4 text-[#111111]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#111111]">
                Official Anonymous Inbox • RPL / PPLG 2
              </span>
            </div>

            <div className="space-y-3">
              <span className="block font-black text-2xl sm:text-3xl uppercase tracking-wider text-[#5B7CFF]">
                RPLTwoFess
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] text-[#111111]">
                Satu Kelas. Banyak Cerita.
              </h1>
            </div>

            <p className="text-base sm:text-xl font-bold text-[#111111]/80 max-w-xl leading-relaxed">
              Tempat buat menyampaikan pesan, cerita, pertanyaan, atau sesuatu yang ingin kamu katakan kepada kami. Tanpa perlu mencantumkan nama.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
              <Link href="/send" className="flex-1">
                <Button variant="primary" size="lg" className="w-full h-14 text-base">
                  <Send className="w-4 h-4 mr-2" /> Kirim Pesan Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/privacy" className="shrink-0">
                <Button variant="white" size="lg" className="w-full sm:w-auto h-14">
                  Pelajari Privasi
                </Button>
              </Link>
            </div>

            <p className="text-xs font-bold text-[#111111]/60 pt-1 flex flex-wrap items-center gap-2">
              <span>✦ Pengunjung tanpa login</span>
              <span>•</span>
              <span>✦ 100% Rahasia</span>
              <span>•</span>
              <span>✦ Anti-Spam &amp; Aman</span>
            </p>
          </div>

          {/* Right Column: Hero Visual Preview */}
          <div className="lg:col-span-5">
            <HeroComposerPreview />
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="border-y-[3px] border-[#111111] bg-[#FFD84D] py-3 overflow-hidden select-none">
        <div className="flex items-center gap-8 whitespace-nowrap font-black text-sm uppercase tracking-widest text-[#111111]">
          <span>SATU KELAS. BANYAK CERITA ✦</span>
          <span>PESAN ANONIM ✦</span>
          <span>TANPA LOGIN ✦</span>
          <span>RPL / PPLG 2 ✦</span>
          <span>RAHASIA TERJAMIN ✦</span>
          <span>ANTI-SPAM AKTIF ✦</span>
          <span>SATU KELAS. BANYAK CERITA ✦</span>
        </div>
      </div>

      {/* 2. Cara Kerja Section */}
      <section id="cara-kerja" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-12">
        <div className="space-y-2">
          <Badge variant="blue" size="sm">
            Alur Sederhana
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
            Cara Kerja RPLTwoFess
          </h2>
          <p className="text-base font-bold text-[#111111]/70 max-w-lg">
            Sangat sederhana. Kamu tidak perlu membuat akun apa pun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="yellow" shadow="lg" className="p-8 space-y-4 border-[3px] border-[#111111]">
            <span className="block font-black text-5xl text-[#111111] opacity-40">
              01
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
              Buka Form Pesan
            </h3>
            <p className="text-sm font-bold text-[#111111]/80 leading-relaxed">
              Klik tombol &quot;Kirim Pesan&quot;. Tidak ada formulir pendaftaran, tidak ada input nama pengirim.
            </p>
          </Card>

          <Card variant="blue" shadow="lg" className="p-8 space-y-4 border-[3px] border-[#111111]">
            <span className="block font-black text-5xl text-[#111111] opacity-40">
              02
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
              Tulis Apa Saja
            </h3>
            <p className="text-sm font-bold text-[#111111]/80 leading-relaxed">
              Tuliskan pertanyaan, cerita seru, kritik membangun, atau kesanmu hingga 500 karakter dengan bebas.
            </p>
          </Card>

          <Card variant="pink" shadow="lg" className="p-8 space-y-4 border-[3px] border-[#111111]">
            <span className="block font-black text-5xl text-[#111111] opacity-40">
              03
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
              Pesan Diterima
            </h3>
            <p className="text-sm font-bold text-[#111111]/80 leading-relaxed">
              Pesan langsung masuk ke dashboard pribadi kami secara rahasia dan aman dari serangan spam.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Keamanan & Privasi Section */}
      <section id="keamanan" className="py-20 px-4 sm:px-6 bg-[#FFFFFF] border-y-[3px] border-[#111111]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="green" size="sm">
              Keamanan Terintegrasi
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
              Anonim, Namun Tetap Aman
            </h2>
            <p className="text-base font-bold text-[#111111]/70">
              RPLTwoFess dirancang untuk interaksi jujur yang sehat tanpa menjadi sarang cyberbullying.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="paper" shadow="sm" className="p-6 space-y-3 border-[2.5px] border-[#111111]">
              <div className="w-10 h-10 rounded-[6px] bg-[#5B7CFF] border-[2px] border-[#111111] flex items-center justify-center text-[#111111]">
                <EyeOff className="w-5 h-5" />
              </div>
              <h4 className="font-black uppercase text-base text-[#111111]">
                Tanpa Identitas
              </h4>
              <p className="text-xs font-bold text-[#111111]/70 leading-relaxed">
                Kami tidak pernah meminta data pribadi, nama, akun media sosial, atau nomor telepon dari pengirim.
              </p>
            </Card>

            <Card variant="paper" shadow="sm" className="p-6 space-y-3 border-[2.5px] border-[#111111]">
              <div className="w-10 h-10 rounded-[6px] bg-[#FFD84D] border-[2px] border-[#111111] flex items-center justify-center text-[#111111]">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-black uppercase text-base text-[#111111]">
                Anti-Spam &amp; Rate Limit
              </h4>
              <p className="text-xs font-bold text-[#111111]/70 leading-relaxed">
                Dilengkapi cooldown 20 detik dan batas pengiriman otomatis untuk mencegah flooding pesan oleh bot.
              </p>
            </Card>

            <Card variant="paper" shadow="sm" className="p-6 space-y-3 border-[2.5px] border-[#111111]">
              <div className="w-10 h-10 rounded-[6px] bg-[#FF6B9A] border-[2px] border-[#111111] flex items-center justify-center text-[#111111]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-black uppercase text-base text-[#111111]">
                Pemblokiran Spammer
              </h4>
              <p className="text-xs font-bold text-[#111111]/70 leading-relaxed">
                Pengirim yang mengirim pesan bernada ancaman atau pelecehan dapat diblokir permanen oleh admin.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 bg-[#5B7CFF] border-t-[4px] border-[#111111]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111] leading-none">
            Punya Sesuatu yang Ingin Disampaikan?
          </h2>
          <p className="text-base sm:text-lg font-bold text-[#111111] max-w-xl mx-auto">
            Jangan dipendam. Kirimkan ceritamu ke kelas RPL/PPLG 2 sekarang.
          </p>
          <div>
            <Link href="/send">
              <Button variant="secondary" size="lg" className="h-14 px-8 text-base">
                <Send className="w-4 h-4 mr-2" /> Buka Form Kirim Pesan <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
