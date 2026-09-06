"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Mail, MailOpen, Calendar } from "lucide-react";
import { EASE_NATURAL } from "@/lib/motion";

export type StatIconType = "total" | "unread" | "today";

export interface StatItem {
  iconType: StatIconType;
  label: string;
  value: number;
  accentColor: string;
  iconBg: string;
}

const ICON_MAP = {
  total: Mail,
  unread: MailOpen,
  today: Calendar,
};

interface DashboardStatsProps {
  items: StatItem[];
}

export function DashboardStats({ items }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((s, idx) => {
        const Icon = ICON_MAP[s.iconType] || Mail;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05, ease: EASE_NATURAL }}
          >
            <Card
              variant="surface"
              className="p-6 border border-[#2A2D34] relative overflow-hidden h-full hover:border-[#3E424C] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono tracking-widest uppercase text-[#9A9DA5]">
                  {s.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center ${s.iconBg}`}
                >
                  <Icon className={`w-4 h-4 ${s.accentColor}`} />
                </div>
              </div>
              <span className="block font-display text-5xl sm:text-6xl tracking-tight text-[#F5F5F2]">
                {s.value}
              </span>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
