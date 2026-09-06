"use client";

import * as React from "react";
import { EyeOff, Lock, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { EASE_NATURAL } from "@/lib/motion";

const SECURITY_ITEMS = [
  {
    title: "100% Tanpa Identitas",
    desc: "Kami tidak pernah meminta data pribadi, nama, akun media sosial, atau nomor telepon dari pengirim.",
    icon: EyeOff,
    iconColor: "text-[#7B8DFF]",
    iconBg: "bg-[#3D5CFF]/15 border-[#3D5CFF]/30",
  },
  {
    title: "Anti-Spam & Rate Limit",
    desc: "Dilengkapi cooldown otomatis dan batas pengiriman terenkripsi untuk mencegah flooding pesan oleh bot.",
    icon: Lock,
    iconColor: "text-[#FFB84D]",
    iconBg: "bg-[#FFB84D]/15 border-[#FFB84D]/30",
  },
  {
    title: "Pemblokiran Spammer",
    desc: "Pesan bernada pelecehan atau ancaman dapat langsung diblokir secara permanen oleh penerima.",
    icon: ShieldAlert,
    iconColor: "text-[#FF4D4D]",
    iconBg: "bg-[#FF4D4D]/15 border-[#FF4D4D]/30",
  },
];

export function SecuritySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <section id="keamanan" className="py-24 px-4 sm:px-6 bg-[#08090B] border-t border-[#2A2D34]">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: EASE_NATURAL }}
          className="space-y-3 text-left"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#42D392]">
            &#8226; KEAMANAN TERINTEGRASI
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
            ANONIM, NAMUN TETAP AMAN.
          </h2>
          <p className="text-sm sm:text-base text-[#9A9DA5] max-w-lg">
            RPLTwoFess dirancang untuk interaksi yang sehat, jujur, dan menyenangkan tanpa menjadi sarang cyberbullying.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SECURITY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} variants={cardVariants}>
                <Card
                  variant="surface"
                  className="p-7 space-y-4 h-full group hover:border-[#3E424C] transition-colors duration-200"
                >
                  <div
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center ${item.iconBg} ${item.iconColor} group-hover:scale-105 transition-transform duration-200`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-[#F5F5F2]">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
