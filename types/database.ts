export interface Message {
  id: string;
  content: string;
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
  updated_at: string;
}

export interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
  todayMessages: number;
}
