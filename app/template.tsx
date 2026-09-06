"use client";

import * as React from "react";
import { motion } from "motion/react";
import { EASE_NATURAL } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: EASE_NATURAL }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
