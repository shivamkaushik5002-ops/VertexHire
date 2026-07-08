import { useEffect, useState } from "react";
import { jobApi } from "../../api/endpoints";
import JobCard from "../../components/JobCard";
import { SkeletonCard } from "../../components/Loaders";
import PageTransition from "../../components/PageTransition";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { value: "id",       label: "Newest first" },
  { value: "title",    label: "Title A–Z"    },
  { value: "salary",   label: "Highest salary" },
  { value: "location", label: "Location"     },
];

export default function JobList() {
  const [jobs,       setJobs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy,     setSortBy]     = useState("id");
  const [query,      setQuery]      = useState("");
  const [searching,  setSearching]  = useState(false);
  const [isSearch,   setIsSearch]   = useState(false);

  const loadJobs = async (p, sb) => {
    setLoading(true);
    try {
      const { data } = await jobApi.list(p, 9, sb);
      setJobs(data.content || []);
      setTotalPages(data.totalPages ?? 1);
      setIsSearch(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(0, sortBy); setPage(0); }, [sortBy]);
  useEffect(() => { if (!isSearch) loadJobs(page, sortBy); }, [page]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) { loadJobs(0, sortBy); setPage(0); return; }
    setSearching(true);
    try {
      const { data } = await jobApi.search(query.trim());
      setJobs(data || []);
      setTotalPages(1);
      setPage(0);
      setIsSearch(true);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => { setQuery(""); loadJobs(0, sortBy); setPage(0); };

  const busy = loading || searching;

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Page header */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-2">Explore</p>
          <h1 className="font-display text-4xl text-ink mb-2">All opportunities</h1>
          <p className="text-sm text-muted">
            {isSearch ? `Showing results for "${query}"` : "Curated roles, updated daily."}
          </p>
        </div>

        <div className="flex gap-7">
          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="card-surface p-5 sticky top-20">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-4">Sort by</p>
              <div className="flex flex-col gap-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setPage(0); }}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200
                      ${sortBy === opt.value
                        ? "bg-navy text-white font-medium"
                        : "text-muted hover:text-ink hover:bg-cream"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={15}
                  strokeWidth={1.75}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-2 pointer-events-none"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title, skill, location…"
                  className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm text-ink
                    placeholder:text-muted-2 outline-none transition-all duration-200
                    focus:border-navy focus:shadow-input shadow-card"
                />
                {query && (
                  <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-2 hover:text-muted transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={searching}
                className="rounded-xl bg-navy px-5 text-sm font-medium text-white shadow-[0_1px_3px_rgba(13,22,38,0.25),0_4px_12px_rgba(13,22,38,0.12)]
                  hover:bg-navy-2 active:scale-[0.97] transition-all duration-200 disabled:opacity-60"
              >
                {searching ? "…" : "Search"}
              </button>

              {/* Mobile sort */}
              <div className="lg:hidden">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-border bg-white px-3 py-3 text-sm text-muted outline-none shadow-card focus:border-navy"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </form>

            {/* Results */}
            {busy ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="card-surface py-20 text-center">
                <Search size={32} strokeWidth={1.25} className="mx-auto text-muted-2 mb-4" />
                <p className="text-sm text-muted mb-2">No roles match.</p>
                {isSearch && (
                  <button onClick={clearSearch} className="text-sm text-gold hover:underline underline-offset-4">
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {jobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !isSearch && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-muted
                    shadow-card hover:border-border-d hover:text-ink transition-all disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft size={15} /> Prev
                </button>
                <span className="text-xs text-muted">
                  <span className="font-medium text-ink">{page + 1}</span> / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-muted
                    shadow-card hover:border-border-d hover:text-ink transition-all disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
