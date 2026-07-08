import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Textarea } from "./ui";
import Button from "./Button";
import { X, Briefcase } from "lucide-react";

export default function JobFormModal({ open, onClose, onSubmit, initial, saving }) {
  const blank = { title: "", company: "", location: "", description: "", salary: "" };
  const [form, setForm] = useState(blank);

  useEffect(() => {
    setForm(
      initial
        ? { title: initial.title || "", company: initial.company || "", location: initial.location || "",
            description: initial.description || "", salary: initial.salary ?? "" }
        : blank
    );
  }, [initial, open]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, salary: form.salary === "" ? null : Number(form.salary) });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center px-4 sm:px-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-modal overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-bg">
                  <Briefcase size={14} strokeWidth={1.75} className="text-navy" />
                </div>
                <h2 className="font-display text-lg text-ink">
                  {initial ? "Edit listing" : "New listing"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted hover:text-ink hover:bg-cream transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-7 py-6 space-y-4">
              <Input
                label="Job title"
                required
                placeholder="e.g. Senior Product Designer"
                value={form.title}
                onChange={set("title")}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Company"
                  required
                  placeholder="Acme Corp"
                  value={form.company}
                  onChange={set("company")}
                />
                <Input
                  label="Location"
                  placeholder="Mumbai / Remote"
                  value={form.location}
                  onChange={set("location")}
                />
              </div>
              <Input
                label="Annual salary (₹)"
                type="number"
                placeholder="e.g. 1200000"
                value={form.salary}
                onChange={set("salary")}
              />
              <Textarea
                label="Role description"
                rows={6}
                required
                placeholder="Describe the role, responsibilities, and requirements…"
                value={form.description}
                onChange={set("description")}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-7 py-5 border-t border-border bg-parchment">
              <Button type="submit" loading={saving} className="flex-1">
                {initial ? "Save changes" : "Publish listing"}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
}
