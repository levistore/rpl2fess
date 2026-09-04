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
      label: "TOTAL PESAN",
      value: stats.totalMessages,
      icon: Mail,
      accentColor: "text-[#7B8DFF]",
      iconBg: "bg-[#3D5CFF]/15 border-[#3D5CFF]/30",
    },
    {
      label: "BELUM DIBACA",
      value: stats.unreadMessages,
      icon: MailOpen,
      accentColor: stats.unreadMessages > 0 ? "text-[#3D5CFF]" : "text-[#9A9DA5]",
      iconBg: stats.unreadMessages > 0 ? "bg-[#3D5CFF]/20 border-[#3D5CFF]/40 shadow-[0_0_15px_rgba(61,92,255,0.4)]" : "bg-[#181B21] border-[#2A2D34]",
    },
    {
      label: "HARI INI",
      value: stats.todayMessages,
      icon: Calendar,
      accentColor: "text-[#42D392]",
      iconBg: "bg-[#42D392]/15 border-[#42D392]/30",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B21] border border-[#2A2D34] text-xs font-mono text-[#7B8DFF] mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3D5CFF]" />
            <span>OWNER OVERVIEW &#8226; PRIVAT</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
            DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9DA5] mt-0.5">
            Pantau pesan anonim yang masuk untukmu secara real-time.
          </p>
        </div>

        <Link href="/send" target="_blank">
          <Button variant="primary" size="md">
            <Send className="w-3.5 h-3.5 mr-2" /> Buka Halaman Kirim <ExternalLink className="w-3 h-3 ml-1.5" />
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
              variant="surface"
              className="p-6 border border-[#2A2D34] relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono tracking-widest uppercase text-[#9A9DA5]">
                  {s.label}
                </span>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${s.iconBg}`}>
                  <Icon className={`w-4 h-4 ${s.accentColor}`} />
                </div>
              </div>
              <span className="block font-display text-5xl sm:text-6xl tracking-tight text-[#F5F5F2]">
                {s.value}
              </span>
            </Card>
          );
        })}
      </div>

      {/* Recent Messages Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
              PESAN TERBARU
            </h2>
            <p className="text-xs text-[#9A9DA5]">
              Pesan anonim terbaru yang kamu terima.
            </p>
          </div>
          <Link
            href="/dashboard/inbox"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#7B8DFF] hover:text-[#536DFF] transition-colors"
          >
            Lihat Semua Inbox <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        {messages.length === 0 ? (
          <Card variant="surface" className="p-8 text-center border border-[#2A2D34]">
            <p className="text-sm text-[#9A9DA5]">
              Belum ada pesan. Pesan anonim yang masuk untukmu akan muncul di sini. Bagikan tautan /send untuk mulai menerima pesan!
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
