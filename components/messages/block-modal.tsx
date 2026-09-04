"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { blockSenderAction } from "@/lib/actions/inbox";
import { useToast } from "@/components/ui/toast";
import { ShieldBan } from "lucide-react";

interface BlockModalProps {
  messageId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BlockModal({
  messageId,
  isOpen,
  onClose,
  onSuccess,
}: BlockModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleBlock = async () => {
    if (!messageId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await blockSenderAction(messageId);
      if (res.success) {
        toast("Sender has been blocked.", "success");
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast(res.error || "Failed to block sender.", "error");
      }
    } catch {
      toast("Error blocking sender.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Block Abusive Sender"
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        <div className="p-3.5 rounded-lg bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 flex items-start gap-3">
          <ShieldBan className="w-5 h-5 text-[#FF4D4D] shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-[#F5F5F2] leading-relaxed">
            This will permanently prevent this sender from sending any new messages to your inbox.
          </p>
        </div>

        <p className="text-xs text-[#9A9DA5] leading-relaxed">
          Note: In accordance with privacy preservation rules, blocking is enforced via cryptographic hash matching. No private sender identities are exposed.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleBlock}
            isLoading={isSubmitting}
          >
            Confirm Block
          </Button>
        </div>
      </div>
    </Modal>
  );
}
