import Link from "next/link";
import Image from "next/image";
import { Shield, Lock, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#08090B] text-[#9A9DA5] border-t border-[#2A2D34] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#181B21] border border-[#2A2D34] flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                <Image
                  src="/images/brand/rpl-logo.png"
                  alt="RPL Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-2xl tracking-tight text-[#F5F5F2] block leading-none font-display">
                  RPLTWOFESS
                </span>
                <span className="text-[11px] font-handwriting text-[#7B8DFF] text-base block -mt-0.5">
                  Satu Kelas. Banyak Cerita.
                </span>
              </div>
            </div>
            <p className="text-sm text-[#9A9DA5] max-w-md leading-relaxed font-normal">
              Platform pesan anonim personal dari kelas XI RPL 2. Tempat untuk menyampaikan pesan, cerita, pertanyaan, atau sesuatu yang ingin kamu sampaikan kepada seseorang secara rahasia tanpa perlu nama.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-[#111318] border border-[#2A2D34] text-[#42D392]">
                <Shield className="w-3 h-3" /> Anti-Spam
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-[#111318] border border-[#2A2D34] text-[#7B8DFF]">
                <Lock className="w-3 h-3" /> HMAC Hashing
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-xs tracking-wider uppercase text-[#F5F5F2]">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9A9DA5]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#F5F5F2] transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/send"
                  className="text-[#7B8DFF] hover:text-[#536DFF] transition-colors font-medium flex items-center gap-1"
                >
                  Kirim Pesan Anonim &#8594;
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#F5F5F2] transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-[#F5F5F2] transition-colors"
                >
                  Owner Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community Ethics */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-xs tracking-wider uppercase text-[#F5F5F2]">
              Etika Pesan
            </h4>
            <ul className="space-y-2 text-xs text-[#9A9DA5]/80 leading-relaxed">
              <li>&#8226; Saling menghargai sesama</li>
              <li>&#8226; Tidak ada ujaran kebencian atau SARA</li>
              <li>&#8226; Dilarang menyebarkan privasi orang lain</li>
              <li>&#8226; Spammer diblokir otomatis oleh sistem</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2A2D34] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A9DA5]/60 font-mono">
          <p>&#169; {new Date().getFullYear()} RPLTwoFess &#8226; Kelas XI RPL 2.</p>
          <div className="flex items-center gap-1 text-xs">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-[#FF4D4D] fill-[#FF4D4D]" />
            <span>untuk dokumentasi kelas kita.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
