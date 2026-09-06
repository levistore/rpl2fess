"use client";

import * as React from "react";
import Link from "next/link";
import { Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { EASE_NATURAL } from "@/lib/motion";

export function CtaSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="py-20 px-4 sm:px-6 bg-[#111318] border-t border-[#2A2D34] relative overflow-hidden">
      <div className="absolute inset-0 bg-radial from-[#3D5CFF]/10 to-transparent pointer-events-none" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-4xl mx-auto text-center space-y-6 relative z-10"
      >
        <motion.span
          variants={itemVariants}
          className="text-xs font-mono uppercase tracking-widest text-[#7B8DFF] block"
        >
          &#8226; SATU KELAS. BANYAK CERITA &#8226;
        </motion.span>
        <motion.h2
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]"
        >
          PUNYA SESUATU YANG INGIN DISAMPAIKAN?
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base text-[#9A9DA5] max-w-lg mx-auto leading-relaxed"
        >
          Jangan dipendam. Kirimkan ceritamu, pertanyaan, atau pesan anonim untuk seseorang sekarang juga.
        </motion.p>
        <motion.div variants={itemVariants} className="pt-2">
          <Link href="/send">
            <Button variant="primary" size="lg" className="px-8 text-base">
              <Send className="w-4 h-4 mr-2" /> Buka Form Kirim Pesan <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
