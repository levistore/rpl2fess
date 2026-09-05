"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface DocumentationActionResult {
  success: boolean;
  error?: string;
  message?: string;
  data?: unknown;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates uploaded image file
 */
function validateImageFile(file: File | null): { valid: boolean; error?: string } {
  if (!file || file.size === 0) {
    return { valid: false, error: "File foto wajib dipilih." };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Format file tidak didukung. Gunakan format JPG, PNG, atau WebP.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Ukuran file terlalu besar. Maksimal 5 MB.",
    };
  }

  return { valid: true };
}

export interface GetUploadUrlResult {
  success: boolean;
  error?: string;
  signedUrl?: string;
  storagePath?: string;
  publicUrl?: string;
}

export interface SaveDocumentationPayload {
  id?: string;
  title?: string;
  caption: string;
  category_label: string;
  meta_text: string;
  overlay_text?: string;
  footer_text?: string;
  tagline_text?: string;
  storage_path?: string;
  image_url?: string;
}

/**
 * Creates a signed upload URL for direct client-to-Supabase-Storage upload.
 * Avoids passing large image bodies through serverless server actions.
 */
export async function getDocumentationUploadUrlAction({
  fileName,
  fileType,
  fileSize,
}: {
  fileName: string;
  fileType: string;
  fileSize: number;
}): Promise<GetUploadUrlResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Akses ditolak. Silakan login sebagai admin." };
    }

    if (!ALLOWED_MIME_TYPES.includes(fileType)) {
      return {
        success: false,
        error: "Format foto tidak didukung. Harap gunakan format JPG, PNG, atau WebP.",
      };
    }

    if (fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Ukuran foto terlalu besar. Maksimal 5 MB.",
      };
    }

    const ext =
      fileName.split(".").pop()?.toLowerCase() ||
      (fileType === "image/png" ? "png" : fileType === "image/webp" ? "webp" : "jpg");
    const storagePath = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const adminSupabase = createAdminClient();
    const { data: signedData, error: signError } = await adminSupabase.storage
      .from("documentation")
      .createSignedUploadUrl(storagePath);

    if (signError || !signedData?.signedUrl) {
      console.error("[getDocumentationUploadUrlAction] Error:", signError);
      return { success: false, error: "Gagal menyiapkan sesi upload ke server penyimpanan." };
    }

    const { data: publicUrlData } = adminSupabase.storage
      .from("documentation")
      .getPublicUrl(storagePath);

    return {
      success: true,
      signedUrl: signedData.signedUrl,
      storagePath,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (err) {
    console.error("[getDocumentationUploadUrlAction] Unexpected error:", err);
    return { success: false, error: "Terjadi kesalahan teknis pada server." };
  }
}

/**
 * Saves documentation item directly to the database after successful direct storage upload.
 * Handles both create and update operations, and cleans up orphaned files appropriately.
 */
