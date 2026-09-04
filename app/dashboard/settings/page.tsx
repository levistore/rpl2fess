import { getSiteSettings } from "@/lib/queries/messages";
import { SettingsManager } from "@/components/settings/settings-manager";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#FF6B9A] border-[1.5px] border-[#111111] text-xs font-black uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" /> Konfigurasi
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
          Pengaturan
        </h1>
        <p className="text-sm font-bold text-[#111111]/70 mt-0.5">
          Atur status penerimaan pesan, batas karakter, dan manajemen data inbox.
        </p>
      </div>

      <SettingsManager settings={settings} />
    </div>
  );
}
