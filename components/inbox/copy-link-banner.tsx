"use client";

import * as React from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function CopyLinkBanner() {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const url = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/send`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast("Link form kirim pesan berhasil disalin!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-4 sm:p-5 rounded-[8px] bg-[#FFD84D] border-[3px] border-[#111111] shadow-[5px_5px_0_#111111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#111111]">
          <Sparkles className="w-4 h-4" /> Link Kirim Pesan RPLTwoFess
        </div>
        <p className="text-sm font-bold text-[#111111] break-all">
          {url}
        </p>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#FFFFFF] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#111111] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all font-black text-xs uppercase tracking-wider text-[#111111] cursor-pointer"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? "Tersalin!" : "Salin Link"}</span>
      </button>
    </div>
  );
}
