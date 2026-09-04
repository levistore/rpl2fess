import Link from "next/link";
import { getDashboardStats, getInboxMessages } from "@/lib/queries/messages";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCard } from "@/components/messages/message-card";
import {
  Mail,
  MailOpen,
  Calendar,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Send,
} from "lucide-react";

export default async function DashboardPage() {
  const [stats, { messages }] = await Promise.all([
    getDashboardStats(),
    getInboxMessages({ limit: 5 }),
  ]);

  const statCards = [
    {
      label: "Total Pesan",
      value: stats.totalMessages,
      icon: Mail,
      bg: "bg-[#FFFFFF]",
      accent: "text-[#5B7CFF]",
    },
    {
      label: "Belum Dibaca",
      value: stats.unreadMessages,
      icon: MailOpen,
      bg: stats.unreadMessages > 0 ? "bg-[#FFD84D]" : "bg-[#FFFFFF]",
      accent: "text-[#111111]",
    },
    {
      label: "Pesan Hari Ini",
      value: stats.todayMessages,
      icon: Calendar,
      bg: "bg-[#FFFFFF]",
      accent: "text-[#8ED081]",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#5B7CFF] border-[1.5px] border-[#111111] text-xs font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Owner Overview
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
            Dashboard
          </h1>
          <p className="text-sm font-bold text-[#111111]/70 mt-0.5">
            Pantau pesan dan confession masuk untuk kelas RPL/PPLG 2.
          </p>
        </div>

        <Link href="/send" target="_blank">
          <Button variant="secondary" size="md">
            <Send className="w-4 h-4 mr-2" /> Buka Halaman Kirim <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.label}
              variant="white"
              shadow="md"
              className={`p-6 ${s.bg} border-[3px] border-[#111111]`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#111111]/70">
                  {s.label}
                </span>
                <Icon className={`w-5 h-5 ${s.accent}`} />
              </div>
              <span className="block font-black text-4xl sm:text-5xl tracking-tight text-[#111111]">
                {s.value}
              </span>
            </Card>
          );
        })}
      </div>

      {/* Recent Messages Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111]">
            Pesan Terbaru
          </h2>
          <Link
            href="/dashboard/inbox"
            className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#5B7CFF] hover:underline"
          >
            Lihat Semua Inbox <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {messages.length === 0 ? (
          <Card variant="white" shadow="sm" className="p-8 text-center border-[3px] border-[#111111]">
            <p className="text-sm font-bold text-[#111111]/70">
              Belum ada pesan yang masuk. Bagikan link website ke teman-teman di luar kelas!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <MessageCard key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
