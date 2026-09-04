import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08090B] flex flex-col justify-center items-center px-4 py-12 text-[#F5F5F2] relative overflow-hidden">
      {/* Subtle radial ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(61,92,255,0.1),transparent_65%)]" />

      <div className="w-full max-w-lg text-center relative z-10">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#111318] border border-[#2A2D34] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-6 relative">
          {/* Scrapbook Tape */}
          <div className="scrapbook-tape -top-3 left-1/2 -translate-x-1/2 w-28 h-5 rotate-1" />

          <span className="block font-display text-8xl sm:text-9xl tracking-wider text-[#F5F5F2] select-none drop-shadow-[0_4px_24px_rgba(61,92,255,0.25)]">
            404
          </span>

          <p className="font-handwriting text-xl text-[#7B8DFF] -rotate-1">
            halaman ini tidak ditemukan atau sudah dipindahkan...
          </p>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-[#F5F5F2]">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-sm text-[#9A9DA5] max-w-sm mx-auto leading-relaxed">
              Tautan yang kamu tuju mungkin salah ketik, sudah dihapus, atau belum pernah dibuat.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Link href="/">
              <Button variant="primary" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
