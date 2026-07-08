import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import { Input } from "../../components/ui";
import { useToast } from "../../components/Toast";
import { Gem, ArrowRight, Quote } from "lucide-react";

export default function Login() {
  const { login, loading } = useAuth();
  const { push }           = useToast();
  const navigate           = useNavigate();
  const location           = useLocation();
  const [form, setForm]    = useState({ email: "", password: "" });
  const [err,  setErr]     = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const u = await login(form.email, form.password);
      push(`Welcome back, ${u.name.split(" ")[0]}.`, "success");
      const dest =
        location.state?.from ||
        (u.role === "RECRUITER" ? "/recruiter/dashboard"
         : u.role === "ADMIN"  ? "/admin"
         : "/candidate/dashboard");
      navigate(dest, { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-navy px-12 py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ background: "radial-gradient(circle at 70% 30%, #A87820 0%, transparent 65%)" }} />

        <Link to="/" className="flex items-center gap-2.5 relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <Gem size={14} strokeWidth={1.5} className="text-gold-3" />
          </div>
          <span className="font-display text-[17px] font-semibold text-white">VertexHire</span>
        </Link>

        <div className="relative">
          <Quote size={36} strokeWidth={1} className="text-gold/50 mb-5" />
          <blockquote className="font-display text-2xl leading-[1.35] text-white/90 mb-6 italic">
            "The right opportunity changes everything. We exist to make sure you find it."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">A</div>
            <div>
              <p className="text-sm text-white font-medium">Arjun Mehta</p>
              <p className="text-xs text-white/50">Placed via VertexHire, 2024</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/30 relative">
          Trusted by 200+ employers across India.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-parchment px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
              <Gem size={14} strokeWidth={1.5} className="text-gold-3" />
            </div>
            <span className="font-display text-[17px] font-semibold text-ink">VertexHire</span>
          </div>

          <h1 className="font-display text-3xl text-ink mb-1">Welcome back</h1>
          <p className="text-sm text-muted mb-8">Sign in to continue your search.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Your password"
              value={form.password}
              onChange={set("password")}
            />

            {err && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-rose-bg border border-rose/20 px-4 py-3 text-xs text-rose"
              >
                {err}
              </motion.p>
            )}

            <Button type="submit" loading={loading} icon={ArrowRight} className="w-full !py-3 mt-2">
              Sign in
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-muted">
            New to VertexHire?{" "}
            <Link to="/register" className="text-gold font-medium hover:underline underline-offset-4">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