export async function saveDocumentationDirectAction(
  payload: SaveDocumentationPayload
): Promise<DocumentationActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Akses ditolak. Silakan login sebagai admin." };
    }

    const caption = (payload.caption || "").trim();
    const category_label = (payload.category_label || "").trim() || "DOCUMENTATION";
    const meta_text = (payload.meta_text || "").trim() || "X RPL 2 / 2026";
    const overlay_text = (payload.overlay_text || "").trim();
    const footer_text = (payload.footer_text || "").trim() || "ARSIP DOKUMENTER KELAS";
    const tagline_text = (payload.tagline_text || "").trim() || "SATU KELAS. BANYAK CERITA.";
    const title = (payload.title || "").trim() || footer_text || caption.slice(0, 40);

    if (!caption) {
      return { success: false, error: "Caption dokumentasi wajib diisi." };
    }

    const adminSupabase = createAdminClient();

    if (payload.id) {
      // UPDATE EXISTING ITEM
      const { data: existing, error: fetchErr } = await adminSupabase
        .from("documentation")
        .select("*")
        .eq("id", payload.id)
        .single();

      if (fetchErr || !existing) {
        if (payload.storage_path) {
          await adminSupabase.storage.from("documentation").remove([payload.storage_path]);
        }
        return { success: false, error: "Data dokumentasi tidak ditemukan." };
      }

      const updateData: Record<string, any> = {
        title,
        caption,
        category_label,
        meta_text,
        overlay_text: overlay_text || null,
        footer_text,
        tagline_text,
        updated_at: new Date().toISOString(),
      };

      if (payload.image_url && payload.storage_path) {
        updateData.image_url = payload.image_url;
        updateData.storage_path = payload.storage_path;
      }

      const { error: updateErr } = await adminSupabase
        .from("documentation")
        .update(updateData)
        .eq("id", payload.id);

      if (updateErr) {
        // If DB update failed and a new file was uploaded, remove orphaned new file
        if (payload.storage_path && payload.storage_path !== existing.storage_path) {
          await adminSupabase.storage.from("documentation").remove([payload.storage_path]);
        }
        console.error("[saveDocumentationDirectAction] DB update error:", updateErr);
        return {
          success: false,
          error: "Foto berhasil diunggah, tetapi dokumentasi gagal disimpan.",
        };
      }

      // Old photo cleanup ONLY AFTER DB update succeeded
      if (
        payload.storage_path &&
        existing.storage_path &&
        existing.storage_path !== payload.storage_path
      ) {
        try {
          await adminSupabase.storage.from("documentation").remove([existing.storage_path]);
        } catch (cleanupErr) {
          console.warn("[saveDocumentationDirectAction] Old photo cleanup error:", cleanupErr);
        }
      }

      revalidatePath("/");
      revalidatePath("/dashboard/documentation");

      return {
        success: true,
        message: "Dokumentasi berhasil disimpan.",
      };
    } else {
      // CREATE NEW ITEM
      if (!payload.image_url || !payload.storage_path) {
        return { success: false, error: "Foto dokumentasi wajib diunggah." };
      }

      // Determine display_order: max + 1
      const { data: currentItems } = await adminSupabase
        .from("documentation")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1);

      const nextOrder =
        currentItems && currentItems.length > 0
          ? (currentItems[0].display_order || 0) + 1
          : 1;

      const { data: inserted, error: insertErr } = await adminSupabase
        .from("documentation")
        .insert({
          title,
          caption,
          category_label,
          meta_text,
          overlay_text: overlay_text || null,
          footer_text,
          tagline_text,
          image_url: payload.image_url,
          storage_path: payload.storage_path,
          display_order: nextOrder,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertErr) {
        await adminSupabase.storage.from("documentation").remove([payload.storage_path]);
        console.error("[saveDocumentationDirectAction] DB insert error:", insertErr);
        return {
          success: false,
          error: "Foto berhasil diunggah, tetapi dokumentasi gagal disimpan.",
        };
      }

      revalidatePath("/");
      revalidatePath("/dashboard/documentation");

      return {
        success: true,
        message: "Dokumentasi berhasil disimpan.",
        data: inserted,
      };
    }
  } catch (err) {
    console.error("[saveDocumentationDirectAction] Unexpected error:", err);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Cleans up orphaned uploads if user cancels before saving
 */
export async function cleanupOrphanedUploadAction(storagePath: string): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const adminSupabase = createAdminClient();
    await adminSupabase.storage.from("documentation").remove([storagePath]);
  } catch (err) {
    console.warn("[cleanupOrphanedUploadAction] Error:", err);
  }
}

/**
 * Creates a new documentation item
 */
