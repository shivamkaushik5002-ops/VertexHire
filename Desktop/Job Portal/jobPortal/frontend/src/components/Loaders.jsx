export function Spinner({ size = 28, className = "" }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <div
        style={{ width: size, height: size, animation: "spin 0.75s linear infinite" }}
        className="rounded-full border-2 border-border border-t-gold"
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card-surface p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="skeleton h-10 w-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/5 rounded-lg" />
          <div className="skeleton h-3 w-2/5 rounded-lg" />
        </div>
      </div>
      <div className="space-y-2 mb-5">
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-5/6 rounded-lg" />
        <div className="skeleton h-3 w-4/5 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
      <div className="text-center">
        <div
          style={{ width: 36, height: 36, animation: "spin 0.75s linear infinite", margin: "0 auto 12px" }}
          className="rounded-full border-2 border-border border-t-gold"
        />
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </div>
  );
}
