import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { recruiterApi } from "../../api/endpoints";
import { useToast } from "../../components/Toast";
import { FullPageLoader } from "../../components/Loaders";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageTransition from "../../components/PageTransition";
import { Badge, Select } from "../../components/ui";
import Button from "../../components/Button";
import { LayoutDashboard, Briefcase, ArrowLeft, Download, Mail, Users } from "lucide-react";

const navItems = [
  { to: "/recruiter/dashboard", label: "Overview",    icon: LayoutDashboard, end: true },
  { to: "/recruiter/jobs",      label: "My Listings", icon: Briefcase },
];

const STATUSES = ["APPLIED","PENDING","REVIEWED","SHORTLISTED","ACCEPTED","REJECTED","HIRED"];

const statusTone = {
  APPLIED:     "muted",
  PENDING:     "muted",
  REVIEWED:    "teal",
  SHORTLISTED: "teal",
  ACCEPTED:    "green",
  HIRED:       "green",
  REJECTED:    "red",
};

const avatarColors = [
  "bg-navy-bg text-navy",
  "bg-gold-bg text-gold",
  "bg-teal-bg text-teal-2",
  "bg-emerald-bg text-emerald",
];

export default function JobApplications() {
  const { jobId }    = useParams();
  const { push }     = useToast();
  const [apps,       setApps]     = useState([]);
  const [loading,    setLoading]  = useState(true);
  const [updating,   setUpdating] = useState(null);

  useEffect(() => {
    recruiterApi.applicationsForJob(jobId)
      .then(({ data }) => setApps(data || []))
      .catch(() => push("Could not load applicants.", "error"))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleStatus = async (applicationId, status) => {
    setUpdating(applicationId);
    try {
      await recruiterApi.updateStatus(applicationId, status);
      setApps((a) => a.map((x) => x.applicationId === applicationId ? { ...x, status } : x));
      push("Status updated.", "success");
    } catch {
      push("Could not update status.", "error");
    } finally {
      setUpdating(null);
    }
  };

  const handleDownload = async (candidateId, name) => {
    try {
      const { data } = await recruiterApi.downloadResume(candidateId);
      const url = window.URL.createObjectURL(new Blob([data]));
      const a   = document.createElement("a");
      a.href     = url;
      a.download = `${name || "resume"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      push("Resume not available for this candidate.", "error");
    }
  };

  if (loading) return <FullPageLoader />;

  const jobTitle = apps[0]?.jobTitle || "Applications";

  return (
    <DashboardLayout navItems={navItems}>
      <PageTransition>
        {/* Back */}
        <Link
          to="/recruiter/jobs"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={1.75} /> Back to listings
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-1">Applicants</p>
          <h1 className="font-display text-3xl text-ink">{jobTitle}</h1>
          <p className="text-sm text-muted mt-1">
            {apps.length} application{apps.length !== 1 ? "s" : ""} received.
          </p>
        </div>

        {/* Empty */}
        {apps.length === 0 ? (
          <div className="card-surface py-24 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-bg mb-4">
              <Users size={24} strokeWidth={1.5} className="text-navy" />
            </div>
            <p className="font-display text-lg text-ink mb-1">No applicants yet</p>
            <p className="text-sm text-muted">
              Share the listing to start receiving applications.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app, i) => {
              const color = avatarColors[(app.candidateId || i) % avatarColors.length];
              const initials = (app.candidateName ?? "?")
                .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

              return (
                <motion.div
                  key={app.applicationId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.05 }}
                  className="card-surface p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Candidate info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${color}`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-[15px] text-ink truncate">{app.candidateName}</p>
                        <p className="flex items-center gap-1 text-xs text-muted mt-0.5 truncate">
                          <Mail size={11} strokeWidth={1.75} className="shrink-0" />
                          {app.candidateEmail}
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-2.5 pl-14 sm:pl-0 shrink-0">
                      <Badge tone={statusTone[app.status] || "muted"}>{app.status}</Badge>

                      {app.resumeUploaded && (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={Download}
                          onClick={() => handleDownload(app.candidateId, app.candidateName)}
                        >
                          Resume
                        </Button>
                      )}

                      {/* Inline status dropdown */}
                      <div className="relative">
                        <select
                          value={app.status}
                          disabled={updating === app.applicationId}
                          onChange={(e) => handleStatus(app.applicationId, e.target.value)}
                          className="appearance-none rounded-xl border border-border bg-white pl-3 pr-7 py-2 text-xs text-ink
                            outline-none transition-all duration-200 shadow-card hover:border-border-d
                            focus:border-navy focus:shadow-input disabled:opacity-60"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="#78726B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        {updating === app.applicationId && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70">
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-border border-t-gold" style={{ animation: "spin 0.7s linear infinite" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </PageTransition>
    </DashboardLayout>
  );
}
