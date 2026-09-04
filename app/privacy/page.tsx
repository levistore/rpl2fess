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
    <div className="min-h-screen bg-[#F6F3EA] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#111111] hover:text-[#5B7CFF] mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
          <div className="inline-block px-3 py-1 rounded-[4px] bg-[#8ED081] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] text-xs font-black uppercase tracking-wider mb-2">
            Privasi &amp; Keamanan
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
            Kebijakan Privasi RPLTwoFess
          </h1>
          <p className="text-sm sm:text-base font-bold text-[#111111]/70 mt-1">
            Prinsip privasi sederhana, jujur, dan melindungi semua pihak.
          </p>
        </div>

        <div className="space-y-6">
          {/* Card 1: Anonimitas */}
          <Card variant="white" shadow="md" className="p-6 sm:p-8 space-y-3 border-[3px] border-[#111111]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[6px] bg-[#5B7CFF] border-[2px] border-[#111111] flex items-center justify-center text-[#111111]">
                <EyeOff className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black uppercase text-[#111111]">
                1. Pesan 100% Anonim
              </h2>
            </div>
            <p className="text-sm font-medium text-[#111111]/80 leading-relaxed">
              Saat kamu mengirim pesan melalui halaman <strong>/send</strong>, kamu tidak diminta untuk login, mendaftar akun, memasukkan nama, nomor telepon, atau alamat email. Pesan yang terkirim masuk ke dashboard pemilik tanpa nama atau profil pengirim.
            </p>
          </Card>

          {/* Card 2: Perlindungan Anti-Spam */}
          <Card variant="white" shadow="md" className="p-6 sm:p-8 space-y-3 border-[3px] border-[#111111]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[6px] bg-[#FFD84D] border-[2px] border-[#111111] flex items-center justify-center text-[#111111]">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black uppercase text-[#111111]">
                2. Data Teknis Minimum &amp; Hashing
              </h2>
            </div>
            <p className="text-sm font-medium text-[#111111]/80 leading-relaxed">
              Untuk mencegah serangan bot spam, flooding, dan pelecehan terus-menerus, sistem menggunakan pengacakan kriptografis satu arah (HMAC-SHA256). <strong>Kami tidak menyimpan alamat IP mentah pengirim ke dalam database</strong>. Identifier hash tersebut hanya digunakan secara otomatis oleh sistem untuk membatasi frekuensi kirim (rate limiting) dan memblokir spammer jika dilaporkan.
            </p>
          </Card>

          {/* Card 3: Hak Penghapusan */}
          <Card variant="white" shadow="md" className="p-6 sm:p-8 space-y-3 border-[3px] border-[#111111]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[6px] bg-[#8ED081] border-[2px] border-[#111111] flex items-center justify-center text-[#111111]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black uppercase text-[#111111]">
                3. Hak Penghapusan Pesan
              </h2>
            </div>
            <p className="text-sm font-medium text-[#111111]/80 leading-relaxed">
              Pemilik website memiliki hak penuh untuk menghapus pesan apa pun dari kotak masuk secara berkala atau seketika jika pesan dinilai tidak relevan, kasar, atau merugikan.
            </p>
          </Card>

          {/* Card 4: Moderasi & Pelaporan */}
          <Card variant="white" shadow="md" className="p-6 sm:p-8 space-y-3 border-[3px] border-[#111111]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[6px] bg-[#FF6B9A] border-[2px] border-[#111111] flex items-center justify-center text-[#111111]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black uppercase text-[#111111]">
                4. Batasan &amp; Moderasi
              </h2>
            </div>
            <p className="text-sm font-medium text-[#111111]/80 leading-relaxed">
              RPLTwoFess adalah wadah untuk bercerita, menyapa, dan saling menghargai. Penggunaan platform untuk ancaman kekerasan fisik, doxxing, pornografi ilegal, atau pencemaran nama baik yang melanggar hukum tidak ditoleransi dan dapat diblokir permanen oleh sistem.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
