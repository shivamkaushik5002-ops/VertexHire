import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { candidateApi } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { FullPageLoader } from "../../components/Loaders";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import Button from "../../components/Button";
import PageTransition from "../../components/PageTransition";
import {
  LayoutDashboard, FileStack, UploadCloud,
  FileText, ArrowRight, CheckCircle2, Clock, XCircle, Layers,
} from "lucide-react";

const navItems = [
  { to: "/candidate/dashboard",    label: "Overview",     icon: LayoutDashboard, end: true },
  { to: "/candidate/applications", label: "Applications", icon: FileStack                   },
];

export default function CandidateDashboard() {
  const { user }   = useAuth();
  const { push }   = useToast();
  const fileInput  = useRef(null);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [uploading,setUploading]= useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    candidateApi.dashboard()
      .then(({ data }) => setStats(data))
      .catch(() => push("Could not load dashboard.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    try {
      await candidateApi.uploadResume(file);
      push("Resume uploaded successfully.", "success");
    } catch {
      push("Resume upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <DashboardLayout navItems={navItems}>
      <PageTransition>
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-1">Candidate</p>
          <h1 className="font-display text-3xl text-ink">
            Good to see you, {user?.name?.split(" ")[0]}.
          </h1>
          <p className="text-sm text-muted mt-1">Here's a snapshot of your job search.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total applied"   value={stats?.totalApplications   ?? 0} icon={Layers}       tone="navy"    index={0} />
          <StatCard label="Pending review"  value={stats?.pendingApplications  ?? 0} icon={Clock}        tone="gold"    index={1} />
          <StatCard label="Accepted"        value={stats?.acceptedApplications ?? 0} icon={CheckCircle2} tone="emerald" index={2} />
          <StatCard label="Rejected"        value={stats?.rejectedApplications ?? 0} icon={XCircle}      tone="rose"    index={3} />
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Resume card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="card-surface p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-bg">
                <FileText size={18} strokeWidth={1.75} className="text-gold" />
              </div>
              <div>
                <h3 className="font-display text-base text-ink">Your resume</h3>
                <p className="text-xs text-muted mt-0.5">Recruiters access this directly from your applications.</p>
              </div>
            </div>

            <input ref={fileInput} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                icon={UploadCloud}
                loading={uploading}
                size="sm"
                onClick={() => fileInput.current?.click()}
              >
                {fileName ? "Replace resume" : "Upload resume"}
              </Button>
              {fileName && (
                <span className="text-[11px] text-muted flex items-center gap-1.5 truncate">
                  <FileText size={12} className="text-gold shrink-0" />
                  {fileName}
                </span>
              )}
            </div>
          </motion.div>

          {/* Browse more */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
            className="card-surface p-6 bg-navy border-navy/10"
          >
            <h3 className="font-display text-base text-white mb-1">Find your next role</h3>
            <p className="text-xs text-white/60 mb-5">New opportunities added daily from verified employers.</p>
            <Link to="/jobs">
              <Button variant="gold" icon={ArrowRight} size="sm">Browse roles</Button>
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}
