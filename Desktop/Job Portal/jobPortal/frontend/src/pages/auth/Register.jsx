import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import { Input } from "../../components/ui";
import { useToast } from "../../components/Toast";
import { Gem, ArrowRight, UserSearch, Briefcase, Check } from "lucide-react";

export default function Register() {
  const { register, loading } = useAuth();
  const { push }              = useToast();
  const navigate              = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "", role: "CANDIDATE" });
  const [err,  setErr]        = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      push("Account created. Please sign in.", "success");
      navigate("/login");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Could not create account.");
    }
  };

  const roles = [
    { id: "CANDIDATE", label: "Job seeker",  desc: "Find your next opportunity", icon: UserSearch },
    { id: "RECRUITER", label: "Recruiter",   desc: "Post roles, hire top talent",  icon: Briefcase  },
  ];

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-navy px-12 py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ background: "radial-gradient(circle at 30% 70%, #A87820 0%, transparent 65%)" }} />

        <Link to="/" className="flex items-center gap-2.5 relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <Gem size={14} strokeWidth={1.5} className="text-gold-3" />
          </div>
          <span className="font-display text-[17px] font-semibold text-white">VertexHire</span>
        </Link>

        <div className="relative space-y-5">
          {["Verified employer network", "Real-time application tracking", "Curated role matching", "Resume delivery to recruiters"].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20">
                <Check size={11} className="text-gold" strokeWidth={2.5} />
              </div>
              <p className="text-sm text-white/80">{item}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/30 relative">Join 12,000+ professionals on VertexHire.</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-parchment px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
              <Gem size={14} strokeWidth={1.5} className="text-gold-3" />
            </div>
            <span className="font-display text-[17px] font-semibold text-ink">VertexHire</span>
          </div>

          <h1 className="font-display text-3xl text-ink mb-1">Create account</h1>
          <p className="text-sm text-muted mb-7">Begin a more deliberate career journey.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">I am a</p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(({ id, label, desc, icon: Icon }) => {
                  const active = form.role === id;
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setForm((f) => ({ ...f, role: id }))}
                      className={`relative flex flex-col items-start rounded-xl border p-3.5 text-left transition-all duration-200
                        ${active
                          ? "border-navy bg-white shadow-[0_0_0_3px_rgba(13,22,38,0.12)] "
                          : "border-border bg-white hover:border-border-d"}`}
                    >
                      <Icon size={16} strokeWidth={active ? 2 : 1.75} className={active ? "text-navy" : "text-muted"} />
                      <p className={`mt-2 text-xs font-semibold ${active ? "text-navy" : "text-ink-2"}`}>{label}</p>
                      <p className="text-[10px] text-muted leading-tight mt-0.5">{desc}</p>
                      {active && (
                        <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-navy flex items-center justify-center">
                          <Check size={9} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <Input label="Full name"      required placeholder="Jordan Avery"          value={form.name}     onChange={set("name")}     />
            <Input label="Email address"  type="email" required placeholder="you@example.com" value={form.email}    onChange={set("email")}    />
            <Input label="Password"       type="password" required minLength={6} placeholder="At least 6 characters" value={form.password} onChange={set("password")} />

            {err && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-rose-bg border border-rose/20 px-4 py-3 text-xs text-rose"
              >
                {err}
              </motion.p>
            )}

            <Button type="submit" loading={loading} icon={ArrowRight} className="w-full !py-3 mt-1">
              Create account
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-gold font-medium hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
