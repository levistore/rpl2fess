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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  Trash2,
  Flag,
  ShieldBan,
  Lock,
} from "lucide-react";
import { ReportModal } from "./report-modal";
import { BlockModal } from "./block-modal";
import { DeleteModal } from "./delete-modal";

interface MessageDetailViewProps {
  message: Message;
}

export function MessageDetailView({ message }: MessageDetailViewProps) {
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
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#111111] hover:text-[#5B7CFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Kotak Masuk
        </Link>
      </div>

      {/* Main Reading Card */}
      <Card variant="white" shadow="lg" className="p-6 sm:p-10 space-y-6 border-[3px] border-[#111111]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-[2px] border-[#111111]/20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-[4px] bg-[#5B7CFF] border-[1.5px] border-[#111111] text-xs font-black uppercase tracking-wider text-[#111111] shadow-[1.5px_1.5px_0_#111111]">
              Pesan Anonim
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-[#111111]/60">
              <Lock className="w-3.5 h-3.5 text-[#8ED081]" /> Rahasia
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]/60">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(message.created_at)}</span>
          </div>
        </div>

        {/* Big Confession Text */}
        <div className="py-4">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111111] leading-relaxed break-words font-sans selection:bg-[#FFD84D]">
            “{message.content}”
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t-[2.5px] border-[#111111] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="white"
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
              variant="white"
              size="sm"
              onClick={() => setShowReport(true)}
            >
              <Flag className="w-4 h-4 mr-1.5" /> Laporkan
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="white"
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
      </Card>

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
