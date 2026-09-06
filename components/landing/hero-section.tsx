"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareTrigger } from "@/components/share/share-trigger";
import { HeroComposerPreview } from "@/components/landing/hero-composer-preview";
import { DocumentationItem } from "@/types/database";
import { motion } from "motion/react";
import { EASE_NATURAL } from "@/lib/motion";

interface HeroSectionProps {
  featuredDoc?: DocumentationItem | null;
}

export function HeroSection({ featuredDoc }: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: EASE_NATURAL,
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3D5CFF]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Editorial Statement */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 space-y-6 text-left"
        >
          {/* 1. Eyebrow Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181B21] border border-[#2A2D34] text-xs font-mono text-[#7B8DFF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D5CFF] shrink-0" />
              <span className="tracking-widest uppercase text-[11px]">
                RPLTWOFESS / XI RPL 2
              </span>
            </div>
          </motion.div>

          {/* 2. Headline & Handwriting */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-normal uppercase tracking-tight leading-[0.92] text-[#F5F5F2]">
              SATU KELAS.<br />
              <span className="text-[#3D5CFF]">BANYAK CERITA.</span>
            </h1>
            <p className="font-handwriting text-2xl text-[#9A9DA5] pt-1">
              &ldquo;sampaikan apa yang ingin kamu katakan kepada seseorang...&rdquo;
            </p>
          </motion.div>

          {/* 3. Description */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-[#9A9DA5] max-w-lg leading-relaxed font-normal"
          >
            Tempat buat menyampaikan pesan, cerita, pertanyaan, atau sesuatu yang ingin kamu sampaikan kepada seseorang secara anonim tanpa perlu mencantumkan nama.
          </motion.p>

          {/* 4. CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-md"
          >
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
          </motion.div>

          {/* 5. Privacy Badges & Share QR Trigger */}
          <motion.div
            variants={itemVariants}
            className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#9A9DA5]/80 font-mono"
          >
            <div className="flex flex-wrap items-center gap-4">
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
            <ShareTrigger variant="badge" />
          </motion.div>
        </motion.div>

        {/* Right Column: Photographic Scrapbook Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: EASE_NATURAL }}
          className="lg:col-span-6 lg:pl-4"
        >
          <HeroComposerPreview item={featuredDoc} />
        </motion.div>
      </div>
    </section>
  );
}
