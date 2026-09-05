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
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  getDocumentationUploadUrlAction,
  saveDocumentationDirectAction,
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

type UploadStatus = "IDLE" | "SELECTED" | "UPLOADING" | "SUCCESS" | "ERROR";

/**
 * Uploads file directly to Supabase Storage via signed URL using XMLHttpRequest
 * to ensure 100% genuine byte-level upload progress tracking.
 */
function uploadFileWithProgress(
  file: File,
  signedUrl: string,
  onProgress: (percent: number) => void
): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("cacheControl", "3600");
    formData.append("", file, file.name);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve({ success: true });
      } else {
        let errMsg = "Upload foto gagal. Periksa ukuran file dan koneksi internet.";
        try {
          const parsed = JSON.parse(xhr.responseText);
          if (parsed.message) {
            errMsg = parsed.message;
          } else if (parsed.error) {
            errMsg = parsed.error;
          }
        } catch {}
        resolve({ success: false, error: errMsg });
      }
    };

    xhr.onerror = () => {
      resolve({
        success: false,
        error: "Koneksi terputus saat mengunggah foto. Periksa koneksi internet Anda.",
      });
    };

    xhr.ontimeout = () => {
      resolve({
        success: false,
        error: "Waktu upload habis. Periksa kecepatan koneksi internet Anda.",
      });
    };

    xhr.timeout = 120000; // 2 minutes timeout for large files
    xhr.open("PUT", signedUrl);
    xhr.send(formData);
  });
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
  const [isSavingDb, setIsSavingDb] = React.useState<boolean>(false);

  // Upload state machine
  const [uploadStatus, setUploadStatus] = React.useState<UploadStatus>("IDLE");
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);

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
      setErrorMessage("Format foto tidak didukung. Harap gunakan format JPG, PNG, atau WebP.");
      setUploadStatus("ERROR");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran foto terlalu besar. Maksimal 5 MB.");
      setUploadStatus("ERROR");
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
    setUploadStatus("SELECTED");
    setUploadProgress(0);
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
    setUploadStatus("IDLE");
    setUploadProgress(0);

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

    if (isSubmitting) return; // Prevent duplicate clicks

    setIsSubmitting(true);

    try {
      if (selectedFile) {
        // Direct upload to Supabase Storage
        setUploadStatus("UPLOADING");
        setUploadProgress(0);

        // 1. Obtain signed upload URL from server
        const urlRes = await getDocumentationUploadUrlAction({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
        });

        if (!urlRes.success || !urlRes.signedUrl || !urlRes.storagePath || !urlRes.publicUrl) {
          const err = urlRes.error || "Gagal menyiapkan sesi upload ke server.";
          setUploadStatus("ERROR");
          setErrorMessage(err);
          toastError(err);
          setIsSubmitting(false);
          return;
        }

        // 2. Direct upload to Supabase Storage with genuine byte progress
        const uploadRes = await uploadFileWithProgress(
          selectedFile,
          urlRes.signedUrl,
          (percent) => {
            setUploadProgress(percent);
          }
        );

        if (!uploadRes.success) {
          setUploadStatus("ERROR");
          const err =
            uploadRes.error || "Upload foto gagal. Periksa ukuran file dan koneksi internet.";
          setErrorMessage(err);
          toastError(err);
          setIsSubmitting(false);
          // Old photo remains 100% safe
          return;
        }

        // 3. Storage upload succeeded!
        setUploadStatus("SUCCESS");
        setUploadProgress(100);
        success("Foto berhasil diunggah.");

        // 4. Save metadata and path to database
        setIsSavingDb(true);
        const saveRes = await saveDocumentationDirectAction({
          id: itemToEdit?.id,
          title: caption.trim().slice(0, 40),
          caption: caption.trim(),
          category_label: categoryLabel.trim(),
          meta_text: metaText.trim(),
          overlay_text: overlayText.trim(),
          storage_path: urlRes.storagePath,
          image_url: urlRes.publicUrl,
        });

        setIsSavingDb(false);
        setIsSubmitting(false);

        if (saveRes.success) {
          success("Dokumentasi berhasil disimpan.");
          onSuccess?.();
          onClose();
        } else {
          setUploadStatus("ERROR");
          const dbErr =
            saveRes.error || "Foto berhasil diunggah, tetapi dokumentasi gagal disimpan.";
          setErrorMessage(dbErr);
          toastError(dbErr);
        }
      } else if (itemToEdit) {
        // Metadata only update (no new photo upload)
        setIsSavingDb(true);
        const saveRes = await saveDocumentationDirectAction({
          id: itemToEdit.id,
          title: caption.trim().slice(0, 40),
          caption: caption.trim(),
          category_label: categoryLabel.trim(),
          meta_text: metaText.trim(),
          overlay_text: overlayText.trim(),
        });

        setIsSavingDb(false);
        setIsSubmitting(false);

        if (saveRes.success) {
          success("Dokumentasi berhasil disimpan.");
          onSuccess?.();
          onClose();
        } else {
          const dbErr = saveRes.error || "Dokumentasi gagal diperbarui. Coba lagi.";
          setErrorMessage(dbErr);
          toastError(dbErr);
        }
      }
    } catch (err) {
      console.error("Form submit error:", err);
      setUploadStatus("ERROR");
      setErrorMessage("Terjadi kesalahan teknis. Coba lagi.");
      toastError("Dokumentasi gagal disimpan. Coba lagi.");
      setIsSubmitting(false);
      setIsSavingDb(false);
    }
  };

  return (
    <div>
      {/* Tab Selector for Preview vs Form */}
      <div className="flex items-center gap-2 mb-5 p-1 rounded-xl bg-[#181B21] border border-[#2A2D34]">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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

          {/* Upload Progress Banner inside Preview Tab if submitting */}
          {uploadStatus === "UPLOADING" && (
            <div className="space-y-2 p-3.5 rounded-xl bg-[#181B21] border border-[#3D5CFF]/30 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-[#F5F5F2]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#3D5CFF] animate-pulse" />
                  <span>Mengunggah foto...</span>
                </div>
                <span className="font-semibold text-[#7B8DFF]">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#08090B] overflow-hidden border border-[#2A2D34]">
                <div
                  className="h-full bg-gradient-to-r from-[#3D5CFF] to-[#536DFF] transition-all duration-150 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {uploadStatus === "SUCCESS" && isSavingDb && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs text-[#4ADE80] font-mono animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>Foto berhasil diunggah. Menyimpan dokumentasi...</span>
              </div>
              <span className="text-[11px] font-semibold">100%</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2D34]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("form")}
              disabled={isSubmitting}
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
              {uploadStatus === "UPLOADING"
                ? `Mengunggah (${uploadProgress}%)`
                : isSavingDb
                ? "Menyimpan Data..."
                : itemToEdit
                ? "Simpan Perubahan"
                : "Simpan Dokumentasi"}
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
              disabled={isSubmitting}
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
                      Format JPG, PNG, WebP • Maks. 5 MB
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.value = "";
                        fileInputRef.current?.click();
                      }}
                      className="text-xs gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Ganti Foto
                    </Button>
                    {selectedFile && !isSubmitting && (
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

                {/* Direct Upload Progress Indicator */}
                {uploadStatus === "UPLOADING" && (
                  <div className="space-y-2 p-3 rounded-lg bg-[#08090B] border border-[#3D5CFF]/30 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 text-[#F5F5F2]">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#3D5CFF] animate-pulse" />
                        <span>Mengunggah foto...</span>
                      </div>
                      <span className="font-semibold text-[#7B8DFF]">{uploadProgress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#181B21] overflow-hidden border border-[#2A2D34]">
                      <div
                        className="h-full bg-gradient-to-r from-[#3D5CFF] to-[#536DFF] transition-all duration-150 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#9A9DA5]">
                      <span className="truncate max-w-[200px] sm:max-w-xs">{fileName}</span>
                      <span>{fileSize}</span>
                    </div>
                  </div>
                )}

                {uploadStatus === "SUCCESS" && isSavingDb && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs text-[#4ADE80] font-mono animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                      <span>Foto berhasil diunggah. Menyimpan ke database...</span>
                    </div>
                    <span className="text-[11px] font-semibold">100%</span>
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
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
                    Format JPG, PNG, WebP • Maks. 5 MB
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#181B21] border border-[#2A2D34] p-3 text-xs sm:text-sm text-[#F5F5F2] placeholder-[#555A64] focus:outline-none focus:border-[#3D5CFF] focus:ring-1 focus:ring-[#3D5CFF] transition-all resize-none disabled:opacity-60"
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                {uploadStatus === "UPLOADING"
                  ? `Mengunggah (${uploadProgress}%)`
                  : isSavingDb
                  ? "Menyimpan Data..."
                  : itemToEdit
                  ? "Simpan Perubahan"
                  : "Tambah Dokumentasi"}
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
