import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User2, Gem } from "lucide-react";

export default function DashboardLayout({ children, navItems }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-parchment px-4 py-6">
        <SidebarContent navItems={navItems} />
      </aside>

      {/* Mobile top-tab */}
      <div className="lg:hidden w-full">
        <div className="border-b border-border bg-white px-4">
          <div className="flex gap-1 overflow-x-auto py-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors
                  ${isActive ? "bg-navy text-white" : "text-muted hover:text-ink hover:bg-cream"}`
                }
              >
                <item.icon size={13} strokeWidth={2} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <main className="p-5">{children}</main>
      </div>

      {/* Desktop main */}
      <main className="hidden lg:block flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}

function SidebarContent({ navItems }) {
  const { user } = useAuth();

  return (
    <>
      {/* User chip */}
      <div className="mb-6 rounded-xl bg-white border border-border p-3.5 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-white font-display font-semibold text-base">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-bg border border-gold-border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-gold">
              <Gem size={8} strokeWidth={2.5} />
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200
              ${isActive
                ? "bg-navy text-white font-medium shadow-[0_1px_3px_rgba(13,22,38,0.25),0_4px_12px_rgba(13,22,38,0.12)]"
                : "text-muted hover:text-ink hover:bg-cream-d"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={15} strokeWidth={isActive ? 2 : 1.75} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
