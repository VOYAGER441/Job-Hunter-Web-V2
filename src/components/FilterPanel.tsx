"use client";

import React from "react";
import { IJobSearchParams } from "@/interface/request/jobs.request";
import { Search, X, Loader2 } from "lucide-react";

interface FilterPanelProps {
  params: IJobSearchParams;
  onChange: (params: IJobSearchParams) => void;
  onSearch: () => void;
  onReset: () => void;
  searching?: boolean;
}

export default function FilterPanel({ params, onChange, onSearch, onReset, searching }: FilterPanelProps) {
  const update = (key: keyof IJobSearchParams, value: string | number | undefined) => {
    onChange({ ...params, [key]: value || undefined });
  };

  const hasFilters = Object.values(params).some(v => v !== undefined && v !== "");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="bg-[#141416] border border-neutral-800/60 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
          <Search className="w-4 h-4" /> Filters
        </h3>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" onKeyDown={handleKeyDown}>
        <input
          placeholder="Keyword"
          value={params.keyword ?? ""}
          onChange={e => update("keyword", e.target.value)}
          className="px-3 py-2 text-sm bg-[#1C1C1F] border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        <input
          placeholder="Category"
          value={params.category ?? ""}
          onChange={e => update("category", e.target.value)}
          className="px-3 py-2 text-sm bg-[#1C1C1F] border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        <input
          placeholder="Location"
          value={params.location ?? ""}
          onChange={e => update("location", e.target.value)}
          className="px-3 py-2 text-sm bg-[#1C1C1F] border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        <input
          placeholder="Company"
          value={params.company ?? ""}
          onChange={e => update("company", e.target.value)}
          className="px-3 py-2 text-sm bg-[#1C1C1F] border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        <input
          placeholder="Level (e.g. Mid Level)"
          value={params.level ?? ""}
          onChange={e => update("level", e.target.value)}
          className="px-3 py-2 text-sm bg-[#1C1C1F] border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        <input
          placeholder="Tags"
          value={params.tags ?? ""}
          onChange={e => update("tags", e.target.value)}
          className="px-3 py-2 text-sm bg-[#1C1C1F] border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        <select
          value={params.sort ?? ""}
          onChange={e => update("sort", e.target.value || undefined)}
          className="px-3 py-2 text-sm bg-[#1C1C1F] border border-neutral-800 rounded-lg text-neutral-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
        >
          <option value="">Sort by</option>
          <option value="newest">Newest</option>
          <option value="relevance">Relevance</option>
        </select>
      </div>

      <button
        onClick={onSearch}
        disabled={searching}
        className="mt-4 w-full py-2.5 text-sm rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white flex items-center justify-center gap-2 transition-colors"
      >
        {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        {searching ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
