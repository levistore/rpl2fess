"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Bell, BellOff, CheckCircle2, AlertCircle, Send } from "lucide-react";
import {
  getPushSubscriptionStatusAction,
  subscribeUserToPushAction,
  unsubscribeUserFromPushAction,
  sendTestPushNotificationAction,
} from "@/lib/notifications/web-push";

type PushStatus =
  | "checking"
  | "unsupported"
  | "unconfigured"
  | "denied"
  | "inactive"
  | "active";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationSettings() {
  const { toast } = useToast();
  const [status, setStatus] = React.useState<PushStatus>("checking");
  const [publicKey, setPublicKey] = React.useState<string>("");
  const [isWorking, setIsWorking] = React.useState<boolean>(false);
  const [isTesting, setIsTesting] = React.useState<boolean>(false);

  // Re-inspect on demand (e.g. button click)
  const refreshStatus = React.useCallback(async () => {
    if (typeof window === "undefined") return;

    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setStatus("unsupported");
      return;
    }

    try {
      const serverStatus = await getPushSubscriptionStatusAction();
      if (!serverStatus.configured) {
        setStatus("unconfigured");
        return;
      }
      setPublicKey(serverStatus.publicKey);

      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (sub && Notification.permission === "granted") {
        setStatus("active");
      } else {
        setStatus("inactive");
      }
    } catch (err) {
      console.error("[PushSettings] Error inspecting push status:", err);
      setStatus("inactive");
    }
  }, []);

  // Initial mount check asynchronously
  React.useEffect(() => {
    let active = true;

    const inspect = async () => {
      // Yield to avoid synchronous cascading renders during mount effect
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!active) return;

      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus("unsupported");
        return;
      }

      try {
        const serverStatus = await getPushSubscriptionStatusAction();
        if (!active) return;

        if (!serverStatus.configured) {
          setStatus("unconfigured");
          return;
        }
        setPublicKey(serverStatus.publicKey);

        if (Notification.permission === "denied") {
          setStatus("denied");
          return;
        }

        const reg = await navigator.serviceWorker.ready;
        if (!active) return;
        const sub = await reg.pushManager.getSubscription();

        if (sub && Notification.permission === "granted") {
          setStatus("active");
        } else {
          setStatus("inactive");
        }
      } catch (err) {
        console.error("[PushSettings] Error inspecting push status:", err);
        if (active) setStatus("inactive");
      }
    };

    void inspect();

    return () => {
      active = false;
    };
  }, []);

  // Handler: Subscribe to Web Push
  const handleSubscribe = async () => {
    if (!publicKey) {
      toast("Kunci publik VAPID belum tersedia.", "error");
      return;
    }

    setIsWorking(true);
    try {
      // 1. Request notification permission from user
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        toast("Izin notifikasi ditolak oleh browser.", "warning");
        setIsWorking(false);
        return;
      }

      // 2. Ensure Service Worker is ready
      const registration = await navigator.serviceWorker.ready;

      // 3. Subscribe with VAPID applicationServerKey
      const convertedKey = urlBase64ToUint8Array(publicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      // 4. Save to Supabase push_subscriptions
      const subJson = subscription.toJSON();
      if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
        throw new Error("Push subscription serialization failed.");
      }

      const res = await subscribeUserToPushAction({
        endpoint: subJson.endpoint,
        keys: {
          p256dh: subJson.keys.p256dh,
          auth: subJson.keys.auth,
        },
      });

      if (!res.success) {
        throw new Error(res.error || "Gagal menyimpan subscription ke server.");
      }

      setStatus("active");
      toast("Notifikasi inbox berhasil diaktifkan untuk perangkat ini!", "success");
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error("[PushSettings] Subscription error:", error);
      toast(error?.message || "Gagal mengaktifkan notifikasi.", "error");
    } finally {
      setIsWorking(false);
    }
  };

  // Handler: Unsubscribe from Web Push
  const handleUnsubscribe = async () => {
    setIsWorking(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();

      if (sub) {
        await unsubscribeUserFromPushAction(sub.endpoint);
        await sub.unsubscribe();
      }

      setStatus("inactive");
      toast("Notifikasi inbox telah dinonaktifkan.", "info");
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error("[PushSettings] Unsubscribe error:", error);
      toast(error?.message || "Gagal menonaktifkan notifikasi.", "error");
    } finally {
      setIsWorking(false);
    }
  };

  // Handler: Send Test Notification
  const handleSendTest = async () => {
    setIsTesting(true);
    try {
      const res = await sendTestPushNotificationAction();
      if (res.success) {
        toast("Notifikasi uji berhasil dikirim! Periksa layar perangkat Anda.", "success");
      } else {
        toast(res.error || "Gagal mengirim notifikasi uji.", "error");
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast(error?.message || "Terjadi kesalahan saat menguji notifikasi.", "error");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6 bg-[#111318] border border-[#2A2D34]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2A2D34]">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-[#3D5CFF]" />
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#7B8DFF] uppercase block">
              NOTIFIKASI
            </span>
            <h3 className="text-xl font-display uppercase tracking-wide text-[#F5F5F2]">
              Notifikasi Inbox
            </h3>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {status === "checking" && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-[#181B21] border border-[#2A2D34] text-[#9A9DA5]">
              Memeriksa...
            </span>
          )}
          {status === "active" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#42D392]/15 border border-[#42D392]/30 text-[#42D392]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
            </span>
          )}
          {status === "inactive" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-[#181B21] border border-[#2A2D34] text-[#9A9DA5]">
              Tidak aktif
            </span>
          )}
          {status === "denied" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 text-[#FF4D4D]">
              <AlertCircle className="w-3.5 h-3.5" /> Permission ditolak
            </span>
          )}
          {status === "unsupported" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-[#FFB84D]/15 border border-[#FFB84D]/30 text-[#FFB84D]">
              Browser tidak mendukung
            </span>
          )}
          {status === "unconfigured" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-[#FFB84D]/15 border border-[#FFB84D]/30 text-[#FFB84D]">
              Belum dikonfigurasi
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#9A9DA5] leading-relaxed">
        Dapatkan pemberitahuan ketika ada pesan anonim baru di RPLTwoFess langsung pada perangkat ini, bahkan saat aplikasi sedang di latar belakang.
      </p>

      {/* Status details & actions */}
      <div className="pt-1">
        {status === "denied" && (
          <div className="p-3.5 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/25 text-[#FF8585] text-xs space-y-1 mb-4">
            <p className="font-semibold">Izin Notifikasi Diblokir</p>
            <p>
              Izin notifikasi telah ditolak di browser ini. Untuk mengaktifkannya, buka Pengaturan Situs di browser dan ubah izin Notifikasi menjadi &ldquo;Izinkan&rdquo;, lalu muat ulang halaman.
            </p>
          </div>
        )}

        {status === "unsupported" && (
          <div className="p-3.5 rounded-xl bg-[#FFB84D]/10 border border-[#FFB84D]/25 text-[#FFB84D] text-xs space-y-1 mb-4">
            <p className="font-semibold">Perangkat / Browser Tidak Mendukung</p>
            <p>
              Browser Anda saat ini tidak mendukung Web Push Notifications atau Service Worker. Gunakan Chrome, Edge, Firefox, atau pasang aplikasi di Android untuk mengaktifkan notifikasi.
            </p>
          </div>
        )}

        {status === "unconfigured" && (
          <div className="p-3.5 rounded-xl bg-[#FFB84D]/10 border border-[#FFB84D]/25 text-[#FFB84D] text-xs space-y-1 mb-4">
            <p className="font-semibold">Konfigurasi VAPID Diperlukan</p>
            <p>
              Kunci VAPID belum terkonfigurasi di file environment server. Hubungi administrator.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {status === "inactive" && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSubscribe}
              isLoading={isWorking}
              className="gap-2"
            >
              <Bell className="w-4 h-4" />
              <span>Aktifkan Notifikasi</span>
            </Button>
          )}

          {status === "active" && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleUnsubscribe}
                isLoading={isWorking}
                className="gap-2"
              >
                <BellOff className="w-4 h-4" />
                <span>Nonaktifkan Notifikasi</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleSendTest}
                isLoading={isTesting}
                className="gap-2"
              >
                <Send className="w-4 h-4 text-[#3D5CFF]" />
                <span>Kirim Notifikasi Uji</span>
              </Button>
            </>
          )}

          {status === "denied" && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={refreshStatus}
            >
              Periksa Ulang Izin
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
