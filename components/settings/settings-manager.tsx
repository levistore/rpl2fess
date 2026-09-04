"use client";

import * as React from "react";
import { SiteSettings } from "@/types/database";
import {
  updateSiteSettingsAction,
  purgeAllMessagesAction,
} from "@/lib/actions/settings";
import { signOutAction } from "@/lib/actions/auth";
import { useToast } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  Sliders,
  LogOut,
  AlertTriangle,
  Send,
} from "lucide-react";

interface SettingsManagerProps {
  settings: SiteSettings;
}

export function SettingsManager({ settings }: SettingsManagerProps) {
  const { toast } = useToast();

  const [acceptingMessages, setAcceptingMessages] = React.useState(
    settings.accepting_messages
  );
  const [maxLength, setMaxLength] = React.useState(String(settings.max_length));
  const [tagline, setTagline] = React.useState(settings.tagline);
  const [isSaving, setIsSaving] = React.useState(false);

  // Danger Zone Modal
  const [showPurgeModal, setShowPurgeModal] = React.useState(false);
  const [isPurging, setIsPurging] = React.useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append("acceptingMessages", String(acceptingMessages));
    formData.append("maxLength", maxLength);
    formData.append("tagline", tagline);

    try {
      const res = await updateSiteSettingsAction(formData);
      if (res.success) {
        toast("Pengaturan berhasil disimpan!", "success");
      } else {
        toast(res.error || "Gagal menyimpan pengaturan", "error");
      }
    } catch {
      toast("Terjadi kesalahan saat menyimpan", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurgeMessages = async () => {
    setIsPurging(true);
    try {
      const res = await purgeAllMessagesAction();
      if (res.success) {
        toast("Semua pesan telah dihapus.", "info");
        setShowPurgeModal(false);
      } else {
        toast(res.error || "Gagal menghapus pesan", "error");
      }
    } catch {
      toast("Error saat menghapus pesan", "error");
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* 1. Pengaturan Pesan */}
      <Card variant="white" shadow="md" className="p-6 sm:p-8 space-y-6 border-[3px] border-[#111111]">
        <div className="flex items-center gap-2 pb-3 border-b-[2px] border-[#111111]">
          <Sliders className="w-5 h-5 text-[#5B7CFF]" />
          <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
            Penerimaan Pesan Anonim
          </h3>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5">
          {/* Status Penerimaan Toggle */}
          <label className="flex items-start justify-between gap-4 p-4 rounded-[6px] border-[2px] border-[#111111] bg-[#F6F3EA] cursor-pointer">
            <div className="space-y-0.5">
              <span className="text-sm font-black uppercase text-[#111111] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#5B7CFF]" /> Terima Pesan Masuk
              </span>
              <p className="text-xs font-medium text-[#111111]/70">
                Jika dinonaktifkan, pengunjung tidak dapat mengirim pesan baru di halaman /send.
              </p>
            </div>
            <input
              type="checkbox"
              checked={acceptingMessages}
              onChange={(e) => setAcceptingMessages(e.target.checked)}
              className="w-5 h-5 accent-[#111111] mt-0.5 cursor-pointer"
            />
          </label>

          {/* Batas Karakter */}
          <Input
            label="Batas Maksimal Karakter Pesan"
            type="number"
            min={50}
            max={1000}
            value={maxLength}
            onChange={(e) => setMaxLength(e.target.value)}
            hint="Rekomendasi standar: 500 karakter."
            required
          />

          {/* Tagline */}
          <Input
            label="Tagline Kelas"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            hint="Ditampilkan pada judul dan landing page."
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
          >
            Simpan Pengaturan
          </Button>
        </form>
      </Card>

      {/* 2. Danger Zone */}
      <Card
        variant="white"
        shadow="md"
        className="p-6 sm:p-8 space-y-5 border-[3px] border-[#FF6B9A] bg-[#FF6B9A]/5"
      >
        <div className="flex items-center gap-2 text-[#FF6B9A]">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
            Zona Bahaya
          </h3>
        </div>

        <p className="text-xs sm:text-sm font-medium text-[#111111]/80 leading-relaxed">
          Tindakan ini permanen. Semua pesan yang tersimpan di inbox akan disembunyikan/dihapus.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            type="button"
            variant="white"
            size="sm"
            onClick={() => setShowPurgeModal(true)}
            className="border-[#FF6B9A]"
          >
            Kosongkan Semua Pesan Inbox
          </Button>

          <form action={signOutAction}>
            <Button type="submit" variant="danger" size="sm">
              <LogOut className="w-4 h-4 mr-1.5" /> Keluar Sesi Admin
            </Button>
          </form>
        </div>
      </Card>

      {/* Purge Modal */}
      <Modal
        isOpen={showPurgeModal}
        onClose={() => setShowPurgeModal(false)}
        title="Kosongkan Kotak Masuk"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs sm:text-sm font-medium text-[#111111] leading-relaxed">
            Apakah Anda yakin ingin menghapus semua pesan di inbox? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="white"
              size="sm"
              onClick={() => setShowPurgeModal(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handlePurgeMessages}
              isLoading={isPurging}
            >
              Hapus Semua Pesan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
