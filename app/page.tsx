import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeroComposerPreview } from "@/components/landing/hero-composer-preview";
import {
  ArrowRight,
  Lock,
  Sparkles,
  Send,
  EyeOff,
  ShieldAlert,
  Camera,
} from "lucide-react";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F2] flex flex-col selection:bg-[#3D5CFF] selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* 1. Hero Section (Cinematic Editorial + Digital Scrapbook) */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3D5CFF]/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181B21] border border-[#2A2D34] text-xs font-mono text-[#7B8DFF]">
              <Sparkles className="w-3.5 h-3.5 text-[#3D5CFF]" />
              <span className="tracking-widest uppercase text-[11px]">
                UNTUK KELAS KITA &#8226; X PPLG 2
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-normal uppercase tracking-tight leading-[0.92] text-[#F5F5F2]">
                SATU KELAS.<br />
                <span className="text-[#3D5CFF]">BANYAK CERITA.</span>
              </h1>
              <p className="font-handwriting text-2xl text-[#9A9DA5] pt-1">
                &ldquo;sampaikan apa yang ingin kamu katakan kepada kami...&rdquo;
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#9A9DA5] max-w-lg leading-relaxed font-normal">
              Tempat buat menyampaikan pesan, cerita, pertanyaan, atau sesuatu yang ingin kamu katakan kepada kami. Tanpa perlu mencantumkan nama atau login akun.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-md">
              <Link href="/send" className="flex-1">
                <Button variant="primary" size="lg" className="w-full">
                  <Send className="w-4 h-4 mr-2 text-white" /> Kirim Pesan Anonim <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/#cara-kerja" className="shrink-0">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Cara Kerja
                </Button>
              </Link>
            </div>

            {/* Privacy Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#9A9DA5]/80 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#42D392]" /> Tanpa Login
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3D5CFF]" /> 100% Rahasia
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB84D]" /> Anti-Spam Aktif
              </span>
            </div>
          </div>

          {/* Right Column: Photographic Scrapbook Hero */}
          <div className="lg:col-span-6 lg:pl-4">
            <HeroComposerPreview />
          </div>
        </div>
      </section>

      {/* Subtle Marquee Divider */}
      <div className="border-y border-[#2A2D34] bg-[#111318]/70 py-3.5 overflow-hidden select-none">
        <div className="flex items-center gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-[#9A9DA5]">
          <span>SATU KELAS. BANYAK CERITA &#10022;</span>
          <span>PESAN ANONIM &#10022;</span>
          <span>TANPA NAMA &#10022;</span>
          <span>RPL / PPLG 2 &#10022;</span>
          <span>RAHASIA TERJAMIN &#10022;</span>
          <span>DOKUMENTASI KELAS &#10022;</span>
          <span>SATU KELAS. BANYAK CERITA &#10022;</span>
          <span>ANTI-SPAM AKTIF &#10022;</span>
        </div>
      </div>

      {/* 2. Cara Kerja Section (Editorial Horizontal Composition) */}
      <section id="cara-kerja" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#3D5CFF]">
            &#8226; ALUR SEDERHANA
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
            BAGAIMANA CARA KERJANYA?
          </h2>
          <p className="text-sm sm:text-base text-[#9A9DA5] max-w-md">
            Sangat sederhana. Pengunjung di luar kelas tidak perlu mendaftar atau membuat akun apa pun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="surface" className="p-8 space-y-4 relative group hover:border-[#3D5CFF]/50">
            <div className="flex items-center justify-between">
              <span className="font-display text-5xl text-[#3D5CFF]/40 group-hover:text-[#3D5CFF] transition-colors">
                01
              </span>
              <span className="text-xs font-mono text-[#9A9DA5] uppercase">
                Step 1
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-[#F5F5F2]">
              Buka Form Pesan
            </h3>
            <p className="text-sm text-[#9A9DA5] leading-relaxed">
              Cukup klik tombol &ldquo;Kirim Pesan&rdquo;. Tidak ada formulir pendaftaran, tidak ada login akun Google, dan tidak perlu memasukkan nama.
            </p>
          </Card>

          <Card variant="surface" className="p-8 space-y-4 relative group hover:border-[#3D5CFF]/50">
            <div className="flex items-center justify-between">
              <span className="font-display text-5xl text-[#3D5CFF]/40 group-hover:text-[#3D5CFF] transition-colors">
                02
              </span>
              <span className="text-xs font-mono text-[#9A9DA5] uppercase">
                Step 2
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-[#F5F5F2]">
              Tulis Pesanmu
            </h3>
            <p className="text-sm text-[#9A9DA5] leading-relaxed">
              Tuliskan pertanyaan, cerita seru, kritik membangun, kesan, atau uneg-unegmu hingga 500 karakter dengan bebas dan jujur.
            </p>
          </Card>

          <Card variant="surface" className="p-8 space-y-4 relative group hover:border-[#3D5CFF]/50">
            <div className="flex items-center justify-between">
              <span className="font-display text-5xl text-[#3D5CFF]/40 group-hover:text-[#3D5CFF] transition-colors">
                03
              </span>
              <span className="text-xs font-mono text-[#9A9DA5] uppercase">
                Step 3
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-[#F5F5F2]">
              Pesan Sampai di Dashboard
            </h3>
            <p className="text-sm text-[#9A9DA5] leading-relaxed">
              Pesanmu langsung masuk ke dashboard kelas kami secara rahasia dan aman. Identitasmu tetap menjadi rahasia selamanya.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Class Photography Collage (Digital Scrapbook Section) */}
      <section id="dokumentasi" className="py-20 px-4 sm:px-6 bg-[#08090B] border-t border-[#2A2D34] relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#7B8DFF] mb-2">
                <Camera className="w-3.5 h-3.5 text-[#3D5CFF]" />
                <span>GALERI DOKUMENTASI</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
                KENANGAN &amp; CERITA KELAS
              </h2>
            </div>
            <p className="font-handwriting text-2xl text-[#9A9DA5] max-w-sm">
              &ldquo;setiap foto menyimpan cerita yang tak terlupakan&rdquo;
            </p>
          </div>

          {/* Photo Collage Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Photo 1 */}
            <div className="relative rounded-xl bg-[#111318] border border-[#2A2D34] p-3 shadow-xl shadow-black/50 rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
              <div className="scrapbook-tape w-16 -top-2 left-4 rotate-[-3deg]" />
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#08090B]">
                <Image
                  src="/images/class/class-01.jpg"
                  alt="Lab PPLG 2"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 250px"
                />
              </div>
              <div className="pt-3 pb-1 px-1">
                <p className="font-handwriting text-lg text-[#F5F5F2] leading-tight">
                  Lab Komputer RPL 2
                </p>
                <span className="text-[10px] font-mono text-[#9A9DA5]">
                  &apos;26 08 14 &#8226; Sesi Belajar
                </span>
              </div>
            </div>

            {/* Photo 2 */}
            <div className="relative rounded-xl bg-[#111318] border border-[#2A2D34] p-3 shadow-xl shadow-black/50 rotate-[1.5deg] hover:rotate-0 transition-transform duration-300">
              <div className="scrapbook-tape w-16 -top-2 right-4 rotate-[2deg]" />
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#08090B]">
                <Image
                  src="/images/class/class-02.jpg"
                  alt="Presentasi Projek RPL 2"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 250px"
                />
              </div>
              <div className="pt-3 pb-1 px-1">
                <p className="font-handwriting text-lg text-[#F5F5F2] leading-tight">
                  Showcase Projek Aplikasi
                </p>
                <span className="text-[10px] font-mono text-[#9A9DA5]">
                  &apos;26 08 20 &#8226; Kolaborasi Tim
                </span>
              </div>
            </div>

            {/* Photo 3 */}
            <div className="relative rounded-xl bg-[#111318] border border-[#2A2D34] p-3 shadow-xl shadow-black/50 rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300">
              <div className="scrapbook-tape w-16 -top-2 left-6 rotate-[-2deg]" />
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#08090B]">
                <Image
                  src="/images/class/class-03.jpg"
                  alt="Kebersamaan Kelas RPL 2"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 250px"
                />
              </div>
              <div className="pt-3 pb-1 px-1">
                <p className="font-handwriting text-lg text-[#F5F5F2] leading-tight">
                  Momen Santai Bersama
                </p>
                <span className="text-[10px] font-mono text-[#9A9DA5]">
                  &apos;26 08 25 &#8226; Satu Kelas
                </span>
              </div>
            </div>

            {/* Photo 4 */}
            <div className="relative rounded-xl bg-[#111318] border border-[#2A2D34] p-3 shadow-xl shadow-black/50 rotate-[1deg] hover:rotate-0 transition-transform duration-300">
              <div className="scrapbook-tape w-16 -top-2 right-6 rotate-[3deg]" />
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#08090B]">
                <Image
                  src="/images/class/class-04.jpg"
                  alt="Workshop Tech"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 250px"
                />
              </div>
              <div className="pt-3 pb-1 px-1">
                <p className="font-handwriting text-lg text-[#F5F5F2] leading-tight">
                  Creative Workshop
                </p>
                <span className="text-[10px] font-mono text-[#9A9DA5]">
                  &apos;26 08 28 &#8226; RPL 2 Hebat
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Keamanan & Privasi Section */}
      <section id="keamanan" className="py-24 px-4 sm:px-6 bg-[#08090B] border-t border-[#2A2D34]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-[#42D392]">
              &#8226; KEAMANAN TERINTEGRASI
            </span>
            <h2 className="text-4xl sm:text-6xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
              ANONIM, NAMUN TETAP AMAN.
            </h2>
            <p className="text-sm sm:text-base text-[#9A9DA5] max-w-lg">
              RPLTwoFess dirancang untuk interaksi yang sehat, jujur, dan menyenangkan tanpa menjadi sarang cyberbullying.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="surface" className="p-7 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#3D5CFF]/15 border border-[#3D5CFF]/30 flex items-center justify-center text-[#7B8DFF]">
                <EyeOff className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#F5F5F2]">
                100% Tanpa Identitas
              </h4>
              <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
                Kami tidak pernah meminta data pribadi, nama, akun media sosial, atau nomor telepon dari pengirim.
              </p>
            </Card>

            <Card variant="surface" className="p-7 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#FFB84D]/15 border border-[#FFB84D]/30 flex items-center justify-center text-[#FFB84D]">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#F5F5F2]">
                Anti-Spam &amp; Rate Limit
              </h4>
              <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
                Dilengkapi cooldown otomatis dan batas pengiriman terenkripsi untuk mencegah flooding pesan oleh bot.
              </p>
            </Card>

            <Card variant="surface" className="p-7 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 flex items-center justify-center text-[#FF4D4D]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#F5F5F2]">
                Pemblokiran Spammer
              </h4>
              <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
                Pesan bernada pelecehan atau ancaman dapat langsung diblokir secara permanen oleh admin kelas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-20 px-4 sm:px-6 bg-[#111318] border-t border-[#2A2D34] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-[#3D5CFF]/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#7B8DFF]">
            &#8226; SATU KELAS. BANYAK CERITA &#8226;
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
            PUNYA SESUATU YANG INGIN DISAMPAIKAN?
          </h2>
          <p className="text-sm sm:text-base text-[#9A9DA5] max-w-lg mx-auto leading-relaxed">
            Jangan dipendam. Kirimkan ceritamu, pertanyaan, atau kesanmu untuk kelas RPL/PPLG 2 sekarang juga.
          </p>
          <div className="pt-2">
            <Link href="/send">
              <Button variant="primary" size="lg" className="px-8 text-base">
                <Send className="w-4 h-4 mr-2" /> Buka Form Kirim Pesan <ArrowRight className="w-4 h-4 ml-2" />
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
