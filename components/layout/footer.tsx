import Link from "next/link";
import { MessageSquare, Shield, Lock, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#111111] text-[#F6F3EA] border-t-[4px] border-[#111111] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[6px] bg-[#FFD84D] border-[2px] border-[#FFFFFF] flex items-center justify-center text-[#111111]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tighter uppercase text-[#FFFFFF] block leading-none">
                  RPLTwoFess
                </span>
                <span className="text-[10px] font-bold text-[#FFD84D] uppercase tracking-wider">
                  Satu Kelas. Banyak Cerita.
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-[#F6F3EA]/70 max-w-sm leading-relaxed">
              Platform pesan dan confession anonim resmi kelas RPL/PPLG 2. Tempat untuk menyampaikan pesan, cerita, pertanyaan, atau kesanmu tanpa nama.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 text-[#8ED081]">
                <Shield className="w-3 h-3" /> Anti-Spam
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 text-[#5B7CFF]">
                <Lock className="w-3 h-3" /> HMAC Hashing
              </span>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div>
            <h4 className="font-black uppercase text-sm tracking-wider text-[#FFD84D] mb-3">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link
                  href="/#cara-kerja"
                  className="hover:text-[#FFD84D] transition-colors"
                >
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link
                  href="/send"
                  className="hover:text-[#FFD84D] transition-colors font-bold text-[#FFFFFF]"
                >
                  Kirim Pesan
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#FFD84D] transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-[#FFD84D] transition-colors"
                >
                  Owner Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Etika & Aturan */}
          <div>
            <h4 className="font-black uppercase text-sm tracking-wider text-[#FF6B9A] mb-3">
              Aturan Komunitas
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-[#F6F3EA]/70">
              <li>Dilarang ujaran kebencian &amp; SARA</li>
              <li>Dilarang ancaman kekerasan fisik</li>
              <li>Dilarang menyebarkan privasi orang lain</li>
              <li>Spam &amp; pelecehan otomatis diblokir</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#FFFFFF]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-[#F6F3EA]/60">
          <p>© {new Date().getFullYear()} RPLTwoFess • Kelas RPL/PPLG 2.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6B9A] fill-[#FF6B9A]" />
            <span>untuk kebersamaan kelas.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
