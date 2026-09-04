"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DocumentationItem } from "@/types/database";
import { Button } from "@/components/ui/button";
import { DocumentationFormModal } from "./documentation-form-modal";
import { DocumentationPreviewCard } from "./documentation-preview-card";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  Camera,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  reorderDocumentationAction,
  toggleActiveDocumentationAction,
  deleteDocumentationAction,
} from "@/lib/actions/documentation";

interface DocumentationManagerProps {
  initialItems: DocumentationItem[];
}

export function DocumentationManager({ initialItems }: DocumentationManagerProps) {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [items, setItems] = React.useState<DocumentationItem[]>(initialItems);
  const [prevInitial, setPrevInitial] = React.useState<DocumentationItem[]>(initialItems);
  if (prevInitial !== initialItems) {
    setPrevInitial(initialItems);
    setItems(initialItems);
  }

  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = React.useState<DocumentationItem | null>(null);

  // Preview modal state
  const [previewItem, setPreviewItem] = React.useState<DocumentationItem | null>(null);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = React.useState<DocumentationItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  // Reorder loading state
  const [isReordering, setIsReordering] = React.useState<boolean>(false);
  const [activeToggleId, setActiveToggleId] = React.useState<string | null>(null);

  const handleOpenAdd = () => {
    setItemToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: DocumentationItem) => {
    setItemToEdit(item);
    setIsFormOpen(true);
  };

  const handleToggleActive = async (item: DocumentationItem) => {
    const nextStatus = !item.is_active;
    setActiveToggleId(item.id);

    // Optimistic update
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, is_active: nextStatus } : it))
    );

    try {
      const res = await toggleActiveDocumentationAction(item.id, nextStatus);
      if (res.success) {
        success(res.message || (nextStatus ? "Dokumentasi diaktifkan." : "Dokumentasi dinonaktifkan."));
        router.refresh();
      } else {
        // Revert on error
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, is_active: item.is_active } : it))
        );
        toastError(res.error || "Gagal mengubah status dokumentasi.");
      }
    } catch {
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, is_active: item.is_active } : it))
      );
      toastError("Gagal mengubah status dokumentasi.");
    } finally {
      setActiveToggleId(null);
    }
  };

  const handleMove = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length || isReordering) return;

    setIsReordering(true);

    const reordered = [...items];
    const [movedItem] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    // Optimistic update
    setItems(reordered);

    try {
      const orderedIds = reordered.map((it) => it.id);
      const res = await reorderDocumentationAction(orderedIds);
      if (res.success) {
        success(res.message || "Urutan dokumentasi berhasil diperbarui.");
        router.refresh();
      } else {
        // Revert
        setItems(items);
        toastError(res.error || "Gagal memperbarui urutan dokumentasi.");
      }
    } catch {
      setItems(items);
      toastError("Gagal memperbarui urutan dokumentasi.");
    } finally {
      setIsReordering(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteDocumentationAction(itemToDelete.id);
      if (res.success) {
        success(res.message || "Dokumentasi berhasil dihapus.");
        setItems((prev) => prev.filter((it) => it.id !== itemToDelete.id));
        setItemToDelete(null);
        router.refresh();
      } else {
        toastError(res.error || "Gagal menghapus dokumentasi.");
      }
    } catch {
      toastError("Gagal menghapus dokumentasi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111318] border border-[#2A2D34]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#7B8DFF]">
            <Camera className="w-3.5 h-3.5 text-[#3D5CFF]" />
            <span>ARSIP DOKUMENTASI</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
            DOKUMENTASI KELAS
          </h1>
          <p className="text-xs sm:text-sm text-[#9A9DA5]">
            Kelola konten foto, caption, label, dan urutan yang ditampilkan pada homepage secara langsung.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAdd}
          className="gap-2 bg-[#3D5CFF] hover:bg-[#536DFF] text-white shrink-0 self-start sm:self-auto text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#3D5CFF]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumentasi</span>
        </Button>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="rounded-2xl bg-[#111318] border border-[#2A2D34] p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#181B21] border border-[#2A2D34] mx-auto flex items-center justify-center text-[#9A9DA5]">
            <Camera className="w-7 h-7 text-[#555A64]" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-base font-medium text-[#F5F5F2]">Belum ada dokumentasi.</h3>
            <p className="text-xs text-[#9A9DA5] leading-relaxed">
              Tambahkan foto pertama untuk mulai mengisi arsip kelas di halaman utama.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="gap-2 bg-[#3D5CFF] hover:bg-[#536DFF] text-white text-xs px-4 py-2 rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Dokumentasi</span>
          </Button>
        </div>
      ) : (
        /* Responsive Card List */
        <div className="space-y-4">
          {items.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === items.length - 1;
            const orderLabel = String(index + 1).padStart(2, "0");

            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl bg-[#111318] border transition-all duration-200 p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start ${
                  item.is_active
                    ? "border-[#2A2D34] hover:border-[#3D5CFF]/40 shadow-lg shadow-black/40"
                    : "border-[#2A2D34]/50 opacity-70 bg-[#0E1014]"
                }`}
              >
                {/* Left: Reorder Controls + Order Number */}
                <div className="flex md:flex-col items-center justify-between md:justify-center gap-2 shrink-0 w-full md:w-12 border-b md:border-b-0 md:border-r border-[#2A2D34] pb-3 md:pb-0 md:pr-3">
                  <div className="flex items-center gap-1.5 md:flex-col">
                    <button
                      type="button"
                      onClick={() => handleMove(index, "up")}
                      disabled={isFirst || isReordering}
                      className="p-1.5 rounded-lg border border-[#2A2D34] bg-[#181B21] text-[#9A9DA5] hover:text-[#F5F5F2] hover:border-[#3D5CFF] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Geser ke atas"
                      title="Geser ke atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold text-[#7B8DFF] px-1">
                      {orderLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMove(index, "down")}
                      disabled={isLast || isReordering}
                      className="p-1.5 rounded-lg border border-[#2A2D34] bg-[#181B21] text-[#9A9DA5] hover:text-[#F5F5F2] hover:border-[#3D5CFF] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Geser ke bawah"
                      title="Geser ke bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status Indicator on Mobile Header */}
                  <div className="md:hidden">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        item.is_active
                          ? "bg-[#42D392]/10 text-[#42D392] border border-[#42D392]/20"
                          : "bg-[#2A2D34] text-[#9A9DA5]"
                      }`}
                    >
                      {item.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                {/* Center: Image Preview */}
                <div className="relative w-full md:w-52 aspect-[4/3] rounded-xl overflow-hidden bg-[#08090B] border border-[#2A2D34] shrink-0">
                  <Image
                    src={item.image_url}
                    alt={item.caption || "Foto dokumentasi"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 220px"
                  />
                  {item.overlay_text && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-widest text-[#F5F5F2] uppercase">
                      {item.overlay_text}
                    </div>
                  )}
                </div>

                {/* Content & Metadata */}
                <div className="flex-1 min-w-0 space-y-2.5 w-full">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#3D5CFF] font-semibold">
                        {item.category_label || `DOCUMENTATION / ${orderLabel}`}
                      </span>
                      <span className="text-[#3E424C] hidden sm:inline">•</span>
                      <span className="text-[11px] font-mono text-[#9A9DA5]">
                        {item.meta_text || "X RPL 2 / 2026"}
                      </span>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                          item.is_active
                            ? "bg-[#42D392]/10 text-[#42D392] border border-[#42D392]/20"
                            : "bg-[#2A2D34] text-[#9A9DA5]"
                        }`}
                      >
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>

                  {/* Caption quote */}
                  <div className="p-3 rounded-xl bg-[#181B21]/60 border border-[#2A2D34]/70">
                    <p className="font-handwriting text-lg text-[#F5F5F2] leading-snug">
                      &ldquo;{item.caption}&rdquo;
                    </p>
                  </div>

                  {/* Bottom Controls */}
                  <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        disabled={activeToggleId === item.id}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          item.is_active
                            ? "border-[#2A2D34] bg-[#181B21] text-[#9A9DA5] hover:text-[#FFB84D] hover:border-[#FFB84D]/40"
                            : "border-[#42D392]/30 bg-[#42D392]/10 text-[#42D392] hover:bg-[#42D392]/20"
                        }`}
                      >
                        {item.is_active ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Nonaktifkan</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Aktifkan</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="px-3 py-1.5 rounded-lg border border-[#2A2D34] bg-[#181B21] text-[#9A9DA5] hover:text-[#F5F5F2] hover:border-[#3D5CFF] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#7B8DFF]" />
                        <span>Preview</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(item)}
                        className="text-xs gap-1.5 border-[#2A2D34] bg-[#181B21]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => setItemToDelete(item)}
                        className="text-xs gap-1.5 p-2 bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/25 border-none"
                        aria-label="Hapus dokumentasi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal (Add / Edit) */}
      <DocumentationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        itemToEdit={itemToEdit}
        defaultOrderNumber={items.length + 1}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* Preview Modal */}
      {previewItem && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewItem(null)}
          title="Pratinjau Dokumentasi"
          description="Tampilan persis sebagaimana ditampilkan di halaman homepage."
          maxWidth="md"
        >
          <div className="py-2 space-y-5">
            <DocumentationPreviewCard
              caption={previewItem.caption}
              categoryLabel={previewItem.category_label}
              metaText={previewItem.meta_text}
              overlayText={previewItem.overlay_text}
              imageUrl={previewItem.image_url}
            />
            <div className="flex justify-end pt-2 border-t border-[#2A2D34]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewItem(null)}
                className="text-xs"
              >
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
