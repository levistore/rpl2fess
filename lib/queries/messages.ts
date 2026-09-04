import { createClient } from "@/lib/supabase/server";
import { Message, DashboardStats, SiteSettings } from "@/types/database";

export interface GetInboxOptions {
  filter?: "all" | "unread" | "read";
  sort?: "newest" | "oldest";
  search?: string;
  limit?: number;
}

export async function getInboxMessages(
  options: GetInboxOptions = {}
): Promise<{ messages: Message[]; unreadCount: number; totalCount: number }> {
  const supabase = await createClient();

  let query = supabase
    .from("messages")
    .select("id, content, is_read, is_deleted, sender_hash, created_at")
    .eq("is_deleted", false);

  if (options.filter === "unread") {
    query = query.eq("is_read", false);
  } else if (options.filter === "read") {
    query = query.eq("is_read", true);
  }

  if (options.sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data: messages, error } = await query;

  if (error || !messages) {
    console.error("Error fetching inbox messages:", error);
    return { messages: [], unreadCount: 0, totalCount: 0 };
  }

  // Count unread
  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_deleted", false)
    .eq("is_read", false);

  // Count total
  const { count: totalCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_deleted", false);

  let result = messages as Message[];

  if (options.search && options.search.trim()) {
    const s = options.search.toLowerCase();
    result = result.filter((m) => m.content.toLowerCase().includes(s));
  }

  return {
    messages: result,
    unreadCount: unreadCount || 0,
    totalCount: totalCount || 0,
  };
}

export async function getMessageById(id: string): Promise<Message | null> {
  const supabase = await createClient();

  const { data: message, error } = await supabase
    .from("messages")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .maybeSingle();

  if (error || !message) return null;

  return message as Message;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const [
    { count: totalCount },
    { count: unreadCount },
    { count: todayCount },
  ] = await Promise.all([
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false),
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false)
      .eq("is_read", false),
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false)
      .gte("created_at", todayStart),
  ]);

  return {
    totalMessages: totalCount || 0,
    unreadMessages: unreadCount || 0,
    todayMessages: todayCount || 0,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (!settings) {
    return {
      id: "default",
      accepting_messages: true,
      max_length: 500,
      site_title: "RPLTwoFess",
      tagline: "Satu Kelas. Banyak Cerita.",
      updated_at: new Date().toISOString(),
    };
  }

  return settings as SiteSettings;
}
