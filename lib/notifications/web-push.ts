"use server";

import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PushSubscriptionRecord } from "@/types/database";

// Configure VAPID details if environment variables are present
function initVapid(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:owner@rpltwofess.web.id";

  if (!publicKey || !privateKey) {
    return false;
  }

  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    return true;
  } catch (err) {
    console.error("[WebPush] Failed to initialize VAPID details:", err);
    return false;
  }
}

export async function getVapidPublicKeyAction(): Promise<{
  configured: boolean;
  publicKey: string;
}> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
  const privateKey = process.env.VAPID_PRIVATE_KEY || "";
  const configured = Boolean(publicKey && privateKey);

  return {
    configured,
    publicKey: configured ? publicKey : "",
  };
}

export async function getPushSubscriptionStatusAction(): Promise<{
  configured: boolean;
  isSubscribed: boolean;
  publicKey: string;
}> {
  const { configured, publicKey } = await getVapidPublicKeyAction();
  if (!configured) {
    return { configured: false, isSubscribed: false, publicKey: "" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { configured: true, isSubscribed: false, publicKey };
  }

  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (error) {
    console.error("[WebPush] Error checking subscription status:", error);
    return { configured: true, isSubscribed: false, publicKey };
  }

  return {
    configured: true,
    isSubscribed: (subs && subs.length > 0) || false,
    publicKey,
  };
}

export async function subscribeUserToPushAction(subscription: {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}): Promise<{ success: boolean; error?: string }> {
  if (!initVapid()) {
    return {
      success: false,
      error: "VAPID belum dikonfigurasi di server.",
    };
  }

  if (
    !subscription?.endpoint ||
    !subscription?.keys?.p256dh ||
    !subscription?.keys?.auth
  ) {
    return {
      success: false,
      error: "Data PushSubscription tidak lengkap.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Akses ditolak. Silakan login sebagai admin.",
    };
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    console.error("[WebPush] Failed to save push subscription:", error);
    return {
      success: false,
      error: "Gagal menyimpan push subscription ke database.",
    };
  }

  return { success: true };
}

export async function unsubscribeUserFromPushAction(
  endpoint: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Akses ditolak. Silakan login sebagai admin.",
    };
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", user.id);

  if (error) {
    console.error("[WebPush] Failed to remove push subscription:", error);
    return {
      success: false,
      error: "Gagal menghapus push subscription.",
    };
  }

  return { success: true };
}

export async function sendTestPushNotificationAction(): Promise<{
  success: boolean;
  sentCount?: number;
  error?: string;
}> {
  if (!initVapid()) {
    return {
      success: false,
      error: "VAPID belum dikonfigurasi di server.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Akses ditolak. Silakan login terlebih dahulu.",
    };
  }

  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", user.id);

  if (error || !subscriptions || subscriptions.length === 0) {
    return {
      success: false,
      error: "Belum ada perangkat yang terdaftar untuk notifikasi push pada akun ini.",
    };
  }

  const payload = JSON.stringify({
    title: "Uji Notifikasi RPLTwoFess",
    body: "Sistem notifikasi inbox berhasil terhubung ke perangkat ini!",
    url: "/dashboard/inbox",
  });

  let sent = 0;
  const adminClient = createAdminClient();

  for (const sub of subscriptions as PushSubscriptionRecord[]) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      );
      sent++;
    } catch (pushError: unknown) {
      const err = pushError as { statusCode?: number; message?: string };
      console.warn("[WebPush] Test push failed for endpoint:", sub.endpoint, err?.message);
      // If subscription expired or gone (410, 404), clean it up
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        await adminClient
          .from("push_subscriptions")
          .delete()
          .eq("id", sub.id);
      }
    }
  }

  if (sent === 0) {
    return {
      success: false,
      error: "Gagal mengirim notifikasi ke perangkat Anda. Subscription mungkin sudah kedaluwarsa.",
    };
  }

  return {
    success: true,
    sentCount: sent,
  };
}

/**
 * Server helper triggered when an anonymous message is successfully created.
 * Failsafe: never throws and never interferes with the message database.
 */
export async function triggerNewMessagePushNotification(): Promise<void> {
  try {
    if (!initVapid()) {
      return;
    }

    const adminClient = createAdminClient();
    const { data: subscriptions, error } = await adminClient
      .from("push_subscriptions")
      .select("*");

    if (error || !subscriptions || subscriptions.length === 0) {
      return;
    }

    const payload = JSON.stringify({
      title: "Pesan Baru",
      body: "Ada pesan anonim baru di RPLTwoFess.",
      url: "/dashboard/inbox",
    });

    await Promise.allSettled(
      (subscriptions as PushSubscriptionRecord[]).map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload
          );
        } catch (pushError: unknown) {
          const err = pushError as { statusCode?: number };
          if (err?.statusCode === 410 || err?.statusCode === 404) {
            await adminClient
              .from("push_subscriptions")
              .delete()
              .eq("id", sub.id);
          }
        }
      })
    );
  } catch (globalErr) {
    console.error("[WebPush] Global error triggering push notification:", globalErr);
  }
}
