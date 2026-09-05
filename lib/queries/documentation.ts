import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { DocumentationItem } from "@/types/database";

function getPublicClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_anon_key";
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

/**
 * Get Featured Documentation for Hero Homepage.
 * Strictly queries type = 'featured'.
 * Returns null if no active record exists. NEVER falls back to gallery or send_page.
 */
export async function getFeaturedDocumentation(): Promise<DocumentationItem | null> {
  try {
    const client = getPublicClient();
    const { data, error } = await client
      .from("documentation")
      .select("*")
      .eq("type", "featured")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[getFeaturedDocumentation] Supabase error:", error.message);
      return null;
    }

    return (data as DocumentationItem) || null;
  } catch (err) {
    console.error("[getFeaturedDocumentation] Unexpected error:", err);
    return null;
  }
}

/**
 * Get Gallery Documentation for the Homepage Gallery section.
 * Strictly queries type = 'gallery', ordered by display_order ASC.
 * Returns empty array if no active records exist. NEVER falls back to featured or send_page.
 */
export async function getGalleryDocumentation(): Promise<DocumentationItem[]> {
  try {
    const client = getPublicClient();
    const { data, error } = await client
      .from("documentation")
      .select("*")
      .eq("type", "gallery")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[getGalleryDocumentation] Supabase error:", error.message);
      return [];
    }

    return (data as DocumentationItem[]) || [];
  } catch (err) {
    console.error("[getGalleryDocumentation] Unexpected error:", err);
    return [];
  }
}

/**
 * Get Send Page Documentation for /send.
 * Strictly queries type = 'send_page'.
 * Returns null if no active record exists. NEVER falls back to featured or gallery.
 */
export async function getSendPageDocumentation(): Promise<DocumentationItem | null> {
  try {
    const client = getPublicClient();
    const { data, error } = await client
      .from("documentation")
      .select("*")
      .eq("type", "send_page")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[getSendPageDocumentation] Supabase error:", error.message);
      return null;
    }

    return (data as DocumentationItem) || null;
  } catch (err) {
    console.error("[getSendPageDocumentation] Unexpected error:", err);
    return null;
  }
}

export interface GroupedDocumentation {
  featured: DocumentationItem | null;
  gallery: DocumentationItem[];
  sendPage: DocumentationItem | null;
}

/**
 * Get all documentation items grouped by type for the Admin Panel.
 * Uses adminSupabase to ensure all items (active & inactive) are accessible.
 */
export async function getAllDocumentationGrouped(): Promise<GroupedDocumentation> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("documentation")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("[getAllDocumentationGrouped] Supabase error:", error?.message);
      return { featured: null, gallery: [], sendPage: null };
    }

    const allItems = data as DocumentationItem[];
    const featured = allItems.find((it) => it.type === "featured") || null;
    const sendPage = allItems.find((it) => it.type === "send_page") || null;
    const gallery = allItems.filter((it) => it.type === "gallery");

    return {
      featured,
      gallery,
      sendPage,
    };
  } catch (err) {
    console.error("[getAllDocumentationGrouped] Unexpected error:", err);
    return { featured: null, gallery: [], sendPage: null };
  }
}

/**
 * Backward-compatible helper to fetch all documentation.
 * Zero hardcoded fallback.
 */
export async function getAllDocumentation(): Promise<DocumentationItem[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("documentation")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as DocumentationItem[];
  } catch (err) {
    console.error("[getAllDocumentation] Unexpected error:", err);
    return [];
  }
}
