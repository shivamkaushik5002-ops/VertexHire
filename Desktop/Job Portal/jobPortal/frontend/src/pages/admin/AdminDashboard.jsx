import { motion } from "framer-motion";
import PageTransition from "../../components/PageTransition";
import { ShieldCheck, Users, Briefcase, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-2">Admin</p>
          <h1 className="font-display text-4xl text-ink mb-2">Platform Console</h1>
          <p className="text-sm text-muted">Oversight and management tools for VertexHire.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Users,       label: "User management",  desc: "Manage candidate and recruiter accounts, verify identities, and handle disputes.", tone: "bg-navy-bg border-navy/15 text-navy" },
            { icon: Briefcase,   label: "Job moderation",   desc: "Review flagged listings, enforce quality standards, and remove policy violations.",  tone: "bg-gold-bg border-gold-border text-gold" },
            { icon: BarChart3,   label: "Analytics",        desc: "Platform-wide metrics — applications, placements, engagement, and growth trends.",    tone: "bg-teal-bg border-teal/20 text-teal" },
          ].map(({ icon: Icon, label, desc, tone }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.08 }}
              className={`rounded-2xl border p-6 ${tone}`}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 shadow-card">
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-[15px] mb-2">{label}</h3>
              <p className="text-xs leading-relaxed opacity-70">{desc}</p>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider opacity-50">
                Coming soon
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-5 rounded-2xl border border-border bg-white p-7 flex items-center gap-5 shadow-card"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-bg">
            <ShieldCheck size={22} strokeWidth={1.5} className="text-navy" />
          </div>
          <div>
            <p className="font-display text-base text-ink">Admin access confirmed</p>
            <p className="text-xs text-muted mt-0.5">
              You have elevated privileges. Full admin tooling ships in the next release.
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
