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
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#3D5CFF]">
            &#8226; PESAN MASUK &#8226;
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
            KOTAK MASUK
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9DA5] mt-0.5">
            Daftar semua pesan anonim yang kamu terima.
          </p>
        </div>

        {/* Quick Stat Badges */}
        <div className="flex items-center gap-3">
          <div className="p-3 px-4 rounded-xl bg-[#111318] border border-[#2A2D34] flex items-center gap-3 shadow-lg shadow-black/40">
            <Mail className="w-5 h-5 text-[#7B8DFF]" />
            <div>
              <span className="block font-display text-2xl leading-none text-[#F5F5F2]">
                {totalCount}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A9DA5]">
                Total
              </span>
            </div>
          </div>

          <div className="p-3 px-4 rounded-xl bg-[#111318] border border-[#3D5CFF]/40 flex items-center gap-3 shadow-[0_0_20px_-5px_rgba(61,92,255,0.2)]">
            <MailOpen className="w-5 h-5 text-[#3D5CFF]" />
            <div>
              <span className="block font-display text-2xl leading-none text-[#F5F5F2]">
                {unreadCount}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8DFF]">
                Belum Dibaca
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Link Banner */}
      <CopyLinkBanner />

      {/* Toolbar */}
      <Suspense fallback={<div className="h-14 bg-[#111318] border border-[#2A2D34] rounded-2xl animate-pulse" />}>
        <InboxToolbar
          currentFilter={filter}
          currentSort={sort}
          searchQuery={search}
        />
      </Suspense>

      {/* Messages List or Empty State */}
      {messages.length === 0 ? (
        <EmptyState
          title={search ? "Tidak Ada Pesan yang Cocok" : "Belum Ada Pesan"}
          description={
            search
              ? `Tidak ditemukan pesan dengan kata kunci "${search}". Coba cari kata lain.`
              : "Belum ada pesan. Pesan anonim yang masuk untukmu akan muncul di sini."
          }
          icon={<Inbox className="w-6 h-6 text-[#7B8DFF]" />}
        />
      ) : (
        <div className="space-y-3.5">
          {messages.map((msg) => (
            <MessageCard key={msg.id} message={msg} />
          ))}
        </div>
      )}
    </div>
  );
}
