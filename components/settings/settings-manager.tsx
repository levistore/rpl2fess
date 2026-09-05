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
import { PushNotificationSettings } from "./push-notification-settings";
import { InstallSettingsSection } from "@/components/pwa/install-settings-section";

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
  const [recipientName, setRecipientName] = React.useState(
    settings.recipient_name || "Owner RPL 2"
  );
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
    formData.append("recipientName", recipientName);

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
      <Card className="p-6 sm:p-8 space-y-6 bg-[#111318] border border-[#2A2D34]">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#2A2D34]">
          <Sliders className="w-5 h-5 text-[#3D5CFF]" />
          <h3 className="text-xl font-display uppercase tracking-wide text-[#F5F5F2]">
            Penerimaan Pesan Anonim
          </h3>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5">
          {/* Status Penerimaan Toggle */}
          <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-[#2A2D34] bg-[#181B21] cursor-pointer hover:border-[#3E424C] transition-colors">
            <div className="space-y-1">
              <span className="text-sm font-semibold text-[#F5F5F2] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#3D5CFF]" /> Terima Pesan Masuk
              </span>
              <p className="text-xs text-[#9A9DA5]">
                Jika dinonaktifkan, pengunjung tidak dapat mengirim pesan baru di halaman /send.
              </p>
            </div>
            <input
              type="checkbox"
              checked={acceptingMessages}
              onChange={(e) => setAcceptingMessages(e.target.checked)}
              className="w-5 h-5 accent-[#3D5CFF] mt-0.5 cursor-pointer"
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
            label="Tagline Website"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            hint="Ditampilkan pada judul dan landing page."
            required
          />

          {/* Nama Penerima Pesan (Personal) */}
          <Input
            label="Nama Penerima Pesan (Personal)"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            hint="Nama pemilik atau penerima yang ditampilkan pada halaman /send dan inbox (misal: Owner RPL 2)."
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

      {/* 2. Pengaturan Notifikasi Inbox (Web Push) */}
      <PushNotificationSettings />

      {/* 3. Install RPLTwoFess Section */}
      <InstallSettingsSection />

      {/* 4. Danger Zone */}
      <Card
        className="p-6 sm:p-8 space-y-5 border border-[#FF4D4D]/30 bg-[#FF4D4D]/5"
      >
        <div className="flex items-center gap-2 text-[#FF4D4D]">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-xl font-display uppercase tracking-wide text-[#FF4D4D]">
            Zona Bahaya
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
          Tindakan ini permanen. Semua pesan yang tersimpan di inbox akan disembunyikan/dihapus.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowPurgeModal(true)}
            className="border-[#FF4D4D]/40 text-[#FF4D4D] hover:bg-[#FF4D4D]/10"
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
          <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
            Apakah Anda yakin ingin menghapus semua pesan di inbox? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
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
