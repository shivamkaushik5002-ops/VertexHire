import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { candidateApi } from "../../api/endpoints";
import { useToast } from "../../components/Toast";
import { FullPageLoader } from "../../components/Loaders";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import { Badge } from "../../components/ui";
import { LayoutDashboard, FileStack, Building2, CalendarDays, ArrowRight, Search } from "lucide-react";

const navItems = [
  { to: "/candidate/dashboard",    label: "Overview",     icon: LayoutDashboard, end: true },
  { to: "/candidate/applications", label: "Applications", icon: FileStack },
];

const statusTone = {
  APPLIED:     "muted",
  PENDING:     "muted",
  REVIEWED:    "teal",
  SHORTLISTED: "teal",
  ACCEPTED:    "green",
  HIRED:       "green",
  REJECTED:    "red",
};

const statusStep = {
  APPLIED: 1, PENDING: 1, REVIEWED: 2, SHORTLISTED: 3, ACCEPTED: 4, HIRED: 4, REJECTED: 0,
};

export default function MyApplications() {
  const { push } = useToast();
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("ALL");

  useEffect(() => {
    candidateApi.myApplications()
      .then(({ data }) => setApps(data || []))
      .catch(() => push("Could not load applications.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const tabs = ["ALL", "PENDING", "REVIEWED", "ACCEPTED", "REJECTED"];
  const visible = filter === "ALL" ? apps : apps.filter((a) => {
    if (filter === "PENDING")  return ["APPLIED", "PENDING"].includes(a.status);
    if (filter === "REVIEWED") return ["REVIEWED", "SHORTLISTED"].includes(a.status);
    return a.status === filter;
  });

  if (loading) return <FullPageLoader />;

  return (
    <DashboardLayout navItems={navItems}>
      <PageTransition>
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-1">Candidate</p>
          <h1 className="font-display text-3xl text-ink">Your Applications</h1>
          <p className="text-sm text-muted mt-1">{apps.length} total · track every step.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all duration-200
                ${filter === tab
                  ? "bg-navy text-white shadow-[0_1px_3px_rgba(13,22,38,0.25),0_4px_12px_rgba(13,22,38,0.12)]"
                  : "bg-white border border-border text-muted hover:text-ink hover:border-border-d"}`}
            >
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="card-surface py-20 text-center">
            <Search size={32} strokeWidth={1.25} className="mx-auto text-muted-2 mb-4" />
            <p className="text-sm text-muted mb-4">
              {apps.length === 0 ? "You haven't applied to any roles yet." : "No applications match this filter."}
            </p>
            {apps.length === 0 && (
              <Link to="/jobs">
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white">
                  Browse roles <ArrowRight size={14} strokeWidth={2} />
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.05 }}
                className="card-surface p-5 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Step indicator */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold
                        ${app.status === "REJECTED" ? "bg-rose-bg text-rose"
                          : app.status === "ACCEPTED" || app.status === "HIRED" ? "bg-emerald-bg text-emerald"
                          : "bg-navy-bg text-navy"}`}
                    >
                      {(app.job?.company ?? "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-display text-[15px] text-ink">{app.job?.title}</p>
                      <p className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
                        <Building2 size={11} strokeWidth={1.75} />
                        {app.job?.company}
                        <span className="mx-0.5">·</span>
                        <CalendarDays size={11} strokeWidth={1.75} />
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-[52px] sm:pl-0">
                    <Badge tone={statusTone[app.status] || "muted"}>{app.status}</Badge>
                    <Link
                      to={`/jobs/${app.job?.id}`}
                      className="text-[11px] text-muted hover:text-gold transition-colors flex items-center gap-0.5"
                    >
                      View role <ArrowRight size={11} strokeWidth={2} />
                    </Link>
                  </div>
                </div>

                {/* Progress bar */}
                {app.status !== "REJECTED" && (
                  <div className="mt-4 pl-[52px] sm:pl-0">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 rounded-full transition-all duration-500 ${
                            step <= (statusStep[app.status] || 0) ? "bg-gold" : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      {["Applied", "Reviewed", "Shortlisted", "Outcome"].map((label, idx) => (
                        <span key={label} className="text-[9.5px] text-muted-2">{label}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </PageTransition>
    </DashboardLayout>
  );
}
