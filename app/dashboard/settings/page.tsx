import { getSiteSettings } from "@/lib/queries/messages";
import { SettingsManager } from "@/components/settings/settings-manager";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#3D5CFF]/15 border border-[#3D5CFF]/30 text-xs font-mono font-medium text-[#7B8DFF] uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" /> Konfigurasi
        </div>
        <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-wide text-[#F5F5F2]">
          Pengaturan
        </h1>
        <p className="text-sm text-[#9A9DA5] mt-1">
          Atur status penerimaan pesan, batas karakter, dan manajemen data inbox.
        </p>
      </div>

      <SettingsManager settings={settings} />
    </div>
  );
}
