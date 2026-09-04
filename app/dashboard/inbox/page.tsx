import { Suspense } from "react";
import { getInboxMessages } from "@/lib/queries/messages";
import { MessageCard } from "@/components/messages/message-card";
import { InboxToolbar } from "@/components/inbox/inbox-toolbar";
import { CopyLinkBanner } from "@/components/inbox/copy-link-banner";
import { EmptyState } from "@/components/ui/states";
import { Inbox, MailOpen, Mail } from "lucide-react";

interface InboxPageProps {
  searchParams: Promise<{
    filter?: "all" | "unread" | "read";
    sort?: "newest" | "oldest";
    q?: string;
  }>;
}

export default async function InboxPage({ searchParams }: InboxPageProps) {
  const params = await searchParams;
  const filter = params.filter || "all";
  const sort = params.sort || "newest";
  const search = params.q || "";

  const { messages, unreadCount, totalCount } = await getInboxMessages({
    filter,
    sort,
    search,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
            Kotak Masuk
          </h1>
          <p className="text-sm font-bold text-[#111111]/70 mt-0.5">
            Daftar semua pesan dan confession anonim yang diterima.
          </p>
        </div>

        {/* Quick Stat Badges */}
        <div className="flex items-center gap-3">
          <div className="p-3 px-4 rounded-[6px] bg-[#FFFFFF] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#5B7CFF]" />
            <div>
              <span className="block font-black text-xl leading-none text-[#111111]">
                {totalCount}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#111111]/60">
                Total
              </span>
            </div>
          </div>

          <div className="p-3 px-4 rounded-[6px] bg-[#FFD84D] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] flex items-center gap-3">
            <MailOpen className="w-5 h-5 text-[#111111]" />
            <div>
              <span className="block font-black text-xl leading-none text-[#111111]">
                {unreadCount}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#111111]/80">
                Belum Dibaca
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Link Banner */}
      <CopyLinkBanner />

      {/* Toolbar */}
      <Suspense fallback={<div className="h-14 bg-white border-[3px] border-[#111111] rounded-[8px]" />}>
        <InboxToolbar
          currentFilter={filter}
          currentSort={sort}
          searchQuery={search}
        />
      </Suspense>

      {/* Messages List or Empty State */}
      {messages.length === 0 ? (
        <EmptyState
          title={search ? "Tidak Ada Pesan yang Cocok" : "Belum Ada Pesan."}
          description={
            search
              ? `Tidak ditemukan pesan dengan kata kunci "${search}". Coba cari kata lain.`
              : "Sepertinya kotak masuk masih sepi. Bagikan link /send ke teman-teman di luar kelas untuk mulai menerima cerita."
          }
          icon={<Inbox className="w-8 h-8 text-[#111111]" />}
        />
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageCard key={msg.id} message={msg} />
          ))}
        </div>
      )}
    </div>
  );
}
