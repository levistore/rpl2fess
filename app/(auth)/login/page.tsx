"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useActionState, Suspense } from "react";
import { signInAction, ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [state, formAction, isPending] = useActionState(
    signInAction,
    {} as ActionState
  );

  return (
    <Card variant="surface" className="p-8 sm:p-9 border border-[#2A2D34] shadow-2xl shadow-black/80">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-[#181B21] border border-[#2A2D34] items-center justify-center p-2.5 mb-4 shadow-[0_0_20px_-5px_rgba(61,92,255,0.3)] overflow-hidden">
          <Image
            src="/images/brand/rpl-logo.png"
            alt="RPL Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <span className="block text-xs font-mono uppercase tracking-widest text-[#7B8DFF] mb-1">
          &#8226; PORTAL PRIVAT &#8226;
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
          OWNER LOGIN
        </h1>
        <p className="text-xs sm:text-sm text-[#9A9DA5] mt-1">
          Masuk ke dashboard untuk mengelola pesan dan pengaturan akun.
        </p>
      </div>

      {/* Global Error Alert */}
      {state?.error && (
        <div className="mb-6 p-3.5 rounded-xl bg-[#FF4D4D]/15 border border-[#FF4D4D]/30 text-xs sm:text-sm font-medium text-[#FF4D4D] flex items-center gap-2">
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
            <label className="block text-xs font-medium uppercase tracking-wider text-[#9A9DA5]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#7B8DFF] hover:text-[#536DFF] transition-colors"
            >
              Lupa Password?
            </Link>
          </div>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full h-11 px-4 rounded-lg bg-[#111318] text-[#F5F5F2] font-normal placeholder:text-[#9A9DA5]/40 border border-[#2A2D34] focus:outline-none focus:border-[#3D5CFF] focus:shadow-[0_0_20px_-4px_rgba(61,92,255,0.4)] transition-all duration-150"
          />
          {state?.fieldErrors?.password?.[0] && (
            <p className="text-xs font-medium text-[#FF4D4D] mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D] inline-block shrink-0" />
              <span>{state.fieldErrors.password[0]}</span>
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
    <div className="min-h-screen bg-[#08090B] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#3D5CFF] selection:text-white">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#3D5CFF]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md mb-6 relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A9DA5] hover:text-[#F5F5F2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Suspense fallback={<div className="p-8 text-center text-[#9A9DA5] font-mono">Memuat portal login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