export async function createDocumentationAction(
  formData: FormData
): Promise<DocumentationActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Akses ditolak. Silakan login sebagai admin." };
    }

    const caption = ((formData.get("caption") as string) || "").trim();
    const category_label = ((formData.get("category_label") as string) || "").trim() || "DOCUMENTATION";
    const meta_text = ((formData.get("meta_text") as string) || "").trim() || "X RPL 2 / 2026";
    const overlay_text = ((formData.get("overlay_text") as string) || "").trim();
    const footer_text = ((formData.get("footer_text") as string) || "").trim() || "ARSIP DOKUMENTER KELAS";
    const tagline_text = ((formData.get("tagline_text") as string) || "").trim() || "SATU KELAS. BANYAK CERITA.";
    const title = ((formData.get("title") as string) || "").trim() || footer_text || caption.slice(0, 40);
    const file = formData.get("image") as File | null;

    if (!caption) {
      return { success: false, error: "Caption dokumentasi wajib diisi." };
    }

    const fileValidation = validateImageFile(file);
    if (!fileValidation.valid || !file) {
      return { success: false, error: fileValidation.error || "Foto wajib diunggah." };
    }

    // Determine display_order: max + 1
    const { data: currentItems } = await supabase
      .from("documentation")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1);

    const nextOrder = currentItems && currentItems.length > 0
      ? (currentItems[0].display_order || 0) + 1
      : 1;

    // Upload image to Supabase Storage
    const adminSupabase = createAdminClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await adminSupabase.storage
      .from("documentation")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[createDocumentationAction] Upload error:", uploadError);
      return { success: false, error: "Gagal mengunggah foto. Coba lagi." };
    }

    const { data: publicUrlData } = adminSupabase.storage
      .from("documentation")
      .getPublicUrl(storagePath);

    const imageUrl = publicUrlData.publicUrl;

    // Insert into database using adminSupabase to ensure atomic and reliable write
    const { data: inserted, error: insertError } = await adminSupabase
      .from("documentation")
      .insert({
        title,
        caption,
        category_label,
        meta_text,
        overlay_text: overlay_text || null,
        footer_text,
        tagline_text,
        image_url: imageUrl,
        storage_path: storagePath,
        display_order: nextOrder,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      // If DB insert failed, clean up uploaded image
      await adminSupabase.storage.from("documentation").remove([storagePath]);
      console.error("[createDocumentationAction] DB error:", insertError);
      return { success: false, error: "Dokumentasi gagal disimpan. Coba lagi." };
    }

    revalidatePath("/");
    revalidatePath("/dashboard/documentation");

    return {
      success: true,
      message: "Dokumentasi berhasil disimpan.",
      data: inserted,
    };
  } catch (err) {
    console.error("[createDocumentationAction] Unexpected error:", err);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Updates an existing documentation item
 * If a new image is provided: uploads new, saves DB, then removes old file.
 */
export async function updateDocumentationAction(
  id: string,
  formData: FormData
): Promise<DocumentationActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Akses ditolak. Silakan login sebagai admin." };
    }

    // Fetch existing item
    const { data: existing, error: fetchError } = await supabase
      .from("documentation")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return { success: false, error: "Data dokumentasi tidak ditemukan." };
    }

    const caption = ((formData.get("caption") as string) || "").trim();
    const category_label = ((formData.get("category_label") as string) || "").trim() || existing.category_label;
    const meta_text = ((formData.get("meta_text") as string) || "").trim() || existing.meta_text;
    const overlay_text = ((formData.get("overlay_text") as string) || "").trim();
    const footer_text = ((formData.get("footer_text") as string) || "").trim() || existing.footer_text || "ARSIP DOKUMENTER KELAS";
    const tagline_text = ((formData.get("tagline_text") as string) || "").trim() || existing.tagline_text || "SATU KELAS. BANYAK CERITA.";
    const title = ((formData.get("title") as string) || "").trim() || footer_text || caption.slice(0, 40) || existing.title;
    const newFile = formData.get("image") as File | null;

    if (!caption) {
      return { success: false, error: "Caption dokumentasi wajib diisi." };
    }

    let updatedImageUrl = existing.image_url;
    let updatedStoragePath = existing.storage_path;
    let newlyUploadedPath: string | null = null;
    const adminSupabase = createAdminClient();

    // Check if new image file was provided
    if (newFile && newFile.size > 0) {
      const fileValidation = validateImageFile(newFile);
      if (!fileValidation.valid) {
        return { success: false, error: fileValidation.error || "File foto tidak valid." };
      }

      const ext = newFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const newStoragePath = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const arrayBuffer = await newFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await adminSupabase.storage
        .from("documentation")
        .upload(newStoragePath, buffer, {
          contentType: newFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("[updateDocumentationAction] Upload error:", uploadError);
        return { success: false, error: "Gagal mengunggah foto baru. Foto lama dipertahankan." };
      }

      const { data: publicUrlData } = adminSupabase.storage
        .from("documentation")
        .getPublicUrl(newStoragePath);

      updatedImageUrl = publicUrlData.publicUrl;
      updatedStoragePath = newStoragePath;
      newlyUploadedPath = newStoragePath;
    }

    // Update database record using adminSupabase for 100% reliability
    const { error: updateError } = await adminSupabase
      .from("documentation")
      .update({
        title,
        caption,
        category_label,
        meta_text,
        overlay_text: overlay_text || null,
        footer_text,
        tagline_text,
        image_url: updatedImageUrl,
        storage_path: updatedStoragePath,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      // If DB update failed and we uploaded a new file, remove the orphaned new file
      if (newlyUploadedPath) {
        await adminSupabase.storage.from("documentation").remove([newlyUploadedPath]);
      }
      console.error("[updateDocumentationAction] DB error:", updateError);
      return { success: false, error: "Dokumentasi gagal diperbarui. Coba lagi." };
    }

    // Clean up old file from storage only after DB update succeeded and old file had a storage_path
    if (newlyUploadedPath && existing.storage_path && existing.storage_path !== newlyUploadedPath) {
      try {
        await adminSupabase.storage.from("documentation").remove([existing.storage_path]);
      } catch (cleanErr) {
        console.warn("[updateDocumentationAction] Could not clean up old image:", cleanErr);
      }
    }

    revalidatePath("/");
    revalidatePath("/dashboard/documentation");

    return {
      success: true,
      message: "Dokumentasi berhasil disimpan.",
    };
  } catch (err) {
    console.error("[updateDocumentationAction] Unexpected error:", err);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Reorders documentation items
 */
export async function reorderDocumentationAction(
  orderedIds: string[]
): Promise<DocumentationActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Akses ditolak. Silakan login sebagai admin." };
    }

    // Update display_order for each ID using adminSupabase
    const adminSupabase = createAdminClient();
    const updates = orderedIds.map((id, index) =>
      adminSupabase
        .from("documentation")
        .update({ display_order: index + 1, updated_at: new Date().toISOString() })
        .eq("id", id)
    );

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error !== null);

    if (hasError) {
      return { success: false, error: "Gagal memperbarui urutan dokumentasi." };
    }

    revalidatePath("/");
    revalidatePath("/dashboard/documentation");

    return {
      success: true,
      message: "Urutan dokumentasi berhasil diperbarui.",
    };
  } catch (err) {
    console.error("[reorderDocumentationAction] Unexpected error:", err);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Toggles documentation active/inactive status
 */
export async function toggleActiveDocumentationAction(
  id: string,
  isActive: boolean
): Promise<DocumentationActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Akses ditolak. Silakan login sebagai admin." };
    }

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
      .from("documentation")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: "Gagal mengubah status dokumentasi." };
    }

    revalidatePath("/");
    revalidatePath("/dashboard/documentation");

    return {
      success: true,
      message: isActive ? "Dokumentasi diaktifkan." : "Dokumentasi dinonaktifkan.",
    };
  } catch (err) {
    console.error("[toggleActiveDocumentationAction] Unexpected error:", err);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}

/**
 * Deletes a documentation item and cleans up storage
 */
export async function deleteDocumentationAction(
  id: string
): Promise<DocumentationActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Akses ditolak. Silakan login sebagai admin." };
    }

    const adminSupabase = createAdminClient();

    // Get item info first for storage path
    const { data: existing } = await adminSupabase
      .from("documentation")
      .select("storage_path")
      .eq("id", id)
      .single();

    const { error } = await adminSupabase.from("documentation").delete().eq("id", id);

    if (error) {
      return { success: false, error: "Gagal menghapus dokumentasi." };
    }

    // Delete image from storage if stored in bucket
    if (existing?.storage_path) {
      await adminSupabase.storage.from("documentation").remove([existing.storage_path]);
    }

    revalidatePath("/");
    revalidatePath("/dashboard/documentation");

    return {
      success: true,
      message: "Dokumentasi berhasil dihapus.",
    };
  } catch (err) {
    console.error("[deleteDocumentationAction] Unexpected error:", err);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}
