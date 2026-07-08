export function Card({ children, className = "", hover = true, ...props }) {
  return (
    <div
      className={`card-surface overflow-hidden ${hover ? "hover:-translate-y-0.5" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Input({ label, hint, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink
          placeholder:text-muted-2 outline-none transition-all duration-200
          focus:border-navy focus:shadow-input ${className}`}
        {...props}
      />
      {hint && !error && <span className="mt-1 block text-[11px] text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] text-rose">{error}</span>}
    </label>
  );
}

export function Textarea({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
          {label}
        </span>
      )}
      <textarea
        className={`w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink
          placeholder:text-muted-2 outline-none resize-none transition-all duration-200
          focus:border-navy focus:shadow-input ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-[11px] text-rose">{error}</span>}
    </label>
  );
}

export function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
          {label}
        </span>
      )}
      <select
        className={`w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink
          outline-none transition-all duration-200 focus:border-navy focus:shadow-input ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

const badgeTones = {
  gold:    "bg-gold-bg text-gold border-gold-border",
  navy:    "bg-navy-bg text-navy border-navy/20",
  teal:    "bg-teal-bg text-teal border-teal/20",
  muted:   "bg-cream text-muted border-border",
  green:   "bg-emerald-bg text-emerald border-emerald/20",
  red:     "bg-rose-bg text-rose border-rose/20",
  cyan:    "bg-teal-bg text-teal-2 border-teal/20",
};

export function Badge({ children, tone = "muted", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] ${badgeTones[tone] || badgeTones.muted} ${className}`}
    >
      {children}
    </span>
  );
}

export function Divider({ label, className = "" }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-border" />
      {label && <span className="text-[11px] text-muted-2 uppercase tracking-widest">{label}</span>}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
