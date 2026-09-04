"use client";

import * as React from "react";
import { useActionState } from "react";
import { resetPasswordAction, ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    {} as ActionState
  );

  return (
    <div className="min-h-screen bg-[#08090B] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#3D5CFF] selection:text-white">
      <div className="w-full max-w-md relative z-10">
        <Card variant="surface" className="p-8 sm:p-9 border border-[#2A2D34] shadow-2xl shadow-black/80">
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-xl bg-[#181B21] border border-[#2A2D34] items-center justify-center text-[#42D392] mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
              SET NEW PASSWORD
            </h1>
            <p className="text-xs sm:text-sm text-[#9A9DA5] mt-1">
              Buat password baru yang aman untuk akun admin Anda.
            </p>
          </div>

          {state?.error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 text-xs font-medium text-[#FF4D4D]">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <Input
              name="password"
              type="password"
              label="Password Baru"
              placeholder="••••••••"
              required
              error={state?.fieldErrors?.password?.[0]}
            />

            <Input
              name="confirmPassword"
              type="password"
              label="Konfirmasi Password Baru"
              placeholder="••••••••"
              required
              error={state?.fieldErrors?.confirmPassword?.[0]}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isPending}
            >
              Simpan Password Baru
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
