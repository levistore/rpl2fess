import { createAdminClient } from "@/lib/supabase/admin";

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  retryAfterSeconds?: number;
}

// Fallback in-memory map if database is not reachable
const localFallbackMap = new Map<string, { count: number; lastTime: number; windowStart: number }>();

/**
 * Serverless-safe shared rate limiter using Supabase PostgreSQL table `rate_limits`.
 * Cooldown: 20 seconds between submissions
 * Window: Max 5 submissions per 10 minutes
 */
export async function checkServerlessRateLimit(
  senderHash: string
): Promise<RateLimitResult> {
  const COOLDOWN_SECONDS = 20;
  const WINDOW_SECONDS = 10 * 60; // 10 minutes
  const MAX_PER_WINDOW = 5;

  const now = new Date();
  const nowMs = now.getTime();

  try {
    const supabase = createAdminClient();

    const { data: record, error } = await supabase
      .from("rate_limits")
      .select("*")
      .eq("sender_hash", senderHash)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      // Table might not exist yet or connection error, fall back to in-memory
      return checkInMemoryFallback(senderHash, nowMs, COOLDOWN_SECONDS, WINDOW_SECONDS, MAX_PER_WINDOW);
    }

    if (!record) {
      // First attempt from this hash
      await supabase.from("rate_limits").insert({
        sender_hash: senderHash,
        action_count: 1,
        window_start: now.toISOString(),
        last_attempt: now.toISOString(),
      });
      return { allowed: true };
    }

    const lastAttemptMs = new Date(record.last_attempt).getTime();
    const windowStartMs = new Date(record.window_start).getTime();

    // 1. Check cooldown (minimum 20s between messages)
    const elapsedSinceLastSec = Math.floor((nowMs - lastAttemptMs) / 1000);
    if (elapsedSinceLastSec < COOLDOWN_SECONDS) {
      const waitTime = COOLDOWN_SECONDS - elapsedSinceLastSec;
      return {
        allowed: false,
        reason: `Tunggu ${waitTime} detik sebelum mengirim pesan berikutnya.`,
        retryAfterSeconds: waitTime,
      };
    }

    // 2. Check 10-minute window
    const elapsedWindowSec = Math.floor((nowMs - windowStartMs) / 1000);

    if (elapsedWindowSec >= WINDOW_SECONDS) {
      // Window expired, reset
      await supabase
        .from("rate_limits")
        .update({
          action_count: 1,
          window_start: now.toISOString(),
          last_attempt: now.toISOString(),
        })
        .eq("id", record.id);
      return { allowed: true };
    }

    // Still in same window, check limit
    if (record.action_count >= MAX_PER_WINDOW) {
      const waitTime = WINDOW_SECONDS - elapsedWindowSec;
      return {
        allowed: false,
        reason: `Batas pesan tercapai. Silakan coba lagi dalam ${Math.ceil(waitTime / 60)} menit.`,
        retryAfterSeconds: waitTime,
      };
    }

    // Allowed, increment count
    await supabase
      .from("rate_limits")
      .update({
        action_count: record.action_count + 1,
        last_attempt: now.toISOString(),
      })
      .eq("id", record.id);

    return { allowed: true };
  } catch {
    // Graceful fallback to memory limiter
    return checkInMemoryFallback(senderHash, nowMs, COOLDOWN_SECONDS, WINDOW_SECONDS, MAX_PER_WINDOW);
  }
}

function checkInMemoryFallback(
  senderHash: string,
  nowMs: number,
  cooldownSec: number,
  windowSec: number,
  maxPerWindow: number
): RateLimitResult {
  const item = localFallbackMap.get(senderHash);

  if (!item) {
    localFallbackMap.set(senderHash, { count: 1, lastTime: nowMs, windowStart: nowMs });
    return { allowed: true };
  }

  const elapsedLastSec = Math.floor((nowMs - item.lastTime) / 1000);
  if (elapsedLastSec < cooldownSec) {
    const wait = cooldownSec - elapsedLastSec;
    return {
      allowed: false,
      reason: `Tunggu ${wait} detik sebelum mengirim pesan berikutnya.`,
      retryAfterSeconds: wait,
    };
  }

  const elapsedWindowSec = Math.floor((nowMs - item.windowStart) / 1000);
  if (elapsedWindowSec >= windowSec) {
    item.count = 1;
    item.windowStart = nowMs;
    item.lastTime = nowMs;
    return { allowed: true };
  }

  if (item.count >= maxPerWindow) {
    const wait = windowSec - elapsedWindowSec;
    return {
      allowed: false,
      reason: `Batas pesan tercapai. Silakan coba lagi dalam ${Math.ceil(wait / 60)} menit.`,
      retryAfterSeconds: wait,
    };
  }

  item.count += 1;
  item.lastTime = nowMs;
  return { allowed: true };
}
