"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquare, Menu, X, Shield, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090B]/85 backdrop-blur-md border-b border-[#2A2D34]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="w-9 h-9 rounded-lg bg-[#181B21] border border-[#2A2D34] flex items-center justify-center text-[#7B8DFF] group-hover:border-[#3D5CFF] group-hover:shadow-[0_0_15px_-3px_rgba(61,92,255,0.4)] transition-all">
            <MessageSquare className="w-4 h-4 text-[#3D5CFF]" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-[#F5F5F2] block leading-none font-display">
              RPLTWOFESS
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#9A9DA5] uppercase">
              X RPL 2 &#8226; 2026
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/#cara-kerja"
            className="text-xs font-medium uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors"
          >
            Cara Kerja
          </Link>
          <Link
            href="/#dokumentasi"
            className="text-xs font-medium uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors"
          >
            Dokumentasi
          </Link>
          <Link
            href="/privacy"
            className="text-xs font-medium uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-[#42D392]" /> Privasi
          </Link>

          <div className="flex items-center gap-3 pl-2 border-l border-[#2A2D34]">
            <Link href="/login">
              <Button variant="ghost" size="sm">
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
        <div className="flex md:hidden items-center gap-2.5">
          <Link href="/send">
            <Button variant="primary" size="sm">
              Kirim
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Buka menu navigasi"
            className="p-2 rounded-lg border border-[#2A2D34] bg-[#111318] text-[#F5F5F2] hover:bg-[#181B21] transition-colors cursor-pointer"
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
        <div className="md:hidden border-t border-[#2A2D34] bg-[#08090B] p-5 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-150">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-3 text-sm font-medium tracking-wide text-[#F5F5F2] border border-[#2A2D34] rounded-xl bg-[#111318]"
          >
            Beranda
          </Link>
          <Link
            href="/#cara-kerja"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-3 text-sm font-medium tracking-wide text-[#F5F5F2] border border-[#2A2D34] rounded-xl bg-[#111318]"
          >
            Cara Kerja
          </Link>
          <Link
            href="/#dokumentasi"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-3 text-sm font-medium tracking-wide text-[#F5F5F2] border border-[#2A2D34] rounded-xl bg-[#111318]"
          >
            Dokumentasi Kelas
          </Link>
          <Link
            href="/privacy"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-3 text-sm font-medium tracking-wide text-[#F5F5F2] border border-[#2A2D34] rounded-xl bg-[#111318] flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-[#42D392]" /> Kebijakan Privasi
          </Link>
          <div className="pt-2 border-t border-[#2A2D34] flex flex-col gap-2.5">
            <Link href="/send" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                <Send className="w-4 h-4 mr-2" /> Kirim Pesan Sekarang
              </Button>
            </Link>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full">
                Owner Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
