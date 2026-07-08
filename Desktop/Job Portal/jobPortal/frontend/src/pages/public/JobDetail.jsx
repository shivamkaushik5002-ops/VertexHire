import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { jobApi, candidateApi } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { FullPageLoader } from "../../components/Loaders";
import { Badge } from "../../components/ui";
import Button from "../../components/Button";
import { MapPin, Building2, IndianRupee, ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export default function JobDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const { push }     = useToast();
  const [job,        setJob]        = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [applying,   setApplying]   = useState(false);
  const [applied,    setApplied]    = useState(false);

  useEffect(() => {
    let alive = true;
    jobApi.byId(id)
      .then(({ data }) => alive && setJob(data))
      .catch(() => push("Could not load this role.", "error"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate("/login", { state: { from: `/jobs/${id}` } }); return; }
    if (user.role !== "CANDIDATE") { push("Only candidate accounts can apply.", "error"); return; }
    setApplying(true);
    try {
      await candidateApi.apply(id);
      setApplied(true);
      push("Application submitted successfully.", "success");
    } catch (e) {
      push(e?.response?.data?.message || "Could not submit application.", "error");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <FullPageLoader />;
  if (!job)    return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center text-sm text-muted">
      Role not found. <Link to="/jobs" className="text-gold hover:underline">Browse all roles</Link>
    </div>
  );

  const initials = job.company?.split(" ").slice(0,2).map((w) => w[0]).join("").toUpperCase() || "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className="mx-auto max-w-4xl px-6 py-12"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
      >
        <ArrowLeft size={15} strokeWidth={1.75} /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-7">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="card-surface p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy-bg text-navy text-base font-bold">
                {initials}
              </div>
              <div>
                <h1 className="font-display text-2xl text-ink leading-snug">{job.title}</h1>
                <p className="flex items-center gap-1.5 text-sm text-teal mt-1">
                  <Building2 size={13} strokeWidth={1.75} />
                  {job.company}
                </p>
              </div>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
              {job.location && (
                <Badge tone="muted">
                  <MapPin size={10} strokeWidth={1.75} />
                  {job.location}
                </Badge>
              )}
              {job.salary != null && (
                <Badge tone="gold">
                  <IndianRupee size={10} strokeWidth={1.75} />
                  {Number(job.salary).toLocaleString("en-IN")} / year
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-4">About the role</p>
              <div className="prose prose-sm max-w-none">
                <p className="text-[15px] leading-[1.75] text-ink-2 whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:col-span-1">
          <div className="card-surface p-6 sticky top-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-5">Apply</p>

            {applied ? (
              <div className="flex flex-col items-center py-6 text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-bg">
                  <CheckCircle2 size={22} className="text-emerald" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink mb-0.5">Applied!</p>
                  <p className="text-xs text-muted">You'll hear back soon.</p>
                </div>
                <Link to="/candidate/applications" className="text-xs text-gold hover:underline underline-offset-4 mt-2">
                  Track application →
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted mb-5 leading-relaxed">
                  Ready to take the next step? Apply now and a recruiter will review your profile.
                </p>
                <Button
                  onClick={handleApply}
                  loading={applying}
                  icon={Send}
                  size="lg"
                  className="w-full"
                >
                  Apply for this role
                </Button>
                {!user && (
                  <p className="mt-3 text-center text-xs text-muted">
                    <Link to="/login" className="text-gold hover:underline">Sign in</Link> to apply
                  </p>
                )}
              </>
            )}

            {/* Quick facts */}
            {(job.location || job.salary) && (
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                {job.location && (
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <MapPin size={13} strokeWidth={1.75} className="text-muted-2 shrink-0" />
                    {job.location}
                  </div>
                )}
                {job.salary != null && (
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <IndianRupee size={13} strokeWidth={1.75} className="text-gold shrink-0" />
                    ₹{Number(job.salary).toLocaleString("en-IN")} per year
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
