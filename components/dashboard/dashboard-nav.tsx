"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Camera,
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
      label: "Dokumentasi",
      href: "/dashboard/documentation",
      icon: Camera,
    },
    {
      label: "Pengaturan",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#111318] border-r border-[#2A2D34] min-h-screen p-6 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#181B21] border border-[#2A2D34] flex items-center justify-center text-[#3D5CFF]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-[#F5F5F2] block leading-none font-display">
              RPLTWOFESS
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#9A9DA5] uppercase">
              OWNER PANEL
            </span>
          </div>
        </Link>

        {/* Public send link button */}
        <Link
          href="/send"
          target="_blank"
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#181B21] border border-[#2A2D34] hover:border-[#3D5CFF]/60 hover:bg-[#3D5CFF]/10 transition-all text-xs font-medium text-[#F5F5F2]"
        >
          <span className="flex items-center gap-2">
            <Send className="w-3.5 h-3.5 text-[#3D5CFF]" /> Buka Halaman Kirim
          </span>
          <ExternalLink className="w-3 h-3 text-[#9A9DA5]" />
        </Link>

        {/* Navigation list */}
        <nav className="space-y-1.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-150 border",
                  isActive
                    ? "bg-[#3D5CFF]/15 text-[#7B8DFF] border-[#3D5CFF]/40 shadow-[0_0_15px_-3px_rgba(61,92,255,0.3)]"
                    : "bg-transparent text-[#9A9DA5] border-transparent hover:text-[#F5F5F2] hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-[#3D5CFF] text-[11px] font-mono font-bold text-white shadow-[0_0_10px_rgba(61,92,255,0.5)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <form action={signOutAction} className="pt-6 border-t border-[#2A2D34]">
        <button
          type="submit"
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#2A2D34] bg-[#181B21] hover:bg-[#FF4D4D]/15 hover:border-[#FF4D4D]/30 hover:text-[#FF4D4D] text-[#9A9DA5] transition-all text-xs font-medium cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </form>
    </aside>
  );
}

export function MobileDashboardHeader() {
  return (
    <header className="lg:hidden sticky top-0 z-30 w-full bg-[#111318]/90 backdrop-blur-md border-b border-[#2A2D34] px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#181B21] border border-[#2A2D34] flex items-center justify-center text-[#3D5CFF]">
          <MessageSquare className="w-3.5 h-3.5" />
        </div>
        <span className="font-display text-lg tracking-wide uppercase text-[#F5F5F2]">
          RPLTWOFESS
        </span>
      </Link>

      <Link
        href="/send"
        target="_blank"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3D5CFF] text-[#F5F5F2] text-xs font-medium hover:bg-[#536DFF] transition-all"
      >
        <Send className="w-3 h-3" />
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
      label: "Dokumentasi",
      href: "/dashboard/documentation",
      icon: Camera,
    },
    {
      label: "Pengaturan",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111318]/95 backdrop-blur-md border-t border-[#2A2D34] px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            className={cn(
              "relative flex flex-col items-center justify-center p-2 rounded-xl min-w-[72px] transition-all text-xs",
              isActive
                ? "text-[#7B8DFF] bg-[#3D5CFF]/15 border border-[#3D5CFF]/30 font-medium"
                : "text-[#9A9DA5] hover:text-[#F5F5F2] border border-transparent"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] mt-1 tracking-wide">
              {item.label}
            </span>
            {item.badge !== undefined && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#3D5CFF] text-[9px] font-mono font-bold text-white shadow-[0_0_8px_rgba(61,92,255,0.6)]">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
