import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY VIOLATION: createAdminClient must never be called in client-side browser code."
    );
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey === "dummy_service_role_key") {
    console.warn(
      "WARNING: SUPABASE_SERVICE_ROLE_KEY is not configured or using dummy value."
    );
  }

  return createSupabaseClient(
    supabaseUrl,
    serviceRoleKey || "dummy_service_role_key",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
