import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center max-w-sm"
      >
        {/* Decorative number */}
        <div className="relative mb-8 inline-block">
          <p className="font-display text-[10rem] leading-none font-semibold text-cream-d select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-border shadow-card">
              <Compass size={28} strokeWidth={1.25} className="text-gold" />
            </div>
          </div>
        </div>

        <h1 className="font-display text-2xl text-ink mb-3">Page not found</h1>
        <p className="text-sm text-muted leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-2.5 text-sm font-medium text-white
              shadow-[0_1px_3px_rgba(13,22,38,0.25),0_4px_12px_rgba(13,22,38,0.12)] hover:bg-navy-2 transition-all active:scale-[0.97]"
          >
            <ArrowLeft size={14} strokeWidth={2} /> Go home
          </Link>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-2.5 text-sm text-muted
              hover:text-ink hover:border-border-d shadow-card transition-all"
          >
            Browse roles
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
