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
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Kotak Masuk
        </Link>
      </div>

      {/* Main Reading Card */}
      <Card variant="surface" className="p-6 sm:p-10 space-y-6 border border-[#2A2D34] shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2A2D34]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#3D5CFF]/15 border border-[#3D5CFF]/30 text-xs font-mono tracking-wider text-[#7B8DFF]">
              PESAN ANONIM
            </span>
            <span className="flex items-center gap-1 text-xs text-[#42D392] font-mono">
              <Lock className="w-3.5 h-3.5" /> 100% RAHASIA
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-[#9A9DA5]">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(message.created_at)}</span>
          </div>
        </div>

        {/* Big Confession Text */}
        <div className="py-4">
          <p className="text-xl sm:text-2xl md:text-3xl font-normal text-[#F5F5F2] leading-relaxed break-words">
            &ldquo;{message.content}&rdquo;
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#2A2D34] flex flex-wrap items-center justify-between gap-3">
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
