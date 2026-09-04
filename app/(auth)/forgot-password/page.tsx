"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction, ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    {} as ActionState
  );

  return (
    <div className="min-h-screen bg-[#08090B] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#3D5CFF] selection:text-white">
      <div className="w-full max-w-md mb-6 relative z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Login
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card variant="surface" className="p-8 sm:p-9 border border-[#2A2D34] shadow-2xl shadow-black/80">
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-xl bg-[#181B21] border border-[#2A2D34] items-center justify-center text-[#7B8DFF] mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
              RESET PASSWORD
            </h1>
            <p className="text-xs sm:text-sm text-[#9A9DA5] mt-1">
              Masukkan email admin untuk menerima tautan pemulihan sandi.
            </p>
          </div>

          {state?.success ? (
            <div className="p-4 rounded-xl bg-[#42D392]/15 border border-[#42D392]/30 text-xs sm:text-sm text-[#F5F5F2] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#42D392] mt-0.5" />
              <div>
                <p className="font-semibold text-[#42D392]">Tautan reset berhasil dikirim!</p>
                <p className="text-[#9A9DA5] mt-1">
                  Silakan periksa kotak masuk atau spam email Anda.
                </p>
              </div>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="p-3 rounded-xl bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 text-xs font-medium text-[#FF4D4D]">
                  {state.error}
                </div>
              )}

              <Input
                name="email"
                type="email"
                label="Alamat Email"
                placeholder="admin@rpltwofess.web.id"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isPending}
              >
                Kirim Tautan Reset
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
