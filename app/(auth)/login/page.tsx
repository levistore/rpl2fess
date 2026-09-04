"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, Suspense } from "react";
import { signInAction, ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageSquare, ArrowLeft, ShieldAlert } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [state, formAction, isPending] = useActionState(
    signInAction,
    {} as ActionState
  );

  return (
    <Card variant="white" shadow="lg" className="p-8 border-[3px] border-[#111111]">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex w-14 h-14 rounded-[8px] bg-[#5B7CFF] border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] items-center justify-center text-[#111111] mb-4">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
          Owner Login
        </h1>
        <p className="text-xs sm:text-sm font-bold text-[#111111]/70 mt-1">
          Login khusus pemilik website RPLTwoFess.
        </p>
      </div>

      {/* Global Error Alert */}
      {state?.error && (
        <div className="mb-6 p-3.5 rounded-[6px] bg-[#FF6B9A] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] text-xs sm:text-sm font-bold text-[#111111] flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <Input
          name="email"
          type="email"
          label="Alamat Email Admin"
          placeholder="owner@rpltwofess.web.id"
          required
          error={state?.fieldErrors?.email?.[0]}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-[#111111]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-[#5B7CFF] hover:underline"
            >
              Lupa Password?
            </Link>
          </div>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full h-12 px-4 rounded-[6px] bg-[#FFFFFF] text-[#111111] font-medium placeholder:text-[#111111]/40 border-[3px] border-[#111111] shadow-[3px_3px_0_#111111] focus:outline-none focus:border-[#5B7CFF] focus:shadow-[5px_5px_0_#111111] transition-all duration-120"
          />
          {state?.fieldErrors?.password?.[0] && (
            <p className="text-xs font-bold text-[#FF6B9A] mt-1.5 flex items-center gap-1">
              <span>⚠</span> {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isPending}
        >
          Masuk ke Dashboard
        </Button>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F6F3EA] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-[#5B7CFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
      </div>

      <div className="w-full max-w-md">
        <Suspense fallback={<div className="p-8 text-center font-bold">Memuat portal login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
