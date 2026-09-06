"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { EASE_NATURAL } from "@/lib/motion";

const STEPS = [
  {
    number: "01",
    label: "Step 1",
    title: "Buka Form Pesan",
    desc: "Cukup klik tombol “Kirim Pesan”. Tidak ada formulir pendaftaran, tidak ada login akun Google, dan tidak perlu memasukkan nama.",
  },
  {
    number: "02",
    label: "Step 2",
    title: "Tulis Pesanmu",
    desc: "Tuliskan pertanyaan, cerita seru, kritik membangun, kesan, atau uneg-unegmu hingga 500 karakter dengan bebas dan jujur.",
  },
  {
    number: "03",
    label: "Step 3",
    title: "Pesan Sampai di Dashboard",
    desc: "Pesanmu langsung masuk ke dashboard penerima secara rahasia dan aman. Identitasmu tetap menjadi rahasia selamanya.",
  },
];

export function WorkflowSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: EASE_NATURAL,
      },
    },
  };

  return (
    <section id="cara-kerja" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: EASE_NATURAL }}
        className="space-y-3"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[#3D5CFF]">
          &#8226; ALUR SEDERHANA
        </span>
        <h2 className="text-4xl sm:text-6xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
          BAGAIMANA CARA KERJANYA?
        </h2>
        <p className="text-sm sm:text-base text-[#9A9DA5] max-w-md">
          Sangat sederhana. Pengirim tidak perlu mendaftar atau membuat akun apa pun.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
      >
        {STEPS.map((step) => (
          <motion.div key={step.number} variants={cardVariants}>
            <Card
              variant="surface"
              className="p-8 space-y-4 relative group hover:border-[#3D5CFF]/50 transition-colors duration-200 h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl text-[#3D5CFF]/40 group-hover:text-[#3D5CFF] group-hover:scale-105 transition-all duration-200 inline-block origin-left">
                    {step.number}
                  </span>
                  <span className="text-xs font-mono text-[#9A9DA5] uppercase">
                    {step.label}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#F5F5F2]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#9A9DA5] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Step indicator line */}
              <div className="w-full h-0.5 bg-[#2A2D34] mt-4 overflow-hidden rounded-full">
                <div className="h-full w-full bg-[#3D5CFF] opacity-20 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
