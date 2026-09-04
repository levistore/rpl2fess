"use client";

import * as React from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DocumentationItem } from "@/types/database";
import { DocumentationPreviewCard } from "./documentation-preview-card";
import {
  UploadCloud,
  RefreshCw,
  Trash2,
  Eye,
  Edit3,
  AlertCircle,
  FileImage,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  createDocumentationAction,
  updateDocumentationAction,
} from "@/lib/actions/documentation";

interface DocumentationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: DocumentationItem | null;
  defaultOrderNumber?: number;
  onSuccess?: () => void;
}

interface FormContentProps {
  itemToEdit?: DocumentationItem | null;
  defaultOrderNumber: number;
  onClose: () => void;
  onSuccess?: () => void;
}

function DocumentationFormContent({
  itemToEdit,
  defaultOrderNumber,
  onClose,
  onSuccess,
}: FormContentProps) {
  const { success, error: toastError } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const formattedOrder = String(defaultOrderNumber).padStart(2, "0");
  const [activeTab, setActiveTab] = React.useState<"form" | "preview">("form");

  // Initial state derived cleanly from props without effects
  const [categoryLabel, setCategoryLabel] = React.useState(
    itemToEdit?.category_label || `DOCUMENTATION / ${formattedOrder}`
  );
  const [caption, setCaption] = React.useState(itemToEdit?.caption || "");
  const [metaText, setMetaText] = React.useState(itemToEdit?.meta_text || "X RPL 2 / 2026");
  const [overlayText, setOverlayText] = React.useState(itemToEdit?.overlay_text || "");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>(itemToEdit?.image_url || "");
  const [fileName, setFileName] = React.useState<string>("");
  const [fileSize, setFileSize] = React.useState<string>("");
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Clean up object URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleFileProcess = (file: File) => {
    setErrorMessage("");

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Format file tidak didukung. Harap gunakan JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran file terlalu besar. Maksimum 5 MB.");
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setFileName(file.name);
    setFileSize(formatBytes(file.size));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemovePhoto = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setFileName("");
    setFileSize("");

    if (itemToEdit) {
      setPreviewUrl(itemToEdit.image_url);
    } else {
      setPreviewUrl("");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!caption.trim()) {
      setErrorMessage("Caption dokumentasi wajib diisi.");
      return;
    }

    if (!itemToEdit && !selectedFile) {
      setErrorMessage("Foto dokumentasi wajib diunggah.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("caption", caption.trim());
      formData.append("category_label", categoryLabel.trim());
      formData.append("meta_text", metaText.trim());
      formData.append("overlay_text", overlayText.trim());

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      let res;
      if (itemToEdit) {
        res = await updateDocumentationAction(itemToEdit.id, formData);
      } else {
        res = await createDocumentationAction(formData);
      }

      if (res.success) {
        success(res.message || "Dokumentasi berhasil disimpan.");
        onSuccess?.();
        onClose();
      } else {
        setErrorMessage(res.error || "Dokumentasi gagal disimpan. Coba lagi.");
        toastError(res.error || "Dokumentasi gagal disimpan. Coba lagi.");
      }
    } catch (err) {
      console.error("Form submit error:", err);
      setErrorMessage("Terjadi kesalahan teknis. Coba lagi.");
      toastError("Dokumentasi gagal disimpan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Tab Selector for Preview vs Form */}
      <div className="flex items-center gap-2 mb-5 p-1 rounded-xl bg-[#181B21] border border-[#2A2D34]">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === "form"
              ? "bg-[#3D5CFF] text-white shadow-sm"
              : "text-[#9A9DA5] hover:text-[#F5F5F2]"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor Formulir</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === "preview"
              ? "bg-[#3D5CFF] text-white shadow-sm"
              : "text-[#9A9DA5] hover:text-[#F5F5F2]"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Tampilan Preview</span>
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/25 text-[#FF6B6B] text-xs mb-4 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {activeTab === "preview" ? (
        <div className="space-y-6 py-2">
          <div className="text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#9A9DA5]">
              Pratinjau Tampilan Homepage
            </span>
          </div>

          <DocumentationPreviewCard
            caption={caption}
            categoryLabel={categoryLabel}
            metaText={metaText}
            overlayText={overlayText}
            imageUrl={previewUrl}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2D34]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("form")}
              className="text-xs"
            >
              Kembali ke Formulir
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="text-xs bg-[#3D5CFF] hover:bg-[#536DFF] text-white"
            >
              {itemToEdit ? "Simpan Perubahan" : "Simpan Dokumentasi"}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] block">
              Foto Dokumentasi <span className="text-[#3D5CFF]">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative rounded-xl border border-[#2A2D34] bg-[#181B21] p-3.5 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-28 h-24 sm:w-32 sm:h-24 rounded-lg overflow-hidden bg-[#08090B] border border-[#2A2D34] shrink-0">
                    <Image
                      src={previewUrl}
                      alt="Pratinjau Foto"
                      fill
                      unoptimized={previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#F5F5F2] font-medium truncate">
                      <FileImage className="w-3.5 h-3.5 text-[#3D5CFF] shrink-0" />
                      <span className="truncate">{fileName || "Foto Dokumentasi"}</span>
                    </div>
                    {fileSize && (
                      <span className="text-[11px] font-mono text-[#9A9DA5] block">
                        Ukuran: {fileSize}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-[#7B8DFF] block">
                      Format: JPG / PNG / WebP
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Ganti Foto
                    </Button>
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="text-xs p-2 bg-[#FF4D4D]/15 text-[#FF4D4D] hover:bg-[#FF4D4D]/25 border-none"
                        aria-label="Batalkan foto baru"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-[#3D5CFF] bg-[#3D5CFF]/10"
                    : "border-[#2A2D34] hover:border-[#3D5CFF]/60 hover:bg-white/[0.02]"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#181B21] border border-[#2A2D34] mx-auto flex items-center justify-center text-[#3D5CFF] mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-[#F5F5F2]">
                    Tarik dan lepaskan foto ke sini, atau klik untuk memilih
                  </p>
                  <p className="text-[11px] text-[#9A9DA5] font-mono">
                    Format: JPG, PNG, WebP (Maksimal 5 MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Category Label */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] block">
                Label Editorial
              </label>
              <Input
                type="text"
                value={categoryLabel}
                onChange={(e) => setCategoryLabel(e.target.value)}
                placeholder="DOCUMENTATION / 01"
                className="font-mono text-xs"
              />
              <span className="text-[10px] text-[#555A64] block">
                Label kecil di atas foto, misal: DOCUMENTATION / 01
              </span>
            </div>

            {/* Metadata Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] block">
                Metadata Teks
              </label>
              <Input
                type="text"
                value={metaText}
                onChange={(e) => setMetaText(e.target.value)}
                placeholder="X RPL 2 / 2026"
                className="font-mono text-xs"
              />
              <span className="text-[10px] text-[#555A64] block">
                Keterangan kelas atau tahun, misal: X RPL 2 / 2026
              </span>
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] block">
              Caption Dokumentasi <span className="text-[#3D5CFF]">*</span>
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tulis kalimat atau kutipan cerita untuk foto ini..."
              rows={3}
              className="w-full rounded-xl bg-[#181B21] border border-[#2A2D34] p-3 text-xs sm:text-sm text-[#F5F5F2] placeholder-[#555A64] focus:outline-none focus:border-[#3D5CFF] focus:ring-1 focus:ring-[#3D5CFF] transition-all resize-none"
            />
          </div>

          {/* Overlay Text (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#9A9DA5] block">
              Overlay Text (Opsional)
            </label>
            <Input
              type="text"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              placeholder="ARCHIVE // 2026"
              className="font-mono text-xs"
            />
            <span className="text-[10px] text-[#555A64] block">
              Badge teks kecil yang mengambang di atas sudut foto jika diinginkan
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2A2D34]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("preview")}
              className="text-xs gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              Lihat Preview
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="text-xs bg-[#3D5CFF] hover:bg-[#536DFF] text-white"
              >
                {itemToEdit ? "Simpan Perubahan" : "Tambah Dokumentasi"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export function DocumentationFormModal({
  isOpen,
  onClose,
  itemToEdit,
  defaultOrderNumber = 1,
  onSuccess,
}: DocumentationFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? "Edit Dokumentasi" : "Tambah Dokumentasi"}
      description={
        itemToEdit
          ? "Ubah teks, metadata, atau ganti foto dokumentasi."
          : "Unggah foto baru ke arsip dokumentasi kelas."
      }
      maxWidth="lg"
    >
      {isOpen && (
        <DocumentationFormContent
          key={itemToEdit ? itemToEdit.id : "new-doc-form"}
          itemToEdit={itemToEdit}
          defaultOrderNumber={defaultOrderNumber}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </Modal>
  );
}
