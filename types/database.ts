export interface Message {
  id: string;
  content: string;
  sender_name?: string | null;
  recipient_name?: string | null;
  is_read: boolean;
  is_deleted: boolean;
  sender_hash: string | null;
  created_at: string;
}

export type ReportReason =
  | "harassment"
  | "bullying"
  | "spam"
  | "hate"
  | "sexual_content"
  | "threat"
  | "other";

export interface Report {
  id: string;
  message_id: string;
  reason: ReportReason;
  details: string | null;
  status: "pending" | "reviewed" | "dismissed";
  created_at: string;
  message?: Message;
}

export interface Block {
  id: string;
  sender_hash: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  accepting_messages: boolean;
  max_length: number;
  site_title: string;
  tagline: string;
  recipient_name?: string;
  updated_at: string;
}

export interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
  todayMessages: number;
}

export type DocumentationType = "featured" | "gallery" | "send_page";

export interface DocumentationItem {
  id: string;
  type: DocumentationType;
  title: string;
  caption: string;
  category_label: string;
  meta_text: string;
  overlay_text: string | null;
  footer_text?: string | null;
  tagline_text?: string | null;
  image_url: string;
  storage_path: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PushSubscriptionRecord {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
  updated_at: string;
}

