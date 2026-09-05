"use server";

import { createClient } from "@/lib/supabase/server";
import { messageSchema } from "@/lib/validation/schemas";
import { generateSenderHash, getClientIp } from "@/lib/security/sender-hash";
import { checkServerlessRateLimit } from "@/lib/security/rate-limit";
import { sanitizeMessageContent } from "@/lib/security/sanitize";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import { triggerNewMessagePushNotification } from "@/lib/notifications/web-push";

export interface SendMessageResult {
  success: boolean;
  message?: string;
  error?: string;
  retryAfterSeconds?: number;
}

export async function sendAnonymousMessageAction(
  formData: FormData
): Promise<SendMessageResult> {
  const rawContent = formData.get("content");
  const rawSenderName = formData.get("sender_name");
  const rawRecipientName = formData.get("recipient_name");
  const turnstileToken = formData.get("turnstileToken");
  const tokenStr = typeof turnstileToken === "string" ? turnstileToken : null;

  // 1. Zod schema validation
  const validation = messageSchema.safeParse({
    content: typeof rawContent === "string" ? rawContent : "",
    senderName:
      typeof rawSenderName === "string" && rawSenderName.trim()
        ? rawSenderName.trim()
        : null,
    recipientName:
      typeof rawRecipientName === "string" && rawRecipientName.trim()
        ? rawRecipientName.trim()
        : null,
    turnstileToken: tokenStr,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Format pesan tidak valid.",
    };
  }

  // 2. Text sanitization
  const cleanContent = sanitizeMessageContent(validation.data.content);
  if (!cleanContent) {
    return {
      success: false,
      error: "Pesan tidak boleh kosong.",
    };
  }

  const cleanSenderName = validation.data.senderName
    ? sanitizeMessageContent(validation.data.senderName).slice(0, 50).trim() || null
    : null;

  const cleanRecipientName = validation.data.recipientName
    ? sanitizeMessageContent(validation.data.recipientName).slice(0, 100).trim()
    : "";

  if (!cleanRecipientName) {
    return {
      success: false,
      error: "Masukkan nama penerima terlebih dahulu.",
    };
  }

  const supabase = await createClient();

  // 3. Check site settings (accepting_messages status)
  const { data: settings } = await supabase
    .from("site_settings")
    .select("accepting_messages, max_length")
    .eq("id", "default")
    .maybeSingle();

  if (settings && !settings.accepting_messages) {
    return {
      success: false,
      error: "Penerimaan pesan saat ini sedang dinonaktifkan oleh admin.",
    };
  }

  const maxLen = settings?.max_length || 500;
  if (cleanContent.length > maxLen) {
    return {
      success: false,
      error: `Pesan melebihi batas maksimal ${maxLen} karakter.`,
    };
  }

  const finalRecipientName = cleanRecipientName;

  // 4. Cryptographic privacy-preserving sender hash
  const senderHash = await generateSenderHash();
  const clientIp = await getClientIp();

  // 5. Check if sender is blocked
  const { data: isBlocked } = await supabase
    .from("blocks")
    .select("id")
    .eq("sender_hash", senderHash)
    .maybeSingle();

  if (isBlocked) {
    return {
      success: false,
      error: "Tidak dapat mengirim pesan saat ini.",
    };
  }

  // 6. Serverless shared rate limit check
  const rateLimit = await checkServerlessRateLimit(senderHash);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: rateLimit.reason,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    };
  }

  // 7. Cloudflare Turnstile bot verification
  const botCheck = await verifyTurnstileToken(tokenStr, clientIp);
  if (!botCheck.success) {
    return {
      success: false,
      error: "Verifikasi bot gagal. Silakan coba lagi.",
    };
  }

  // 8. Insert into messages table
  const { error: insertError } = await supabase.from("messages").insert({
    content: cleanContent,
    sender_name: cleanSenderName,
    recipient_name: finalRecipientName,
    sender_hash: senderHash,
    is_read: false,
    is_deleted: false,
  });

  if (insertError) {
    console.error("Error inserting message:", insertError);
    return {
      success: false,
      error: "Gagal mengirim pesan. Silakan coba sesaat lagi.",
    };
  }

  // Trigger web push notification asynchronously (failsafe, won't break message delivery)
  try {
    await triggerNewMessagePushNotification();
  } catch (pushErr) {
    console.warn("Non-fatal error dispatching push notification:", pushErr);
  }

  return {
    success: true,
    message: "Pesanmu sudah terkirim secara anonim.",
  };
}
