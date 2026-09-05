"use client";

import * as React from "react";
import { Copy, Check, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

function subscribe() {
  return () => {};
}

export function CopyLinkBanner() {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const url = React.useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" ? `${window.location.origin}/send` : "/send"),
    () => "/send"
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast("Link form kirim pesan berhasil disalin!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#111318] border border-[#2A2D34] shadow-xl shadow-black/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#7B8DFF]">
          <LinkIcon className="w-3.5 h-3.5 text-[#3D5CFF]" />
          <span>LINK KIRIM PESAN PUBLIK</span>
        </div>
        <p className="text-xs sm:text-sm font-mono text-[#F5F5F2] break-all bg-[#181B21] px-3 py-1.5 rounded-lg border border-[#2A2D34]/70 inline-block">
          {url}
        </p>
      </div>

      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={handleCopy}
        className="shrink-0"
      >
        {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
        <span>{copied ? "Tersalin!" : "Salin Link"}</span>
      </Button>
    </div>
  );
}
