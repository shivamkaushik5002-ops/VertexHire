import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Building2, IndianRupee, ArrowUpRight } from "lucide-react";
import { Badge } from "./ui";
import { ArrowRight } from "lucide-react";
const avatarColors = [
  "bg-navy-bg text-navy",
  "bg-gold-bg text-gold",
  "bg-teal-bg text-teal-2",
  "bg-emerald-bg text-emerald",
];

export default function JobCard({ job, index = 0 }) {
  const initials = job.company
    ? job.company.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";
  const color = avatarColors[(job.id || index) % avatarColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.06 }}
    >
      <Link to={`/jobs/${job.id}`} className="card-surface group flex flex-col h-full p-5 block">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${color}`}>
            {initials}
          </div>
          <ArrowUpRight
            size={16}
            strokeWidth={1.75}
            className="shrink-0 text-muted-2 mt-0.5 transition-all duration-250 group-hover:text-gold
              group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

        {/* Info */}
        <h3 className="font-display text-[15px] leading-snug text-ink mb-0.5">{job.title}</h3>
        <p className="flex items-center gap-1 text-xs text-muted mb-3">
          <Building2 size={11} strokeWidth={1.75} />
          {job.company}
        </p>

        {/* Description */}
        <p className="text-xs text-muted-2 leading-relaxed line-clamp-2 mb-4 flex-1">
          {job.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {job.location && (
            <Badge tone="muted">
              <MapPin size={9} className="shrink-0" strokeWidth={1.75} />
              {job.location}
            </Badge>
          )}
          {job.salary != null && (
            <Badge tone="gold">
              <IndianRupee size={9} className="shrink-0" strokeWidth={1.75} />
              {Number(job.salary).toLocaleString("en-IN")}
            </Badge>
          )}
        </div>

        {/* Bottom divider + apply hint */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted-2">View details</span>
          <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center group-hover:border-gold group-hover:bg-gold-bg transition-all duration-200">
            <ArrowRight size={10} strokeWidth={2} className="text-muted group-hover:text-gold transition-colors duration-200" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
