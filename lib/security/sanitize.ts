/**
 * Sanitizes user-submitted message content:
 * - Strips non-printable control characters
 * - Normalizes excessive duplicate newlines
 * - Trims whitespace
 */
export function sanitizeMessageContent(input: string): string {
  if (!input) return "";

  return input
    // Remove null bytes and invisible control chars (keep standard newlines and tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Collapse 3+ consecutive newlines to maximum 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
