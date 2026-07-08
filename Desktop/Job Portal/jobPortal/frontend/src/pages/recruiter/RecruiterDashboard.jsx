import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { recruiterApi } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { FullPageLoader } from "../../components/Loaders";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import Button from "../../components/Button";
import PageTransition from "../../components/PageTransition";
import {
  LayoutDashboard, Briefcase, FileStack,
  Plus, Clock, CheckCircle2, XCircle, ArrowRight, Layers,
} from "lucide-react";

const navItems = [
  { to: "/recruiter/dashboard", label: "Overview",    icon: LayoutDashboard, end: true },
  { to: "/recruiter/jobs",      label: "My Listings", icon: Briefcase },
];

export default function RecruiterDashboard() {
  const { user }   = useAuth();
  const { push }   = useToast();
  const [stats,    setStats]   = useState(null);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    recruiterApi.dashboard()
      .then(({ data }) => setStats(data))
      .catch(() => push("Could not load dashboard.", "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageLoader />;

  return (
    <DashboardLayout navItems={navItems}>
      <PageTransition>
        {/* Greeting */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-1">Recruiter</p>
            <h1 className="font-display text-3xl text-ink">
              Welcome, {user?.name?.split(" ")[0]}.
            </h1>
            <p className="text-sm text-muted mt-1">Manage your listings and review applicants.</p>
          </div>
          <Link to="/recruiter/jobs">
            <Button icon={Plus} size="sm">New listing</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Active jobs"   value={stats?.totalJobs           ?? 0} icon={Briefcase}    tone="navy"    index={0} />
          <StatCard label="Applications"  value={stats?.totalApplications   ?? 0} icon={Layers}       tone="gold"    index={1} />
          <StatCard label="Pending"       value={stats?.pendingApplications  ?? 0} icon={Clock}        tone="gold"    index={2} />
          <StatCard label="Accepted"      value={stats?.acceptedApplications ?? 0} icon={CheckCircle2} tone="emerald" index={3} />
          <StatCard label="Rejected"      value={stats?.rejectedApplications ?? 0} icon={XCircle}      tone="rose"    index={4} />
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="card-surface p-6"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-bg">
                <Briefcase size={18} strokeWidth={1.75} className="text-navy" />
              </div>
              <div>
                <h3 className="font-display text-base text-ink">Your listings</h3>
                <p className="text-xs text-muted mt-0.5">
                  {stats?.totalJobs
                    ? `${stats.totalJobs} active role${stats.totalJobs !== 1 ? "s" : ""} posted.`
                    : "No listings posted yet."}
                </p>
              </div>
            </div>
            <Link to="/recruiter/jobs">
              <Button variant="secondary" icon={ArrowRight} size="sm">Manage listings</Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.42, ease: [0.25, 0.1, 0.25, 1] }}
            className="card-surface p-6 bg-navy border-navy/10"
          >
            <h3 className="font-display text-base text-white mb-1">Post a new role</h3>
            <p className="text-xs text-white/60 mb-5 leading-relaxed">
              Reach thousands of curated candidates. Takes under two minutes.
            </p>
            <Link to="/recruiter/jobs">
              <Button variant="gold" icon={Plus} size="sm">Post listing</Button>
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}
