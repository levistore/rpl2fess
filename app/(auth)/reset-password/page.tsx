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
    <div className="min-h-screen bg-[#F6F3EA] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card variant="white" shadow="lg" className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-[8px] bg-[#8ED081] border-[3px] border-[#111111] shadow-[4px_4px_0_#111111] items-center justify-center text-[#111111] mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#111111]">
              Set New Password
            </h1>
            <p className="text-sm font-medium text-[#111111]/70 mt-1">
              Choose a strong password to protect your inbox.
            </p>
          </div>

          {state?.error && (
            <div className="mb-4 p-3 rounded-[6px] bg-[#FF6B9A] border-[2px] border-[#111111] text-xs font-bold text-[#111111]">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <Input
              name="password"
              type="password"
              label="New Password"
              placeholder="••••••••"
              required
              error={state?.fieldErrors?.password?.[0]}
            />

            <Input
              name="confirmPassword"
              type="password"
              label="Confirm Password"
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
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
