import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, LogOut, User2, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const linkBase =
    "text-sm transition-colors duration-200 py-1 border-b-2 border-transparent hover:text-ink";
  const activeLink = "text-ink border-b-gold";
  const inactiveLink = "text-muted hover:text-ink-2";

  const navLink = ({ isActive }) =>
    `${linkBase} ${isActive ? activeLink : inactiveLink}`;

  const dashPath =
    user?.role === "RECRUITER" ? "/recruiter/dashboard" :
    user?.role === "CANDIDATE" ? "/candidate/dashboard" :
    user?.role === "ADMIN"     ? "/admin"               : null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-nav h-14"
          : "bg-cream/80 backdrop-blur-sm h-16"}`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy group-hover:bg-navy-2 transition-colors duration-200">
            <Gem size={14} strokeWidth={1.5} className="text-gold-3" />
          </div>
          <span className="font-display text-[17px] font-semibold tracking-tight text-ink">
            Vertex<span className="text-gold-gradient">Hire</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/jobs" className={navLink}>Opportunities</NavLink>
          {user?.role === "CANDIDATE" && (
            <>
              <NavLink to="/candidate/dashboard"    className={navLink}>Dashboard</NavLink>
              <NavLink to="/candidate/applications" className={navLink}>Applications</NavLink>
            </>
          )}
          {user?.role === "RECRUITER" && (
            <>
              <NavLink to="/recruiter/dashboard" className={navLink}>Dashboard</NavLink>
              <NavLink to="/recruiter/jobs"      className={navLink}>My Listings</NavLink>
            </>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={navLink}>Admin</NavLink>
          )}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 shadow-card">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-bg">
                  <User2 size={11} strokeWidth={2} className="text-navy" />
                </div>
                <span className="text-xs text-ink-2 font-medium">{user.name.split(" ")[0]}</span>
                <span className="rounded-full bg-gold-bg border border-gold-border px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-gold">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs text-muted
                  shadow-card hover:text-rose hover:border-rose/30 hover:bg-rose-bg transition-all duration-200"
              >
                <LogOut size={13} strokeWidth={1.75} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted hover:text-ink transition-colors duration-200">
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-navy px-5 py-2 text-sm font-medium text-white shadow-[0_1px_3px_rgba(13,22,38,0.25),0_4px_12px_rgba(13,22,38,0.12)] hover:bg-navy-2 transition-all duration-200 active:scale-[0.97]"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-cream-d transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden border-t border-border bg-white/98 backdrop-blur-md overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              <MobileLink to="/jobs" onClick={() => setMobileOpen(false)}>Opportunities</MobileLink>
              {user?.role === "CANDIDATE" && (
                <>
                  <MobileLink to="/candidate/dashboard"    onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                  <MobileLink to="/candidate/applications" onClick={() => setMobileOpen(false)}>Applications</MobileLink>
                </>
              )}
              {user?.role === "RECRUITER" && (
                <>
                  <MobileLink to="/recruiter/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                  <MobileLink to="/recruiter/jobs"      onClick={() => setMobileOpen(false)}>My Listings</MobileLink>
                </>
              )}
              {!user ? (
                <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-xl border border-border py-2.5 text-center text-sm text-muted hover:text-ink">Sign in</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-xl bg-navy py-2.5 text-center text-sm font-medium text-white">Get started</Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="mt-3 flex items-center gap-2 rounded-xl border border-rose/25 bg-rose-bg py-2.5 px-4 text-sm text-rose">
                  <LogOut size={14} /> Sign out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-xl px-4 py-2.5 text-sm transition-colors duration-200 ${
          isActive ? "bg-navy-bg text-navy font-medium" : "text-ink-2 hover:bg-cream"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
