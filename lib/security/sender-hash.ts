import { createHmac } from "crypto";
import { headers } from "next/headers";

/**
 * Extracts client IP safely from incoming request headers.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headerList.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Generates a privacy-preserving cryptographic hash for an anonymous sender.
 * Raw IP and User-Agent are NEVER stored or logged.
 */
export async function generateSenderHash(): Promise<string> {
  const headerList = await headers();
  const ip = await getClientIp();
  const userAgent = headerList.get("user-agent") || "unknown";
  const salt = process.env.SENDER_HASH_SALT || "lconfess_fallback_salt_2026";

  const rawData = `${ip}::${userAgent}`;
  return createHmac("sha256", salt).update(rawData).digest("hex");
}
