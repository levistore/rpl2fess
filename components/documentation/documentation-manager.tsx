"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DocumentationItem, DocumentationType } from "@/types/database";
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
  Sparkles,
  LayoutGrid,
  Send,
  Info,
} from "lucide-react";
import {
  reorderDocumentationAction,
  toggleActiveDocumentationAction,
  deleteDocumentationAction,
} from "@/lib/actions/documentation";

interface DocumentationManagerProps {
  initialFeatured?: DocumentationItem | null;
  initialGallery?: DocumentationItem[];
  initialSendPage?: DocumentationItem | null;
  initialItems?: DocumentationItem[]; // fallback support
}

export function DocumentationManager({
  initialFeatured,
  initialGallery,
  initialSendPage,
  initialItems,
}: DocumentationManagerProps) {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  // Initialize data from either grouped props or initialItems
  const initFeatured =
    initialFeatured ?? (initialItems?.find((it) => it.type === "featured") || null);
  const initGallery =
    initialGallery ?? (initialItems?.filter((it) => it.type === "gallery") || []);
  const initSendPage =
    initialSendPage ?? (initialItems?.find((it) => it.type === "send_page") || null);

  const [activeTab, setActiveTab] = React.useState<DocumentationType>("featured");

  const [featured, setFeatured] = React.useState<DocumentationItem | null>(initFeatured);
  const [gallery, setGallery] = React.useState<DocumentationItem[]>(initGallery);
  const [sendPage, setSendPage] = React.useState<DocumentationItem | null>(initSendPage);

  const [prevFeatured, setPrevFeatured] = React.useState(initFeatured);
  if (prevFeatured !== initFeatured) {
    setPrevFeatured(initFeatured);
    setFeatured(initFeatured);
  }

  const [prevGallery, setPrevGallery] = React.useState(initGallery);
  if (prevGallery !== initGallery) {
    setPrevGallery(initGallery);
    setGallery(initGallery);
  }

  const [prevSendPage, setPrevSendPage] = React.useState(initSendPage);
  if (prevSendPage !== initSendPage) {
    setPrevSendPage(initSendPage);
    setSendPage(initSendPage);
  }

  // Form modal state
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<DocumentationType>("featured");
  const [itemToEdit, setItemToEdit] = React.useState<DocumentationItem | null>(null);

  // Preview modal state
  const [previewItem, setPreviewItem] = React.useState<DocumentationItem | null>(null);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = React.useState<DocumentationItem | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  // Reorder loading state
  const [isReordering, setIsReordering] = React.useState<boolean>(false);
  const [activeToggleId, setActiveToggleId] = React.useState<string | null>(null);

  // Handlers for Opening Modals
  const handleOpenEditFeatured = () => {
    setItemToEdit(featured);
    setModalType("featured");
    setIsFormOpen(true);
  };

  const handleOpenEditSendPage = () => {
    setItemToEdit(sendPage);
    setModalType("send_page");
    setIsFormOpen(true);
  };

  const handleOpenAddGallery = () => {
    setItemToEdit(null);
    setModalType("gallery");
    setIsFormOpen(true);
  };

  const handleOpenEditGallery = (item: DocumentationItem) => {
    setItemToEdit(item);
    setModalType("gallery");
    setIsFormOpen(true);
  };

  // Toggle Active/Inactive
  const handleToggleActive = async (item: DocumentationItem) => {
    const nextStatus = !item.is_active;
    setActiveToggleId(item.id);

    // Optimistic update
    if (item.type === "featured") {
      setFeatured((prev) => (prev ? { ...prev, is_active: nextStatus } : null));
    } else if (item.type === "send_page") {
      setSendPage((prev) => (prev ? { ...prev, is_active: nextStatus } : null));
    } else {
      setGallery((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, is_active: nextStatus } : it))
      );
    }

    try {
      const res = await toggleActiveDocumentationAction(item.id, nextStatus);
      if (res.success) {
        success(
          res.message || (nextStatus ? "Dokumentasi diaktifkan." : "Dokumentasi dinonaktifkan.")
        );
        router.refresh();
      } else {
        // Revert
        if (item.type === "featured") setFeatured(featured);
        else if (item.type === "send_page") setSendPage(sendPage);
        else setGallery(gallery);
        toastError(res.error || "Gagal mengubah status dokumentasi.");
      }
    } catch {
      if (item.type === "featured") setFeatured(featured);
      else if (item.type === "send_page") setSendPage(sendPage);
      else setGallery(gallery);
      toastError("Gagal mengubah status dokumentasi.");
    } finally {
      setActiveToggleId(null);
    }
  };

  // Move Gallery Items Up/Down
  const handleMoveGallery = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length || isReordering) return;

    setIsReordering(true);

    const reordered = [...gallery];
    const [movedItem] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    // Optimistic update
    setGallery(reordered);

    try {
      const orderedIds = reordered.map((it) => it.id);
      const res = await reorderDocumentationAction(orderedIds);
      if (res.success) {
        success(res.message || "Urutan galeri berhasil diperbarui.");
        router.refresh();
      } else {
        setGallery(gallery);
        toastError(res.error || "Gagal memperbarui urutan galeri.");
      }
    } catch {
      setGallery(gallery);
      toastError("Gagal memperbarui urutan galeri.");
    } finally {
      setIsReordering(false);
    }
  };

  // Delete Gallery Item
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteDocumentationAction(itemToDelete.id);
      if (res.success) {
        success(res.message || "Dokumentasi galeri berhasil dihapus.");
        setGallery((prev) => prev.filter((it) => it.id !== itemToDelete.id));
        setItemToDelete(null);
        router.refresh();
      } else {
        toastError(res.error || "Gagal menghapus dokumentasi galeri.");
      }
    } catch {
      toastError("Gagal menghapus dokumentasi galeri.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-[#111318] border border-[#2A2D34] space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#7B8DFF]">
          <Camera className="w-3.5 h-3.5 text-[#3D5CFF]" />
          <span>ARSIP DOKUMENTASI SISTEM</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
          KELOLA DOKUMENTASI
        </h1>
        <p className="text-xs sm:text-sm text-[#9A9DA5] max-w-2xl leading-relaxed">
          Struktur data dokumentasi terbagi menjadi 3 entitas independen:{" "}
          <strong className="text-[#F5F5F2]">Dokumentasi Utama</strong> untuk Hero Beranda,{" "}
          <strong className="text-[#F5F5F2]">Galeri Dokumentasi</strong> untuk koleksi foto kelas, dan{" "}
          <strong className="text-[#F5F5F2]">Dokumentasi Kirim Pesan</strong> untuk kartu foto di halaman /send.
        </p>
      </div>

      {/* 3 Separate Tabs Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#111318] border border-[#2A2D34]">
        <button
          type="button"
          onClick={() => setActiveTab("featured")}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-medium transition-all ${
            activeTab === "featured"
              ? "bg-[#181B21] text-[#F5F5F2] border border-[#3D5CFF] shadow-lg shadow-[#3D5CFF]/10"
              : "text-[#9A9DA5] hover:text-[#F5F5F2] hover:bg-white/[0.02]"
          }`}
        >
          <Sparkles
            className={`w-4 h-4 ${
              activeTab === "featured" ? "text-[#3D5CFF]" : "text-[#9A9DA5]"
            }`}
          />
          <div className="text-left">
            <span className="block font-semibold">1. DOKUMENTASI UTAMA</span>
            <span className="text-[10px] font-mono text-[#7B8DFF]">Hero Homepage</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-medium transition-all ${
            activeTab === "gallery"
              ? "bg-[#181B21] text-[#F5F5F2] border border-[#3D5CFF] shadow-lg shadow-[#3D5CFF]/10"
              : "text-[#9A9DA5] hover:text-[#F5F5F2] hover:bg-white/[0.02]"
          }`}
        >
          <LayoutGrid
            className={`w-4 h-4 ${
              activeTab === "gallery" ? "text-[#3D5CFF]" : "text-[#9A9DA5]"
            }`}
          />
          <div className="text-left">
            <span className="block font-semibold">2. GALERI DOKUMENTASI</span>
            <span className="text-[10px] font-mono text-[#9A9DA5]">
              {gallery.length} Foto Aktif
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("send_page")}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-medium transition-all ${
            activeTab === "send_page"
              ? "bg-[#181B21] text-[#F5F5F2] border border-[#3D5CFF] shadow-lg shadow-[#3D5CFF]/10"
              : "text-[#9A9DA5] hover:text-[#F5F5F2] hover:bg-white/[0.02]"
          }`}
        >
          <Send
            className={`w-4 h-4 ${
              activeTab === "send_page" ? "text-[#3D5CFF]" : "text-[#9A9DA5]"
            }`}
          />
          <div className="text-left">
            <span className="block font-semibold">3. DOKUMENTASI KIRIM PESAN</span>
            <span className="text-[10px] font-mono text-[#7B8DFF]">Halaman /send</span>
          </div>
        </button>
      </div>

      {/* ========================================================== */}
      {/* TAB 1: DOKUMENTASI UTAMA (type = featured)                */}
      {/* ========================================================== */}
      {activeTab === "featured" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#181B21]/70 border border-[#2A2D34] text-xs">
            <div className="flex items-start gap-2.5 text-[#9A9DA5]">
              <Info className="w-4 h-4 text-[#3D5CFF] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Dokumentasi utama yang tampil pada <strong className="text-[#F5F5F2]">Hero Homepage</strong>.
                Perubahan pada kartu ini <strong className="text-[#3D5CFF]">HANYA</strong> memengaruhi Hero Homepage,
                dan tidak akan mengubah Galeri maupun Halaman /send.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleOpenEditFeatured}
              className="gap-2 bg-[#3D5CFF] hover:bg-[#536DFF] text-white shrink-0 self-start sm:self-auto text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#3D5CFF]/20"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{featured ? "Edit Dokumentasi Utama" : "Buat Dokumentasi Utama"}</span>
            </Button>
          </div>

          {featured ? (
            <div className="p-6 rounded-2xl bg-[#111318] border border-[#2A2D34] space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Visual Thumbnail */}
                <div className="relative w-full md:w-80 aspect-[16/10] rounded-xl overflow-hidden bg-[#08090B] border border-[#2A2D34] shrink-0">
                  <Image
                    src={featured.image_url}
                    alt={featured.caption || "Dokumentasi Utama"}
                    fill
                    unoptimized={featured.image_url.startsWith("blob:") || featured.image_url.startsWith("data:")}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                  {featured.category_label && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-widest text-[#7B8DFF]">
                      {featured.category_label}
                    </div>
                  )}
                  {featured.overlay_text && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[10px] font-mono font-bold text-[#FFB84D]">
                      {featured.overlay_text}
                    </div>
                  )}
                </div>

                {/* Metadata Fields Inspection */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#3D5CFF]">
                      {featured.category_label || "DOCUMENTATION / 01"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        featured.is_active
                          ? "bg-[#42D392]/10 text-[#42D392] border border-[#42D392]/20"
                          : "bg-[#9A9DA5]/10 text-[#9A9DA5] border border-[#9A9DA5]/20"
                      }`}
                    >
                      {featured.is_active ? "● Aktif di Hero" : "○ Nonaktif"}
                    </span>
                  </div>

                  <p className="font-handwriting text-2xl text-[#F5F5F2] leading-snug">
                    &ldquo;{featured.caption}&rdquo;
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-[#181B21] border border-[#2A2D34]/60">
                      <span className="text-[10px] text-[#9A9DA5] block">METADATA TEKS</span>
                      <span className="text-[#F5F5F2]">{featured.meta_text || "—"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#181B21] border border-[#2A2D34]/60">
                      <span className="text-[10px] text-[#9A9DA5] block">OVERLAY TEKS</span>
                      <span className="text-[#FFB84D]">{featured.overlay_text || "—"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#181B21] border border-[#2A2D34]/60">
                      <span className="text-[10px] text-[#9A9DA5] block">FOOTER TEKS</span>
                      <span className="text-[#F5F5F2]">{featured.footer_text || "—"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#181B21] border border-[#2A2D34]/60">
                      <span className="text-[10px] text-[#9A9DA5] block">TAGLINE TEKS</span>
                      <span className="text-[#F5F5F2]">{featured.tagline_text || "—"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#2A2D34]">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewItem(featured)}
                      className="text-xs gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Pratinjau Hero
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(featured)}
                      disabled={activeToggleId === featured.id}
                      className="text-xs gap-1.5"
                    >
                      {featured.is_active ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Sembunyikan dari Hero
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Tampilkan di Hero
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleOpenEditFeatured}
                      className="text-xs gap-1.5 bg-[#3D5CFF] hover:bg-[#536DFF] text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Ganti Foto &amp; Edit Konten
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#111318] border border-dashed border-[#2A2D34] p-12 text-center space-y-4">
              <Camera className="w-8 h-8 text-[#9A9DA5]/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-medium text-[#F5F5F2]">Belum ada Dokumentasi Utama</h3>
                <p className="text-xs text-[#9A9DA5]">
                  Buat dokumentasi utama untuk ditampilkan di bagian Hero Homepage.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleOpenEditFeatured}
                className="bg-[#3D5CFF] text-white text-xs px-4 py-2 rounded-xl"
              >
                Buat Dokumentasi Utama
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: GALERI DOKUMENTASI (type = gallery)                */}
      {/* ========================================================== */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#181B21]/70 border border-[#2A2D34] text-xs">
            <div className="flex items-start gap-2.5 text-[#9A9DA5]">
              <Info className="w-4 h-4 text-[#3D5CFF] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Kumpulan foto yang tampil di section <strong className="text-[#F5F5F2]">Kenangan &amp; Cerita Kelas</strong> pada homepage.
                Gunakan tombol panah untuk mengatur urutan tampilan. Mengubah galeri{" "}
                <strong className="text-[#3D5CFF]">TIDAK</strong> akan memengaruhi Dokumentasi Utama atau Kirim Pesan.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleOpenAddGallery}
              className="gap-2 bg-[#3D5CFF] hover:bg-[#536DFF] text-white shrink-0 self-start sm:self-auto text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#3D5CFF]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Foto Galeri</span>
            </Button>
          </div>

          {gallery.length === 0 ? (
            <div className="rounded-2xl bg-[#111318] border border-dashed border-[#2A2D34] p-12 text-center space-y-4">
              <Camera className="w-8 h-8 text-[#9A9DA5]/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-medium text-[#F5F5F2]">Belum ada foto galeri.</h3>
                <p className="text-xs text-[#9A9DA5]">
                  Tambahkan foto pertama untuk section galeri dokumentasi di homepage.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleOpenAddGallery}
                className="bg-[#3D5CFF] text-white text-xs px-4 py-2 rounded-xl"
              >
                Tambah Foto Galeri
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {gallery.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === gallery.length - 1;
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
                    {/* Left: Reorder Controls strictly within Gallery */}
                    <div className="flex md:flex-col items-center justify-between md:justify-center gap-2 shrink-0 w-full md:w-12 border-b md:border-b-0 md:border-r border-[#2A2D34] pb-3 md:pb-0 md:pr-3">
                      <div className="flex items-center gap-1.5 md:flex-col">
                        <button
                          type="button"
                          onClick={() => handleMoveGallery(index, "up")}
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
                          onClick={() => handleMoveGallery(index, "down")}
                          disabled={isLast || isReordering}
                          className="p-1.5 rounded-lg border border-[#2A2D34] bg-[#181B21] text-[#9A9DA5] hover:text-[#F5F5F2] hover:border-[#3D5CFF] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          aria-label="Geser ke bawah"
                          title="Geser ke bawah"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="md:hidden">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                            item.is_active
                              ? "bg-[#42D392]/10 text-[#42D392] border border-[#42D392]/20"
                              : "bg-[#9A9DA5]/10 text-[#9A9DA5] border border-[#9A9DA5]/20"
                          }`}
                        >
                          {item.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                    </div>

                    {/* Photo Thumbnail */}
                    <div className="relative w-full sm:w-36 md:w-44 aspect-[4/3] rounded-xl overflow-hidden bg-[#08090B] border border-[#2A2D34] shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.caption || "Dokumentasi Galeri"}
                        fill
                        unoptimized={item.image_url.startsWith("blob:") || item.image_url.startsWith("data:")}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 180px"
                      />
                      {item.overlay_text && (
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[8px] font-mono tracking-wider font-bold text-[#FFB84D] uppercase">
                          {item.overlay_text}
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 space-y-2 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#3D5CFF]">
                          {item.category_label || `DOCUMENTATION / ${orderLabel}`}
                        </span>
                        <div className="hidden md:flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                              item.is_active
                                ? "bg-[#42D392]/10 text-[#42D392] border border-[#42D392]/20"
                                : "bg-[#9A9DA5]/10 text-[#9A9DA5] border border-[#9A9DA5]/20"
                            }`}
                          >
                            {item.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                      </div>

                      <p className="font-handwriting text-xl text-[#F5F5F2] leading-snug line-clamp-2">
                        &ldquo;{item.caption}&rdquo;
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#9A9DA5] font-mono">
                        <span>{item.meta_text || "X RPL 2 / 2026"}</span>
                        <span>•</span>
                        <span>{item.footer_text || "ARSIP DOKUMENTER KELAS"}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end md:self-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#2A2D34] w-full md:w-auto justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewItem(item)}
                        className="text-xs p-2 h-9 text-[#9A9DA5] hover:text-[#F5F5F2]"
                        title="Lihat Pratinjau"
                        aria-label="Lihat Pratinjau"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(item)}
                        disabled={activeToggleId === item.id}
                        className={`text-xs p-2 h-9 ${
                          item.is_active
                            ? "text-[#42D392] hover:text-[#42D392]/80"
                            : "text-[#9A9DA5] hover:text-[#F5F5F2]"
                        }`}
                        title={item.is_active ? "Nonaktifkan" : "Aktifkan"}
                        aria-label={item.is_active ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {item.is_active ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditGallery(item)}
                        className="text-xs gap-1.5 h-9"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => setItemToDelete(item)}
                        className="text-xs p-2 h-9 bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 border-none"
                        title="Hapus"
                        aria-label="Hapus Dokumentasi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 3: DOKUMENTASI KIRIM PESAN (type = send_page)          */}
      {/* ========================================================== */}
      {activeTab === "send_page" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#181B21]/70 border border-[#2A2D34] text-xs">
            <div className="flex items-start gap-2.5 text-[#9A9DA5]">
              <Info className="w-4 h-4 text-[#3D5CFF] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Dokumentasi khusus yang tampil di samping form pada halaman <strong className="text-[#F5F5F2]">/send (Kirim Pesan)</strong>.
                Perubahan pada kartu ini <strong className="text-[#3D5CFF]">HANYA</strong> memengaruhi halaman /send,
                dan tidak akan mengubah Dokumentasi Utama maupun Galeri Beranda.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleOpenEditSendPage}
              className="gap-2 bg-[#3D5CFF] hover:bg-[#536DFF] text-white shrink-0 self-start sm:self-auto text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#3D5CFF]/20"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{sendPage ? "Edit Dokumentasi Kirim Pesan" : "Buat Dokumentasi Kirim Pesan"}</span>
            </Button>
          </div>

          {sendPage ? (
            <div className="p-6 rounded-2xl bg-[#111318] border border-[#2A2D34] space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Visual Thumbnail */}
                <div className="relative w-full md:w-80 aspect-[4/3] rounded-xl overflow-hidden bg-[#08090B] border border-[#2A2D34] shrink-0">
                  <Image
                    src={sendPage.image_url}
                    alt={sendPage.caption || "Dokumentasi Kirim Pesan"}
                    fill
                    unoptimized={sendPage.image_url.startsWith("blob:") || sendPage.image_url.startsWith("data:")}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                  {sendPage.category_label && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-widest text-[#7B8DFF]">
                      {sendPage.category_label}
                    </div>
                  )}
                  {sendPage.overlay_text && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[10px] font-mono font-bold text-[#FFB84D]">
                      {sendPage.overlay_text}
                    </div>
                  )}
                </div>

                {/* Metadata Fields Inspection */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#3D5CFF]">
                      {sendPage.category_label || "DOCUMENTATION / NOTE"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                        sendPage.is_active
                          ? "bg-[#42D392]/10 text-[#42D392] border border-[#42D392]/20"
                          : "bg-[#9A9DA5]/10 text-[#9A9DA5] border border-[#9A9DA5]/20"
                      }`}
                    >
                      {sendPage.is_active ? "● Aktif di /send" : "○ Nonaktif"}
                    </span>
                  </div>

                  <p className="font-handwriting text-2xl text-[#F5F5F2] leading-snug">
                    &ldquo;{sendPage.caption}&rdquo;
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-[#181B21] border border-[#2A2D34]/60">
                      <span className="text-[10px] text-[#9A9DA5] block">METADATA TEKS</span>
                      <span className="text-[#F5F5F2]">{sendPage.meta_text || "—"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#181B21] border border-[#2A2D34]/60">
                      <span className="text-[10px] text-[#9A9DA5] block">OVERLAY TEKS</span>
                      <span className="text-[#FFB84D]">{sendPage.overlay_text || "—"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#181B21] border border-[#2A2D34]/60">
                      <span className="text-[10px] text-[#9A9DA5] block">FOOTER TEKS</span>
                      <span className="text-[#F5F5F2]">{sendPage.footer_text || "—"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#181B21] border border-[#2A2D34]/60">
                      <span className="text-[10px] text-[#9A9DA5] block">TAGLINE TEKS</span>
                      <span className="text-[#F5F5F2]">{sendPage.tagline_text || "—"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#2A2D34]">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewItem(sendPage)}
                      className="text-xs gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Pratinjau /send
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(sendPage)}
                      disabled={activeToggleId === sendPage.id}
                      className="text-xs gap-1.5"
                    >
                      {sendPage.is_active ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Sembunyikan dari /send
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Tampilkan di /send
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleOpenEditSendPage}
                      className="text-xs gap-1.5 bg-[#3D5CFF] hover:bg-[#536DFF] text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Ganti Foto &amp; Edit Konten
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#111318] border border-dashed border-[#2A2D34] p-12 text-center space-y-4">
              <Camera className="w-8 h-8 text-[#9A9DA5]/40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-medium text-[#F5F5F2]">Belum ada Dokumentasi Kirim Pesan</h3>
                <p className="text-xs text-[#9A9DA5]">
                  Buat dokumentasi khusus untuk ditampilkan di halaman /send.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleOpenEditSendPage}
                className="bg-[#3D5CFF] text-white text-xs px-4 py-2 rounded-xl"
              >
                Buat Dokumentasi Kirim Pesan
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Form Modal (Add or Edit) */}
      <DocumentationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        itemToEdit={itemToEdit}
        docType={modalType}
        defaultOrderNumber={gallery.length + 1}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={
          previewItem?.type === "featured"
            ? "Pratinjau Hero Homepage"
            : previewItem?.type === "send_page"
            ? "Pratinjau Dokumentasi /send"
            : "Pratinjau Galeri Dokumentasi"
        }
        description="Tampilan kartu dokumentasi sebagaimana terlihat oleh pengunjung."
        maxWidth="md"
      >
        {previewItem && (
          <div className="py-2">
            <DocumentationPreviewCard
              caption={previewItem.caption}
              categoryLabel={previewItem.category_label}
              metaText={previewItem.meta_text}
              overlayText={previewItem.overlay_text}
              footerText={previewItem.footer_text}
              taglineText={previewItem.tagline_text}
              imageUrl={previewItem.image_url}
            />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal (strictly for gallery items) */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
