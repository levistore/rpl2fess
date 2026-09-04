import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Lock, EyeOff, ShieldAlert, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi & Keamanan | RPLTwoFess",
  description:
    "Penjelasan transparan tentang bagaimana RPLTwoFess melindungi kerahasiaan pengirim dan mencegah penyalahgunaan.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F2] flex flex-col justify-between selection:bg-[#3D5CFF] selection:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-14 w-full space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B21] border border-[#2A2D34] text-xs font-mono text-[#42D392] mb-3">
            <span>&#8226; PRIVASI &amp; KEAMANAN</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
            KEBIJAKAN PRIVASI RPLTWOFESS
          </h1>
          <p className="text-sm sm:text-base text-[#9A9DA5] mt-1">
            Prinsip privasi sederhana, transparan, dan melindungi semua pihak.
          </p>
        </div>

        <div className="space-y-6">
          {/* Card 1: Anonimitas */}
          <Card variant="surface" className="p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#3D5CFF]/15 border border-[#3D5CFF]/30 flex items-center justify-center text-[#7B8DFF]">
                <EyeOff className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[#F5F5F2]">
                1. Pesan 100% Anonim
              </h2>
            </div>
            <p className="text-sm text-[#9A9DA5] leading-relaxed">
              Saat kamu mengirim pesan melalui halaman <strong>/send</strong>, kamu tidak diminta untuk login, mendaftar akun, memasukkan nama, nomor telepon, atau alamat email. Pesan yang terkirim masuk ke dashboard pemilik tanpa nama atau profil pengirim.
            </p>
          </Card>

          {/* Card 2: Perlindungan Anti-Spam */}
          <Card variant="surface" className="p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFB84D]/15 border border-[#FFB84D]/30 flex items-center justify-center text-[#FFB84D]">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[#F5F5F2]">
                2. Data Teknis Minimum &amp; Hashing
              </h2>
            </div>
            <p className="text-sm text-[#9A9DA5] leading-relaxed">
              Untuk mencegah serangan bot spam, flooding, dan pelecehan terus-menerus, sistem menggunakan pengacakan kriptografis satu arah (HMAC-SHA256). <strong>Kami tidak menyimpan alamat IP mentah pengirim ke dalam database</strong>. Identifier hash tersebut hanya digunakan secara otomatis oleh sistem untuk membatasi frekuensi kirim (rate limiting) dan memblokir spammer jika dilaporkan.
            </p>
          </Card>

          {/* Card 3: Hak Penghapusan */}
          <Card variant="surface" className="p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#42D392]/15 border border-[#42D392]/30 flex items-center justify-center text-[#42D392]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[#F5F5F2]">
                3. Hak Penghapusan Pesan
              </h2>
            </div>
            <p className="text-sm text-[#9A9DA5] leading-relaxed">
              Pemilik website memiliki hak penuh untuk menghapus pesan apa pun dari kotak masuk secara berkala atau seketika jika pesan dinilai tidak relevan, kasar, atau merugikan.
            </p>
          </Card>

          {/* Card 4: Moderasi & Pelaporan */}
          <Card variant="surface" className="p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 flex items-center justify-center text-[#FF4D4D]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[#F5F5F2]">
                4. Batasan &amp; Moderasi
              </h2>
            </div>
            <p className="text-sm text-[#9A9DA5] leading-relaxed">
              RPLTwoFess adalah wadah untuk bercerita, menyapa, dan saling menghargai. Penggunaan platform untuk ancaman kekerasan fisik, doxxing, pornografi ilegal, atau pencemaran nama baik yang melanggar hukum tidak ditoleransi dan dapat diblokir permanen oleh sistem.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
