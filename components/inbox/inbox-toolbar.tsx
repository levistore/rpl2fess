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
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "reported", label: "Reported" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-[8px] bg-[#FFFFFF] border-[3px] border-[#111111] shadow-[4px_4px_0_#111111]">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => updateParams({ filter: tab.key })}
              className={`px-3.5 py-1.5 rounded-[4px] font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-[#FFD84D] border-[2px] border-[#111111] shadow-[2px_2px_0_#111111] text-[#111111]"
                  : "bg-transparent text-[#111111]/70 hover:text-[#111111] hover:bg-[#111111]/5"
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
        <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-56">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search confessions..."
            className="w-full h-9 pl-8 pr-3 rounded-[4px] border-[2px] border-[#111111] text-xs font-bold bg-[#F6F3EA] placeholder:text-[#111111]/40 focus:outline-none focus:bg-[#FFFFFF]"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#111111]/50" />
        </form>

        {/* Sort selector */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="h-9 px-2.5 rounded-[4px] border-[2px] border-[#111111] bg-[#FFFFFF] shadow-[1.5px_1.5px_0_#111111] text-xs font-black uppercase tracking-wider text-[#111111] cursor-pointer focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
