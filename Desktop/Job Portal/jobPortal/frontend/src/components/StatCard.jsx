import { motion } from "framer-motion";

const tones = {
  navy:    { wrap: "bg-navy-bg border-navy/15",    icon: "bg-navy text-white",     val: "text-navy"    },
  gold:    { wrap: "bg-gold-bg border-gold-border", icon: "bg-gold text-white",     val: "text-gold"    },
  teal:    { wrap: "bg-teal-bg border-teal/20",    icon: "bg-teal text-white",     val: "text-teal"    },
  emerald: { wrap: "bg-emerald-bg border-emerald/20", icon: "bg-emerald text-white", val: "text-emerald" },
  rose:    { wrap: "bg-rose-bg border-rose/20",    icon: "bg-rose text-white",     val: "text-rose"    },
};

export default function StatCard({ label, value, icon: Icon, tone = "navy", index = 0 }) {
  const t = tones[tone] || tones.navy;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.07 }}
      className={`rounded-2xl border p-5 ${t.wrap}`}
    >
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-card ${t.icon}`}>
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <p className={`font-display text-3xl font-semibold ${t.val}`}>{value}</p>
      <p className="mt-1 text-xs text-muted uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}
