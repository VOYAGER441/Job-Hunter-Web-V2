"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { INormalizedJob } from "@/interface/response/job.response";
import { IJobSearchParams } from "@/interface/request/jobs.request";
import { MapPin, Calendar, ExternalLink, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import JobsService from "@/service/jobs.service";
import FilterPanel from "./FilterPanel";

interface JobCardsProps {
  jobs?: INormalizedJob[];
}

const defaultFilters: IJobSearchParams = {};

function paramsFromSearch(qs: string): IJobSearchParams {
  const sp = new URLSearchParams(qs);
  const p: IJobSearchParams = {};
  const keyword = sp.get("keyword");
  const category = sp.get("category");
  const location = sp.get("location");
  const company = sp.get("company");
  const level = sp.get("level");
  const tags = sp.get("tags");
  const sort = sp.get("sort");
  const page = sp.get("page");
  if (keyword) p.keyword = keyword;
  if (category) p.category = category;
  if (location) p.location = location;
  if (company) p.company = company;
  if (level) p.level = level;
  if (tags) p.tags = tags;
  if (sort === "newest" || sort === "relevance") p.sort = sort;
  if (page) p.page = Number(page);
  return p;
}

function paramsToUrl(params: IJobSearchParams): string {
  const sp = new URLSearchParams();
  if (params.keyword) sp.set("keyword", params.keyword);
  if (params.category) sp.set("category", params.category);
  if (params.location) sp.set("location", params.location);
  if (params.company) sp.set("company", params.company);
  if (params.level) sp.set("level", params.level);
  if (params.tags) sp.set("tags", params.tags);
  if (params.sort) sp.set("sort", params.sort);
  if (params.page) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function getLocationSearch(): string {
  if (typeof window === "undefined") return "";
  return window.location.search;
}

const PAGE_SIZE = 10;

export default function JobCards({ jobs: _jobs }: JobCardsProps) {
  const router = useRouter();
  const [active, setActive] = useState<INormalizedJob | null>(null);
  const [allJobs, setAllJobs] = useState<INormalizedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterParams, setFilterParams] = useState<IJobSearchParams>(() => paramsFromSearch(getLocationSearch()));
  const [currentPage, setCurrentPage] = useState(() => paramsFromSearch(getLocationSearch()).page || 1);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const activeParamsRef = useRef<IJobSearchParams>({});

  const totalResults = allJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const displayJobs = allJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // Initial load — fetch all jobs (backend returns all matching results)
  useEffect(() => {
    const urlParams = paramsFromSearch(getLocationSearch());
    setFilterParams(urlParams);
    activeParamsRef.current = urlParams;
    setCurrentPage(urlParams.page || 1);

    const fetch = async () => {
      try {
        setLoading(true);
        const { page: _p, ...apiParams } = urlParams;
        const res = await JobsService.searchJobs(apiParams);
        setAllJobs(res.data ?? []);
        if (Object.values(urlParams).some(v => v !== undefined && v !== "")) {
          setHasSearched(true);
        }
      } catch {
        // toast already shown
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useOutsideClick(ref, () => setActive(null));

  const doSearch = useCallback(async (params: IJobSearchParams) => {
    const { page: _p, ...rest } = params;
    const urlParams = { ...params, page: 1 };
    const qs = paramsToUrl(urlParams);
    router.replace(qs, { scroll: false });
    activeParamsRef.current = urlParams;
    try {
      setSearching(true);
      const res = await JobsService.searchJobs(rest);
      setAllJobs(res.data ?? []);
      setCurrentPage(1);
      setHasSearched(true);
    } catch {
      // toast already shown inside service
    } finally {
      setSearching(false);
    }
  }, [router]);

  const goToPage = useCallback((page: number) => {
    const updated = { ...activeParamsRef.current, page };
    activeParamsRef.current = updated;
    const qs = paramsToUrl(updated);
    router.replace(qs, { scroll: false });
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [router]);

  const handleSearch = useCallback(() => {
    clearTimeout(debounceRef.current);
    doSearch(filterParams);
  }, [filterParams, doSearch]);

  const handleReset = useCallback(() => {
    clearTimeout(debounceRef.current);
    router.replace("", { scroll: false });
    setFilterParams(defaultFilters);
    activeParamsRef.current = {};
    const fetch = async () => {
      try {
        setSearching(true);
        const res = await JobsService.searchJobs({});
        setAllJobs(res.data ?? []);
        setCurrentPage(1);
        setHasSearched(false);
      } catch {
        // toast already shown
      } finally {
        setSearching(false);
      }
    };
    fetch();
  }, [router]);

  // Debounced search ref so filter changes auto-search without extra requests
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const handleFilterChange = useCallback((params: IJobSearchParams) => {
    setFilterParams(params);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(params);
    }, 400);
  }, [doSearch]);

  return (
    <>
      <style>{`
        .job-description-content p {
          margin-bottom: 1rem;
        }
        .job-description-content ul, .job-description-content ol {
          margin-bottom: 1rem;
          padding-left: 1.25rem;
        }
        .job-description-content ul {
          list-style-type: disc;
        }
        .job-description-content ol {
          list-style-type: decimal;
        }
        .job-description-content li {
          margin-bottom: 0.5rem;
        }
        .job-description-content strong, .job-description-content b {
          color: #FAFAFA;
          font-weight: 600;
        }
        .job-description-content h1, .job-description-content h2, .job-description-content h3, .job-description-content h4 {
          color: #FAFAFA;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .job-description-content a {
          color: #6366F1;
          text-decoration: underline;
        }
      `}</style>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-50"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-3 sm:p-4 overflow-y-auto">
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full max-w-[700px] h-[90vh] md:h-fit md:max-h-[85vh] flex flex-col bg-[#141416] border border-neutral-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="relative shrink-0">
                {/* Banner Gradient */}
                <div className={`h-24 md:h-28 w-full bg-gradient-to-r ${getCompanyLogoColor(active.company)} opacity-75`} />
                
                {/* Close Button */}
                <motion.button
                  key={`close-${active.id}-${id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 right-4 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full h-9 w-9 text-white transition-colors border border-neutral-700/50"
                  onClick={() => setActive(null)}
                >
                  <CloseIcon />
                </motion.button>

                {/* Overlapping Brand Initial Logo */}
                <div className="absolute -bottom-6 left-4 md:-bottom-8 md:left-6">
                  <motion.div
                    layoutId={`logo-${active.id}-${id}`}
                    className={`h-16 w-16 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-gradient-to-tr ${getCompanyLogoColor(active.company)} flex items-center justify-center text-white font-extrabold text-xl md:text-2xl shadow-xl border-4 border-[#141416]`}
                  >
                    {getCompanyInitials(active.company)}
                  </motion.div>
                </div>
              </div>

              <div className="pt-8 px-4 pb-4 md:pt-10 md:px-6 md:pb-6 flex flex-col gap-4 flex-1 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <motion.h3
                      layoutId={`title-${active.id}-${id}`}
                      className="text-xl md:text-2xl font-extrabold text-[#FAFAFA] leading-tight"
                    >
                      {active.title}
                    </motion.h3>
                    
                    <motion.div
                      layoutId={`meta-${active.id}-${id}`}
                      className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs md:text-sm text-[#A1A1AA]"
                    >
                      <span className="font-semibold text-indigo-400 flex items-center gap-1">
                        <Building2 className="w-4 h-4 shrink-0" /> {active.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 shrink-0" /> {active.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 shrink-0" /> {formatDate(active.publishedAt)}
                      </span>
                    </motion.div>
                  </div>

                  <motion.a
                    layoutId={`button-${active.id}-${id}`}
                    href={active.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto px-5 py-2.5 text-sm rounded-full font-bold bg-[#6366F1] hover:bg-[#818CF8] text-white flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </motion.a>
                </div>

                {/* Tags */}
                {active.tags && active.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {active.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#1C1C1F] text-indigo-300 border border-neutral-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="border-t border-neutral-800/80 my-1" />

                {/* Scrollable Description */}
                <div className="flex-1 overflow-y-auto pr-1">
                  <div 
                    className="job-description-content text-neutral-300 text-sm leading-relaxed pb-6"
                    dangerouslySetInnerHTML={{ __html: active.description }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className=" mx-auto w-full flex flex-col gap-4">
        <FilterPanel
          params={filterParams}
          onChange={handleFilterChange}
          onSearch={handleSearch}
          onReset={handleReset}
          searching={searching}
        />

        {!loading && !searching && totalResults > 0 && (
          <p className="text-xs text-neutral-500 px-1">
            Page {currentPage} of {totalPages} &middot; {totalResults} job{totalResults === 1 ? "" : "s"}
            {hasSearched ? " found" : " loaded"}
          </p>
        )}
      </div>

      {loading || (searching && allJobs.length === 0) ? (
        <div className=" mx-auto w-full flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#141416]/90 border border-neutral-800/60 rounded-2xl animate-pulse"
            >
              <div className="flex gap-4 flex-col md:flex-row items-start md:items-center w-full md:w-auto">
                <div className="h-14 w-14 rounded-xl bg-neutral-800 shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="h-5 w-48 bg-neutral-800 rounded" />
                  <div className="h-4 w-32 bg-neutral-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className=" mx-auto w-full flex flex-col gap-4">
          {displayJobs.map((card) => (
          <motion.div
            layoutId={`card-${card.id}-${id}`}
            key={`card-${card.id}-${id}`}
            onClick={() => setActive(card)}
            className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#141416]/90 hover:bg-[#1C1C1F]/90 border border-neutral-800/60 hover:border-neutral-700/80 rounded-2xl cursor-pointer transition-all duration-200 group shadow-lg"
          >
            <div className="flex gap-4 flex-col md:flex-row items-start md:items-center w-full md:flex-1 md:min-w-0">
              <motion.div
                layoutId={`logo-${card.id}-${id}`}
                className={`h-14 w-14 rounded-xl bg-gradient-to-tr ${getCompanyLogoColor(card.company)} flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-md`}
              >
                {getCompanyInitials(card.company)}
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <motion.h3
                  layoutId={`title-${card.id}-${id}`}
                  className="font-bold text-neutral-100 group-hover:text-[#FAFAFA] text-lg leading-snug truncate"
                >
                  {card.title}
                </motion.h3>
                
                <motion.div
                  layoutId={`meta-${card.id}-${id}`}
                  className="text-sm text-[#A1A1AA] flex flex-wrap items-center gap-x-3 gap-y-1 mt-1"
                >
                  <span className="font-medium text-neutral-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 shrink-0" /> {card.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {card.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#52525B]">
                    <Calendar className="w-3.5 h-3.5 shrink-0" /> {formatDate(card.publishedAt)}
                  </span>
                </motion.div>

                {/* Source badge and tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300 tracking-wider">
                    {card.source}
                  </span>
                  {card.tags && card.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1C1C1F] text-indigo-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 w-full md:w-auto flex justify-end shrink-0">
              <motion.button
                layoutId={`button-${card.id}-${id}`}
                className="w-full md:w-auto px-5 py-2 text-sm rounded-full font-bold bg-[#1C1C1F] hover:bg-[#6366F1] text-neutral-300 hover:text-white border border-neutral-800 hover:border-transparent transition-all duration-200 shadow-sm"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
        </ul>
      )}

      {totalPages > 1 && !searching && (
        <div className="max-w-4xl mx-auto w-full flex items-center justify-center gap-1 sm:gap-3 mt-4 pb-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium bg-[#1C1C1F] border border-neutral-800 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-500/50 transition-colors"
          >
            <span className="sm:hidden">&larr;</span>
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {(() => {
              const maxVisible = totalPages <= 7 ? totalPages : 7;
              let start = Math.max(1, currentPage - 3);
              if (start + maxVisible - 1 > totalPages) start = totalPages - maxVisible + 1;
              const pages: number[] = [];
              for (let i = 0; i < maxVisible; i++) pages.push(start + i);
              return pages.map(p => {
                if (p > totalPages) return null;
                const isActive = p === currentPage;
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 text-[11px] sm:text-xs rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-[#1C1C1F] border border-neutral-800 text-neutral-400 hover:border-indigo-500/50"
                    } ${Math.abs(p - currentPage) > 1 ? "hidden sm:inline-flex" : ""}`}
                  >
                    {p}
                  </button>
                );
              });
            })()}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium bg-[#1C1C1F] border border-neutral-800 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-500/50 transition-colors"
          >
            <span className="sm:hidden">&rarr;</span>
            <span className="hidden sm:inline">Next</span>
          </button>
        </div>
      )}
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </motion.svg>
  );
};

// Helper to assign a specific aesthetic gradient color based on the company name
function getCompanyLogoColor(companyName: string) {
  const gradients = [
    "from-indigo-500 to-purple-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-fuchsia-600",
  ];
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// Helper to extract clean initials from the company name
function getCompanyInitials(companyName: string) {
  const cleanName = companyName.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  const words = cleanName.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return cleanName.slice(0, 2).toUpperCase();
}

// Helper to format ISO published date
function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
