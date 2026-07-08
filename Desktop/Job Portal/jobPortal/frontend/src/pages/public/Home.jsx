import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { jobApi } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowRight, ShieldCheck, Sparkles, TrendingUp,
  MapPin, Building2, IndianRupee, ArrowUpRight
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    jobApi.list(0, 3).then(({ data }) => setFeatured(data.content || [])).catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[88vh] flex flex-col justify-center bg-cream">
        {/* decorative gold arc */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-[680px] w-[680px] translate-x-1/3 -translate-y-1/4 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #A87820 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute left-0 bottom-0 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/4 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #0D1626 0%, transparent 70%)" }}
        />

        <div className="mx-auto max-w-6xl px-6 py-24 relative">
          <div className="max-w-3xl">
            <motion.div {...fadeUp(0)} className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-gold-border bg-gold-bg px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                Premier career platform
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[1.03] tracking-[-0.02em] text-ink mb-6"
            >
              Work that
              <br />
              <em className="not-italic text-gold-gradient">defines you.</em>
            </motion.h1>

            <motion.p {...fadeUp(0.17)} className="max-w-lg text-[1.0625rem] leading-relaxed text-muted mb-10">
              VertexHire connects discerning talent with employers who value precision over volume.
              Every listing curated. Every match, intentional.
            </motion.p>

            <motion.div {...fadeUp(0.24)} className="flex flex-wrap items-center gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-3.5 text-sm font-semibold text-white
                  shadow-[0_2px_6px_rgba(13,22,38,0.3),0_8px_24px_rgba(13,22,38,0.18)] hover:bg-navy-2 active:scale-[0.97]
                  transition-all duration-200"
              >
                Browse roles <ArrowRight size={15} strokeWidth={2} />
              </Link>
              {!user && (
                <Link
                  to="/register?role=RECRUITER"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-7 py-3.5 text-sm
                    font-medium text-ink-2 shadow-card hover:shadow-card-hover hover:border-border-d
                    active:scale-[0.97] transition-all duration-200"
                >
                  Hire with us
                </Link>
              )}
            </motion.div>

            {/* Stats strip */}
            <motion.div {...fadeUp(0.32)} className="mt-14 flex flex-wrap gap-8">
              {[
                { val: "500+", label: "Active roles" },
                { val: "200+", label: "Employers" },
                { val: "12K+", label: "Candidates placed" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl font-semibold text-ink">{val}</p>
                  <p className="text-xs text-muted mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Featured roles ─── */}
      {featured.length > 0 && (
        <section className="bg-white border-y border-border py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-1.5">
                  Featured
                </p>
                <h2 className="font-display text-2xl text-ink">Roles open now</h2>
              </div>
              <Link to="/jobs" className="hidden sm:flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid sm:grid-cols-3 gap-4"
            >
              {featured.map((job, i) => (
                <FeaturedCard key={job.id} job={job} delay={i * 0.08} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── Value props ─── */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold mb-2">Why VertexHire</p>
            <h2 className="font-display text-3xl text-ink">The difference is in the details.</h2>
          </div>
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-3 gap-6"
          >
            {[
              {
                icon: ShieldCheck,
                title: "Verified employers",
                body: "Every recruiter account is reviewed to keep listings credible and opportunities real.",
                color: "bg-navy-bg text-navy",
              },
              {
                icon: Sparkles,
                title: "Precision matching",
                body: "Your skills and ambitions shape every role you see — no irrelevant noise.",
                color: "bg-gold-bg text-gold",
              },
              {
                icon: TrendingUp,
                title: "Live tracking",
                body: "Follow every application from first review through to offer in real time.",
                color: "bg-teal-bg text-teal",
              },
            ].map(({ icon: Icon, title, body, color }, i) => (
              <motion.div
                key={title}
                variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } } }}
                className="card-surface p-7 group hover:-translate-y-1"
              >
                <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg text-ink mb-2">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-3">Begin your search</p>
            <h2 className="font-display text-4xl text-white mb-5 leading-tight">
              Your next chapter starts<br />
              <em className="not-italic text-gold-gradient">with a single role.</em>
            </h2>
            <p className="text-[15px] text-white/60 mb-9 max-w-md mx-auto">
              Join thousands of professionals who found their best work through VertexHire.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to={user ? "/jobs" : "/register"}
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-semibold text-white
                  shadow-[0_2px_8px_rgba(168,120,32,0.4)] hover:bg-[#9A7018] active:scale-[0.97] transition-all duration-200"
              >
                {user ? "Browse roles" : "Create free account"} <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeaturedCard({ job, delay }) {
  const initials = job.company
    ? job.company.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";
  const colors = ["bg-navy-bg text-navy", "bg-gold-bg text-gold", "bg-teal-bg text-teal"];
  const colorCls = colors[job.id % 3] || colors[0];

  return (
    <motion.div
      variants={{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}
    >
      <Link
        to={`/jobs/${job.id}`}
        className="card-surface flex flex-col p-5 h-full group block"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${colorCls}`}>
            {initials}
          </div>
          <ArrowUpRight
            size={16}
            strokeWidth={1.75}
            className="text-muted-2 transition-all duration-300 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
        <p className="font-display text-[15px] text-ink mb-0.5 leading-snug">{job.title}</p>
        <p className="text-xs text-muted mb-3 flex items-center gap-1">
          <Building2 size={11} strokeWidth={1.75} />
          {job.company}
        </p>
        {job.location && (
          <p className="text-[11px] text-muted-2 flex items-center gap-1 mt-auto">
            <MapPin size={10} strokeWidth={1.75} />
            {job.location}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
