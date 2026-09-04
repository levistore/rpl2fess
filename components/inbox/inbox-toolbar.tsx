"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

interface InboxToolbarProps {
  currentFilter?: string;
  currentSort?: string;
  searchQuery?: string;
}

export function InboxToolbar({
  currentFilter = "all",
  currentSort = "newest",
  searchQuery = "",
}: InboxToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState(searchQuery);

  const updateParams = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "" || (key === "filter" && val === "all") || (key === "sort" && val === "newest")) {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });
    const query = current.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: search.trim() || null });
  };

  const filterTabs = [
    { key: "all", label: "Semua" },
    { key: "unread", label: "Belum Dibaca" },
    { key: "read", label: "Sudah Dibaca" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#111318] border border-[#2A2D34] shadow-xl shadow-black/50">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => updateParams({ filter: tab.key })}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#3D5CFF]/20 border border-[#3D5CFF]/40 text-[#7B8DFF] shadow-[0_0_15px_-3px_rgba(61,92,255,0.3)]"
                  : "bg-transparent text-[#9A9DA5] hover:text-[#F5F5F2] hover:bg-white/5 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Sort */}
      <div className="flex items-center gap-2">
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-60">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pesan..."
            className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#2A2D34] text-xs text-[#F5F5F2] bg-[#181B21] placeholder:text-[#9A9DA5]/40 focus:outline-none focus:border-[#3D5CFF] transition-all"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9A9DA5]" />
        </form>

        {/* Sort selector */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="h-9 px-3 rounded-lg border border-[#2A2D34] bg-[#181B21] text-xs font-medium text-[#F5F5F2] cursor-pointer focus:outline-none focus:border-[#3D5CFF] transition-all"
          >
            <option value="newest" className="bg-[#111318]">Terbaru</option>
            <option value="oldest" className="bg-[#111318]">Terlama</option>
          </select>
        </div>
      </div>
    </div>
  );
}
