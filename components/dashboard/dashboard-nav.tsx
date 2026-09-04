"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  MessageSquare,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/actions/auth";

interface DashboardNavProps {
  unreadCount?: number;
}

export function DashboardSidebar({ unreadCount = 0 }: DashboardNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Inbox Pesan",
      href: "/dashboard/inbox",
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      label: "Pengaturan",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#F6F3EA] border-r-[3px] border-[#111111] min-h-screen p-6 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-[6px] bg-[#5B7CFF] border-[2.5px] border-[#111111] shadow-[2.5px_2.5px_0_#111111] flex items-center justify-center text-[#111111]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tighter uppercase text-[#111111] block leading-none">
              RPLTwoFess
            </span>
            <span className="text-[10px] font-black uppercase text-[#111111]/60 tracking-wider">
              Owner Panel
            </span>
          </div>
        </Link>

        {/* Public send link button */}
        <Link
          href="/send"
          target="_blank"
          className="w-full flex items-center justify-between p-3 rounded-[6px] bg-[#FFD84D] border-[2.5px] border-[#111111] shadow-[3px_3px_0_#111111] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#111111] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all font-black text-xs uppercase tracking-wider text-[#111111]"
        >
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" /> Buka Halaman Kirim
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Navigation list */}
        <nav className="space-y-2 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-3 rounded-[6px] font-bold text-sm uppercase tracking-wider transition-all duration-120 border-[2.5px]",
                  isActive
                    ? "bg-[#5B7CFF] text-[#111111] border-[#111111] shadow-[3px_3px_0_#111111]"
                    : "bg-transparent text-[#111111] border-transparent hover:border-[#111111] hover:bg-[#FFFFFF] hover:shadow-[2px_2px_0_#111111]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#FF6B9A] border-[1.5px] border-[#111111] text-xs font-black shadow-[1.5px_1.5px_0_#111111]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <form action={signOutAction} className="pt-6 border-t-[2.5px] border-[#111111]">
        <button
          type="submit"
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-[6px] border-[2px] border-[#111111] bg-[#FFFFFF] shadow-[2px_2px_0_#111111] hover:bg-[#FF6B9A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-bold text-xs uppercase tracking-wider text-[#111111] cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </form>
    </aside>
  );
}

export function MobileDashboardHeader() {
  return (
    <header className="lg:hidden sticky top-0 z-30 w-full bg-[#F6F3EA] border-b-[3px] border-[#111111] px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-[6px] bg-[#5B7CFF] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center text-[#111111]">
          <MessageSquare className="w-4 h-4" />
        </div>
        <span className="font-black text-lg uppercase tracking-tighter text-[#111111]">
          RPLTwoFess
        </span>
      </Link>

      <Link
        href="/send"
        target="_blank"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#FFD84D] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-black text-xs uppercase tracking-wider text-[#111111]"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Kirim Pesan</span>
      </Link>
    </header>
  );
}

export function MobileBottomNav({ unreadCount = 0 }: DashboardNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Inbox",
      href: "/dashboard/inbox",
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      label: "Pengaturan",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F6F3EA] border-t-[3px] border-[#111111] px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center p-2 rounded-[6px] border-[2px] min-w-[72px] transition-all",
              isActive
                ? "bg-[#5B7CFF] text-[#111111] border-[#111111] shadow-[2px_2px_0_#111111] font-black"
                : "bg-transparent text-[#111111]/70 border-transparent font-bold"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider mt-0.5">
              {item.label}
            </span>
            {item.badge !== undefined && (
              <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-[4px] bg-[#FF6B9A] border-[1.5px] border-[#111111] text-[9px] font-black text-[#111111] shadow-[1px_1px_0_#111111]">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
