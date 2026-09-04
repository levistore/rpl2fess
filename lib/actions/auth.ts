"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validation/schemas";
import { redirect } from "next/navigation";

export interface ActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function signInAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      error: "Silakan masukkan email dan password yang valid.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return {
      error: "Email atau password salah.",
    };
  }

  redirect(redirectTo);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const validation = forgotPasswordSchema.safeParse({ email });

  if (!validation.success) {
    return {
      error: "Masukkan alamat email yang valid.",
    };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(
    validation.data.email,
    {
      redirectTo: `${origin}/reset-password`,
    }
  );

  if (error) {
    return {
      error: error.message || "Gagal mengirim link reset password.",
    };
  }

  return {
    success: true,
  };
}

export async function resetPasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validation = resetPasswordSchema.safeParse({
    password,
    confirmPassword,
  });

  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Password tidak valid.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    return {
      error: error.message || "Gagal memperbarui password.",
    };
  }

  redirect("/dashboard");
}
