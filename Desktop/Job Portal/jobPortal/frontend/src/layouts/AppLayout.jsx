import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Cursor from "../components/Cursor";
import { Gem } from "lucide-react";
import { Link } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Cursor />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-parchment mt-auto">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy">
                  <Gem size={12} strokeWidth={1.5} className="text-gold-3" />
                </div>
                <span className="font-display text-base font-semibold text-ink">VertexHire</span>
              </Link>
              <p className="text-xs text-muted max-w-xs leading-relaxed">
                Where deliberate careers are built. Every listing curated, every match intentional.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1">
              <p className="text-[11px] text-muted-2">
                © {new Date().getFullYear()} VertexHire. All rights reserved.
              </p>
              <p className="text-[11px] text-muted-2">
                Crafted with <span className="text-gold font-medium">precision</span> and <span className="text-teal font-medium">trust</span>.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
