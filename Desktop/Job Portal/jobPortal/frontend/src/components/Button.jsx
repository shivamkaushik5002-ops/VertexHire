export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  icon: Icon,
  ...props
}) {
  const base =
    "relative inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ease-out select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";

  const sizes = {
    sm: "text-xs px-4 py-2 tracking-wide",
    md: "text-sm px-5 py-2.5 tracking-wide",
    lg: "text-[15px] px-7 py-3.5 tracking-wide",
  };

  const variants = {
    primary:
      "bg-navy text-white hover:bg-navy-2 shadow-[0_1px_3px_rgba(13,22,38,0.3),0_4px_12px_rgba(13,22,38,0.15)] hover:shadow-[0_2px_6px_rgba(13,22,38,0.3),0_8px_24px_rgba(13,22,38,0.2)]",
    gold:
      "bg-gold text-white hover:bg-[#9A7018] shadow-[0_1px_3px_rgba(168,120,32,0.3),0_4px_12px_rgba(168,120,32,0.2)] hover:shadow-[0_2px_6px_rgba(168,120,32,0.3),0_8px_24px_rgba(168,120,32,0.25)]",
    secondary:
      "bg-white border border-border text-ink-2 hover:border-border-d hover:bg-parchment shadow-card hover:shadow-card-hover",
    outline:
      "bg-transparent border border-navy text-navy hover:bg-navy-bg",
    ghost:
      "bg-transparent text-muted hover:text-ink hover:bg-cream-d",
    danger:
      "bg-white border border-rose/30 text-rose hover:bg-rose-bg",
    teal:
      "bg-white border border-teal/30 text-teal hover:bg-teal-bg",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span
          className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
          style={{ animation: "spin 0.7s linear infinite" }}
        />
      ) : (
        Icon && <Icon size={15} strokeWidth={1.75} className="shrink-0" />
      )}
      {children}
    </button>
  );
}
