"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquare, Menu, X, ShieldCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6F3EA] border-b-[3px] border-[#111111]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-10 h-10 rounded-[6px] bg-[#5B7CFF] border-[2.5px] border-[#111111] shadow-[2.5px_2.5px_0_#111111] flex items-center justify-center group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1.5px_1.5px_0_#111111] transition-all">
            <MessageSquare className="w-5 h-5 text-[#111111]" />
          </div>
          <div>
            <span className="font-black text-2xl tracking-tighter text-[#111111] uppercase block leading-none">
              RPLTwoFess
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#111111]/70">
              RPL / PPLG 2
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#cara-kerja"
            className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-[#5B7CFF] transition-colors"
          >
            Cara Kerja
          </Link>
          <Link
            href="/#keamanan"
            className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-[#5B7CFF] transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-[#8ED081]" /> Keamanan
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-[#5B7CFF] transition-colors"
          >
            Privasi
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="white" size="sm">
                Owner Login
              </Button>
            </Link>
            <Link href="/send">
              <Button variant="primary" size="sm">
                <Send className="w-3.5 h-3.5 mr-1.5" /> Kirim Pesan
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/send">
            <Button variant="primary" size="sm">
              Kirim
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Buka menu navigasi"
            className="p-2 rounded-[6px] border-[2.5px] border-[#111111] bg-[#FFFFFF] shadow-[2px_2px_0_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-[3px] border-[#111111] bg-[#F6F3EA] p-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-150">
          <Link
            href="/#cara-kerja"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 font-bold uppercase tracking-wider text-sm border-[2px] border-[#111111] rounded-[6px] bg-[#FFFFFF] shadow-[2px_2px_0_#111111]"
          >
            Cara Kerja
          </Link>
          <Link
            href="/#keamanan"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 font-bold uppercase tracking-wider text-sm border-[2px] border-[#111111] rounded-[6px] bg-[#FFFFFF] shadow-[2px_2px_0_#111111] flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#8ED081]" /> Keamanan &amp; Privasi
          </Link>
          <Link
            href="/privacy"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 font-bold uppercase tracking-wider text-sm border-[2px] border-[#111111] rounded-[6px] bg-[#FFFFFF] shadow-[2px_2px_0_#111111]"
          >
            Kebijakan Privasi
          </Link>
          <div className="pt-2 border-t-[2px] border-[#111111] flex flex-col gap-2">
            <Link href="/send" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                <Send className="w-4 h-4 mr-2" /> Kirim Pesan Sekarang
              </Button>
            </Link>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="white" className="w-full">
                Owner Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
