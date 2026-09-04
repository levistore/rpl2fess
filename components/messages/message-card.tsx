"use client";

import * as React from "react";
import Link from "next/link";
import { Message } from "@/types/database";
import { formatDate } from "@/lib/utils";
import {
  markMessageReadAction,
  markMessageUnreadAction,
} from "@/lib/actions/inbox";
import { useToast } from "@/components/ui/toast";
import {
  Eye,
  EyeOff,
  Trash2,
  Flag,
  ShieldBan,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { ReportModal } from "./report-modal";
import { BlockModal } from "./block-modal";
import { DeleteModal } from "./delete-modal";

interface MessageCardProps {
  message: Message;
  recipientName?: string;
}

export function MessageCard({ message, recipientName = "Owner RPL 2" }: MessageCardProps) {
  const { toast } = useToast();
  const [isRead, setIsRead] = React.useState(message.is_read);
  const [isUpdatingRead, setIsUpdatingRead] = React.useState(false);

  // Modals state
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showBlockModal, setShowBlockModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const toggleReadStatus = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdatingRead) return;

    setIsUpdatingRead(true);
    const newStatus = !isRead;
    setIsRead(newStatus);

    try {
      if (newStatus) {
        await markMessageReadAction(message.id);
        toast("Ditandai sudah dibaca", "info");
      } else {
        await markMessageUnreadAction(message.id);
        toast("Ditandai belum dibaca", "info");
      }
    } catch {
      setIsRead(!newStatus);
      toast("Gagal mengubah status pesan", "error");
    } finally {
      setIsUpdatingRead(false);
    }
  };

  return (
    <>
      <div
        className={`group relative rounded-2xl border transition-all duration-200 p-5 sm:p-6 ${
          !isRead
            ? "bg-[#111318] border-[#3D5CFF]/30 shadow-xl shadow-black/60 hover:border-[#3D5CFF]/60"
            : "bg-[#111318]/60 border-[#2A2D34] opacity-80 hover:opacity-100 hover:border-[#3E424C]"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            {!isRead ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#7B8DFF]">
                <span className="w-2 h-2 rounded-full bg-[#3D5CFF] animate-pulse shadow-[0_0_8px_#3D5CFF]" />
                <span>Pesan Baru</span>
              </span>
            ) : (
              <span className="text-xs font-mono text-[#9A9DA5]">
                Sudah Dibaca
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-[#9A9DA5]">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(message.created_at)}</span>
          </div>
        </div>

        {/* Sender & Recipient Tag Info */}
        <div className="flex items-center gap-2 text-xs font-mono mb-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#181B21] border border-[#2A2D34]">
            <span className="text-[10px] text-[#7B8DFF] uppercase tracking-wider">Dari:</span>
            <span className="text-[#F5F5F2] font-medium text-xs font-sans">
              {message.sender_name || "Anonim"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#181B21] border border-[#2A2D34]">
            <span className="text-[10px] text-[#7B8DFF] uppercase tracking-wider">Untuk:</span>
            <span className="text-[#F5F5F2] font-medium text-xs font-sans">
              {recipientName}
            </span>
          </div>
        </div>

        {/* Message Content Link */}
        <Link
          href={`/dashboard/inbox/${message.id}`}
          className="block group-hover:text-[#7B8DFF] transition-colors"
        >
          <p
            className={`text-base sm:text-lg leading-relaxed line-clamp-4 break-words font-normal ${
              !isRead ? "text-[#F5F5F2] font-medium" : "text-[#9A9DA5]"
            }`}
          >
            &ldquo;{message.content}&rdquo;
          </p>
        </Link>

        {/* Bottom Actions Bar */}
        <div className="mt-5 pt-3.5 border-t border-[#2A2D34] flex flex-wrap items-center justify-between gap-2">
          {/* Quick detail link */}
          <Link
            href={`/dashboard/inbox/${message.id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#7B8DFF] hover:text-[#536DFF] transition-colors"
          >
            Baca Selengkapnya <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Read/Unread Toggle */}
            <button
              type="button"
              onClick={toggleReadStatus}
              title={isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
              className="p-1.5 rounded-lg border border-[#2A2D34] bg-[#181B21] text-[#9A9DA5] hover:text-[#F5F5F2] hover:border-[#3E424C] transition-all cursor-pointer"
            >
              {isRead ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Report */}
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              title="Laporkan pesan"
              className="p-1.5 rounded-lg border border-[#2A2D34] bg-[#181B21] text-[#9A9DA5] hover:text-[#FFB84D] hover:border-[#FFB84D]/40 transition-all cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>

            {/* Block Sender */}
            <button
              type="button"
              onClick={() => setShowBlockModal(true)}
              title="Blokir pengirim"
              className="p-1.5 rounded-lg border border-[#2A2D34] bg-[#181B21] text-[#9A9DA5] hover:text-[#FF4D4D] hover:border-[#FF4D4D]/40 transition-all cursor-pointer"
            >
              <ShieldBan className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              title="Hapus pesan"
              className="p-1.5 rounded-lg border border-[#2A2D34] bg-[#181B21] text-[#9A9DA5] hover:text-[#FF4D4D] hover:border-[#FF4D4D]/40 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReportModal
        messageId={message.id}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />

      <BlockModal
        messageId={message.id}
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
      />

      <DeleteModal
        messageId={message.id}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}
