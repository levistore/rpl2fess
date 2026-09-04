import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Masukkan alamat email yang valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Masukkan alamat email yang valid"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Pesan tidak boleh kosong")
    .max(500, "Pesan maksimal 500 karakter"),
  turnstileToken: z.string().nullish(),
});

export const reportSchema = z.object({
  messageId: z.string().uuid("ID pesan tidak valid"),
  reason: z.enum([
    "harassment",
    "bullying",
    "spam",
    "hate",
    "sexual_content",
    "threat",
    "other",
  ]),
  details: z.string().max(500, "Detail maksimal 500 karakter").optional(),
});

export const siteSettingsSchema = z.object({
  acceptingMessages: z.boolean(),
  maxLength: z.number().int().min(50).max(1000),
  siteTitle: z.string().min(1).max(50),
  tagline: z.string().min(1).max(100),
});
