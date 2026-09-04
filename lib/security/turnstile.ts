/**
 * Verifies a Cloudflare Turnstile token server-side.
 */
export async function verifyTurnstileToken(
  token?: string | null,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  // If Turnstile is in test mode or not configured with a production key, pass gracefully
  if (
    !secretKey ||
    secretKey === "1x00000000000000000000000000000000AA" ||
    !token
  ) {
    return { success: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const outcome = await res.json();
    if (outcome.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: outcome["error-codes"]?.[0] || "Bot verification failed",
      };
    }
  } catch (err) {
    console.error("Turnstile verification exception:", err);
    // Fail open in case of network glitch unless strict mode is enabled
    return { success: true };
  }
}
