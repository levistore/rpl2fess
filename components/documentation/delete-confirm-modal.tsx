"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Dokumentasi"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#181B21] border border-[#2A2D34]">
          <AlertCircle className="w-5 h-5 text-[#FF4D4D] shrink-0 mt-0.5" />
          <div className="text-xs text-[#9A9DA5] leading-relaxed">
            Foto dan konten dokumentasi ini akan dihapus secara permanen dari sistem.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="text-xs"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isDeleting}
            disabled={isDeleting}
            className="text-xs gap-1.5 bg-[#FF4D4D] hover:bg-[#FF3333] text-white border-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
