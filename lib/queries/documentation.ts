import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { DocumentationItem } from "@/types/database";

// Fallback items in case table is empty or error occurs
const FALLBACK_DOCUMENTATION: DocumentationItem[] = [
  {
    id: "fallback-01",
    title: "Awal dari Banyak Cerita",
    caption: "X RPL 2 — awal dari banyak cerita.",
    category_label: "DOCUMENTATION / 01",
    meta_text: "X RPL 2 / 2026",
    overlay_text: "ARCHIVE // 2026",
    image_url: "/images/class/class-01.jpg",
    storage_path: null,
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "fallback-02",
    title: "Momen Berharga",
    caption: "Di balik tugas, deadline, dan hari-hari biasa.",
    category_label: "DOCUMENTATION / 02",
    meta_text: "LAB KOMPUTER / 2026",
    overlay_text: "SERIES // VOL. 01",
    image_url: "/images/class/class-02.jpg",
    storage_path: null,
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "fallback-03",
    title: "Di Balik Layar",
    caption: "Dokumentasi kecil dari satu kelas yang sama.",
    category_label: "DOCUMENTATION / 03",
    meta_text: "SESI PROJEK / 2026",
    overlay_text: "MEMORIES // 03",
    image_url: "/images/class/class-03.jpg",
    storage_path: null,
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "fallback-04",
    title: "Langkah Bersama",
    caption: "Satu langkah kecil menuju masa depan bersama.",
    category_label: "DOCUMENTATION / 04",
    meta_text: "X RPL 2 / 2026",
    overlay_text: "MOMENTS // 04",
    image_url: "/images/class/class-04.jpg",
    storage_path: null,
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Get all documentation items for the Admin Panel.
 * Ordered by display_order ASC, created_at DESC.
 */
export async function getAllDocumentation(): Promise<DocumentationItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("documentation")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data as DocumentationItem[];
    }

    // Fallback to admin client if user client encounters an RLS/cookie issue
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    const { data: adminData } = await admin
      .from("documentation")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    return (adminData as DocumentationItem[]) || [];
  } catch (err) {
    console.error("[getAllDocumentation] Unexpected error:", err);
    return [];
  }
}

/**
 * Get active documentation items for the Homepage.
 * Ordered by display_order ASC.
 * Falls back to default documentation if table is empty.
 */
export async function getActiveDocumentation(): Promise<DocumentationItem[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_anon_key";
    const publicClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await publicClient
      .from("documentation")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[getActiveDocumentation] Supabase error:", error.message);
      return FALLBACK_DOCUMENTATION;
    }

    if (!data || data.length === 0) {
      return FALLBACK_DOCUMENTATION;
    }

    return data as DocumentationItem[];
  } catch (err) {
    console.error("[getActiveDocumentation] Unexpected error:", err);
    return FALLBACK_DOCUMENTATION;
  }
}
