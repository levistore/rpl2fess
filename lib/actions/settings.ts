"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SettingsResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function updateSiteSettingsAction(
  formData: FormData
): Promise<SettingsResult> {
  const acceptingMessages = formData.get("acceptingMessages") === "true";
  const maxLength = parseInt((formData.get("maxLength") as string) || "500", 10);
  const tagline = (formData.get("tagline") as string) || "Satu Kelas. Banyak Cerita.";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Akses ditolak" };
  }

  const { error } = await supabase.from("site_settings").upsert({
    id: "default",
    accepting_messages: acceptingMessages,
    max_length: maxLength,
    tagline: tagline,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/");
  revalidatePath("/send");
  return { success: true, message: "Pengaturan berhasil disimpan." };
}

export async function purgeAllMessagesAction(): Promise<SettingsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Akses ditolak" };
  }

  const { error } = await supabase
    .from("messages")
    .update({ is_deleted: true })
    .eq("is_deleted", false);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inbox");
  return { success: true, message: "Semua pesan telah dihapus." };
}
