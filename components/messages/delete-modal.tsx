"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { deleteMessageAction } from "@/lib/actions/inbox";
import { useToast } from "@/components/ui/toast";
import { Trash2 } from "lucide-react";

interface DeleteModalProps {
  messageId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteModal({
  messageId,
  isOpen,
  onClose,
  onSuccess,
}: DeleteModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleDelete = async () => {
    if (!messageId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await deleteMessageAction(messageId);
      if (res.success) {
        toast("Message deleted.", "success");
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast(res.error || "Failed to delete message.", "error");
      }
    } catch {
      toast("Error deleting message.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Confession"
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
          Are you sure you want to remove this message from your inbox? It will be safely archived and hidden from view.
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
            onClick={handleDelete}
            isLoading={isSubmitting}
          >
            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
