"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Message } from "@/types/database";
import { formatDate } from "@/lib/utils";
import {
  markMessageReadAction,
  markMessageUnreadAction,
} from "@/lib/actions/inbox";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  Flag,
  ShieldBan,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportModal } from "./report-modal";
import { BlockModal } from "./block-modal";
import { DeleteModal } from "./delete-modal";

interface MessageDetailViewProps {
  message: Message;
  recipientName?: string;
}

export function MessageDetailView({ message, recipientName = "Owner RPL 2" }: MessageDetailViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isRead, setIsRead] = React.useState(message.is_read);

  // Auto-mark as read on visit if unread
  React.useEffect(() => {
    let isMounted = true;
    if (!message.is_read) {
      markMessageReadAction(message.id).then(() => {
        if (isMounted) {
          setIsRead(true);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [message.id, message.is_read]);

  // Modals
  const [showReport, setShowReport] = React.useState(false);
  const [showBlock, setShowBlock] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);

  const toggleRead = async () => {
    const next = !isRead;
    setIsRead(next);
    if (next) {
      await markMessageReadAction(message.id);
      toast("Ditandai sudah dibaca", "info");
    } else {
      await markMessageUnreadAction(message.id);
      toast("Ditandai belum dibaca", "info");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back to inbox button */}
      <div>
        <Link
          href="/dashboard/inbox"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Kotak Masuk
        </Link>
      </div>

      {/* Digital Letter / Archived Paper Note */}
      <div className="relative rounded-2xl bg-[#0E1015] border border-[#2A2D34] p-6 sm:p-10 space-y-6 shadow-2xl shadow-black/80">
        {/* Tape Accent */}
        <div className="scrapbook-tape w-24 -top-3 left-8 rotate-[-1deg]" />

        {/* Paper Sheet Header */}
        <div className="flex items-center justify-between border-b border-[#2A2D34] pb-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#3D5CFF] font-semibold tracking-wider uppercase">
              ARCHIVE / MESSAGE #{message.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <span className="text-[#9A9DA5] uppercase tracking-wider text-[11px]">
            RPL 2 / 2026
          </span>
        </div>

        {/* Dari & Untuk Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#181B21] border border-[#2A2D34] text-xs font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-[#7B8DFF] uppercase tracking-widest block font-semibold">
              DARI
            </span>
            <span className="text-base font-semibold text-[#F5F5F2] font-display uppercase tracking-tight block">
              {message.sender_name || "Anonim"}
            </span>
            {!message.sender_name && (
              <span className="text-[10px] text-[#9A9DA5] block">
                Identitas dirahasiakan
              </span>
            )}
          </div>

          <div className="space-y-1 sm:border-l sm:border-[#2A2D34] sm:pl-4">
            <span className="text-[10px] text-[#7B8DFF] uppercase tracking-widest block font-semibold">
              UNTUK
            </span>
            <span className="text-base font-semibold text-[#F5F5F2] font-display uppercase tracking-tight block">
              {recipientName}
            </span>
            <span className="text-[10px] text-[#9A9DA5] block">
              Penerima Pesan Personal
            </span>
          </div>
        </div>

        {/* Handwritten prompt */}
        <div className="flex items-center justify-between">
          <p className="font-handwriting text-xl text-[#7B8DFF]">
            Pesan anonim untukmu:
          </p>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#2A2D34] text-[#9A9DA5]">
            TERVERIFIKASI PRIVAT
          </span>
        </div>

        {/* Digital Letter Message Body with Paper Lines */}
        <div
          className="py-6 px-4 rounded-xl bg-[#111318]/50 border border-[#2A2D34]/50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 31px, rgba(255, 255, 255, 0.04) 31px, rgba(255, 255, 255, 0.04) 32px)",
            lineHeight: "32px",
          }}
        >
          <p className="text-xl sm:text-2xl font-normal text-[#F5F5F2] leading-[32px] break-words font-sans selection:bg-[#3D5CFF] selection:text-white">
            &ldquo;{message.content}&rdquo;
          </p>
        </div>

        {/* Thin Rule Divider */}
        <div className="border-t border-[#2A2D34]" />

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1 text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#9A9DA5]/70 block uppercase tracking-wider">
              RECEIVED
            </span>
            <span className="text-[#F5F5F2] mt-0.5 block">
              {formatDate(message.created_at)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#9A9DA5]/70 block uppercase tracking-wider">
              STATUS
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isRead ? "bg-[#9A9DA5]" : "bg-[#3D5CFF]"
                )}
              />
              <span
                className={cn(
                  "font-bold uppercase",
                  isRead ? "text-[#9A9DA5]" : "text-[#3D5CFF]"
                )}
              >
                {isRead ? "READ" : "UNREAD"}
              </span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#9A9DA5]/70 block uppercase tracking-wider">
              SECURITY
            </span>
            <span className="text-[#42D392] mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> HASH VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons below Paper Sheet */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={toggleRead}
          >
            {isRead ? (
              <>
                <EyeOff className="w-4 h-4 mr-1.5" /> Tandai Belum Dibaca
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1.5" /> Tandai Sudah Dibaca
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowReport(true)}
          >
            <Flag className="w-4 h-4 mr-1.5" /> Laporkan
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowBlock(true)}
          >
            <ShieldBan className="w-4 h-4 mr-1.5" /> Blokir Pengirim
          </Button>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="w-4 h-4 mr-1.5" /> Hapus
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ReportModal
        messageId={message.id}
        isOpen={showReport}
        onClose={() => setShowReport(false)}
      />

      <BlockModal
        messageId={message.id}
        isOpen={showBlock}
        onClose={() => setShowBlock(false)}
        onSuccess={() => router.push("/dashboard/inbox")}
      />

      <DeleteModal
        messageId={message.id}
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onSuccess={() => router.push("/dashboard/inbox")}
      />
    </div>
  );
}
