"use client";

import * as React from "react";
import { Smartphone, CheckCircle2, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePWA } from "./pwa-provider";
import { InstallButton } from "./install-button";

export function InstallSettingsSection() {
  const { isInstallable, isInstalled, isIOS } = usePWA();

  return (
    <Card className="p-6 sm:p-8 space-y-6 bg-[#111318] border border-[#2A2D34]">
      <div className="flex items-center gap-2.5 pb-4 border-b border-[#2A2D34]">
        <Smartphone className="w-5 h-5 text-[#3D5CFF]" />
        <h3 className="text-xl font-display uppercase tracking-wide text-[#F5F5F2]">
          Install RPLTwoFess
        </h3>
      </div>

      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
          Pasang RPLTwoFess di perangkatmu untuk akses yang lebih cepat.
        </p>

        {isInstalled ? (
          <div className="flex items-center gap-2.5 text-xs font-mono font-medium text-[#42D392] bg-[#42D392]/10 border border-[#42D392]/30 px-3.5 py-2.5 rounded-xl w-fit">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#42D392]" />
            <span>RPLTwoFess sudah terpasang di perangkat ini.</span>
          </div>
        ) : isInstallable ? (
          <div className="pt-1">
            <InstallButton size="md" />
          </div>
        ) : isIOS ? (
          <div className="p-4 rounded-xl border border-[#2A2D34] bg-[#181B21] space-y-2 max-w-lg">
            <p className="text-xs sm:text-sm text-[#F5F5F2] font-medium flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#3D5CFF] shrink-0" />
              Untuk menginstall RPLTwoFess di iOS Safari:
            </p>
            <p className="text-xs text-[#9A9DA5] leading-relaxed">
              Tekan ikon <strong>Bagikan</strong> (Share) di browser Safari, lalu pilih <strong>&quot;Tambahkan ke Layar Utama&quot;</strong>.
            </p>
          </div>
        ) : (
          <p className="text-xs text-[#9A9DA5] leading-relaxed max-w-lg">
            Buka RPLTwoFess menggunakan browser yang mendukung instalasi PWA (seperti Google Chrome atau Microsoft Edge) untuk memasang aplikasi langsung ke perangkatmu.
          </p>
        )}
      </div>
    </Card>
  );
}
