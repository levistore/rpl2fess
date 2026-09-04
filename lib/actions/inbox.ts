"use server";

import { createClient } from "@/lib/supabase/server";
import { reportSchema } from "@/lib/validation/schemas";
import { ReportReason } from "@/types/database";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function markMessageReadAction(
  messageId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Akses ditolak" };
  }

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", messageId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inbox");
  return { success: true };
}

export async function markMessageUnreadAction(
  messageId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Akses ditolak" };
  }

  const { error } = await supabase
    .from("messages")
    .update({ is_read: false })
    .eq("id", messageId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inbox");
  return { success: true };
}

export async function deleteMessageAction(
  messageId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Akses ditolak" };
  }

  // Soft delete
  const { error } = await supabase
    .from("messages")
    .update({ is_deleted: true })
    .eq("id", messageId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inbox");
  return { success: true, message: "Pesan telah dihapus." };
}

export async function reportMessageAction(
  formData: FormData
): Promise<ActionResult> {
  const messageId = formData.get("messageId") as string;
  const reason = formData.get("reason") as ReportReason;
  const details = (formData.get("details") as string) || "";

  const validation = reportSchema.safeParse({ messageId, reason, details });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Format laporan tidak valid.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("reports").insert({
    message_id: validation.data.messageId,
    reason: validation.data.reason,
    details: validation.data.details || null,
    status: "pending",
  });

  if (error) {
    return { success: false, error: "Gagal mengirim laporan." };
  }

  revalidatePath("/dashboard/inbox");
  return {
    success: true,
    message: "Laporan telah dicatat untuk peninjauan admin.",
  };
}

export async function blockSenderAction(
  messageId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Akses ditolak" };
  }

  const { data: message, error: fetchError } = await supabase
    .from("messages")
    .select("sender_hash")
    .eq("id", messageId)
    .maybeSingle();

  if (fetchError || !message || !message.sender_hash) {
    return {
      success: false,
      error: "Identifier pengirim tidak ditemukan.",
    };
  }

  const { error: blockError } = await supabase.from("blocks").upsert(
    {
      sender_hash: message.sender_hash,
    },
    { onConflict: "sender_hash" }
  );

  if (blockError) {
    return { success: false, error: "Gagal memblokir pengirim." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inbox");
  return {
    success: true,
    message: "Pengirim berhasil diblokir dari mengirim pesan baru.",
  };
}
