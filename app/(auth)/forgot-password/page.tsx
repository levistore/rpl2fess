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
    <div className="min-h-screen bg-[#F6F3EA] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#111111] hover:text-[#5B7CFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Log In
        </Link>
      </div>

      <div className="w-full max-w-md">
        <Card variant="white" shadow="lg" className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-[8px] bg-[#FF6B9A] border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] items-center justify-center text-[#111111] mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#111111]">
              Reset Password
            </h1>
            <p className="text-sm font-medium text-[#111111]/70 mt-1">
              Enter your email and we’ll send a link to restore your inbox access.
            </p>
          </div>

          {state?.success ? (
            <div className="p-4 rounded-[6px] bg-[#8ED081] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] text-sm font-bold text-[#111111] flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p>Password reset link sent!</p>
                <p className="text-xs font-medium mt-1">
                  Please check your spam or inbox folder.
                </p>
              </div>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="p-3 rounded-[6px] bg-[#FF6B9A] border-[2px] border-[#111111] text-xs font-bold text-[#111111]">
                  {state.error}
                </div>
              )}

              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isPending}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
