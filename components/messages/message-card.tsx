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
}

export function MessageCard({ message }: MessageCardProps) {
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
        toast("Marked as read", "info");
      } else {
        await markMessageUnreadAction(message.id);
        toast("Marked as unread", "info");
      }
    } catch {
      setIsRead(!newStatus);
      toast("Failed to update message status", "error");
    } finally {
      setIsUpdatingRead(false);
    }
  };

  return (
    <>
      <div
        className={`group relative rounded-[8px] border-[3px] border-[#111111] p-5 sm:p-6 transition-all duration-150 ${
          !isRead
            ? "bg-[#FFFFFF] shadow-[6px_6px_0_#111111] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[4px_4px_0_#111111]"
            : "bg-[#F6F3EA] shadow-[3px_3px_0_#111111] opacity-90 hover:opacity-100 hover:bg-[#FFFFFF]"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#111111]">
              Anonymous
            </span>
            {!isRead && (
              <span className="px-2 py-0.5 rounded-[4px] bg-[#FFD84D] border-[1.5px] border-[#111111] text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0_#111111]">
                • NEW
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]/60">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(message.created_at)}</span>
          </div>
        </div>

        {/* Message Content Link */}
        <Link
          href={`/dashboard/inbox/${message.id}`}
          className="block group-hover:text-[#5B7CFF] transition-colors"
        >
          <p className="text-base sm:text-lg font-bold text-[#111111] leading-relaxed line-clamp-4 break-words font-sans">
            “{message.content}”
          </p>
        </Link>

        {/* Bottom Actions Bar */}
        <div className="mt-5 pt-3.5 border-t-[2px] border-[#111111]/20 flex flex-wrap items-center justify-between gap-2">
          {/* Quick detail link */}
          <Link
            href={`/dashboard/inbox/${message.id}`}
            className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#111111] hover:text-[#5B7CFF] transition-colors"
          >
            Read Full <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Read/Unread Toggle */}
            <button
              type="button"
              onClick={toggleReadStatus}
              title={isRead ? "Mark as unread" : "Mark as read"}
              className="p-1.5 rounded-[4px] border-[1.5px] border-[#111111] bg-[#FFFFFF] shadow-[1.5px_1.5px_0_#111111] hover:bg-[#FFD84D] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              {isRead ? (
                <EyeOff className="w-4 h-4 text-[#111111]" />
              ) : (
                <Eye className="w-4 h-4 text-[#111111]" />
              )}
            </button>

            {/* Report */}
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              title="Report message"
              className="p-1.5 rounded-[4px] border-[1.5px] border-[#111111] bg-[#FFFFFF] shadow-[1.5px_1.5px_0_#111111] hover:bg-[#FFD84D] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <Flag className="w-4 h-4 text-[#111111]" />
            </button>

            {/* Block Sender */}
            <button
              type="button"
              onClick={() => setShowBlockModal(true)}
              title="Block sender"
              className="p-1.5 rounded-[4px] border-[1.5px] border-[#111111] bg-[#FFFFFF] shadow-[1.5px_1.5px_0_#111111] hover:bg-[#FF6B9A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <ShieldBan className="w-4 h-4 text-[#111111]" />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              title="Delete message"
              className="p-1.5 rounded-[4px] border-[1.5px] border-[#111111] bg-[#FFFFFF] shadow-[1.5px_1.5px_0_#111111] hover:bg-[#FF6B9A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-[#111111]" />
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
