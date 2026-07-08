import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

const config = {
  success: { icon: CheckCircle2, cls: "text-emerald bg-emerald-bg border-emerald/20" },
  error:   { icon: XCircle,      cls: "text-rose bg-rose-bg border-rose/20"         },
  info:    { icon: Info,         cls: "text-teal bg-teal-bg border-teal/20"          },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 w-[min(360px,90vw)]">
        <AnimatePresence>
          {toasts.map((t) => {
            const { icon: Icon, cls } = config[t.type] || config.info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className={`flex items-start gap-3 rounded-2xl border shadow-modal bg-white px-4 py-3.5 ${cls}`}
              >
                <Icon size={17} strokeWidth={2} className="mt-0.5 shrink-0" />
                <p className="flex-1 text-sm text-ink leading-snug">{t.message}</p>
                <button onClick={() => dismiss(t.id)} className="shrink-0 text-muted hover:text-ink transition-colors">
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
