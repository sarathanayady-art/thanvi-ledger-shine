import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Receipt,
  FileBarChart,
  Split,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/retail", icon: ShoppingBag, label: "Retail" },
  { to: "/expenses", icon: Receipt, label: "Expenses" },
  { to: "/partners", icon: Split, label: "Partners" },
  { to: "/reports", icon: FileBarChart, label: "Reports" },
];

const AppTopBar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] shadow-md">
      <div className="flex items-center justify-between px-5 h-14">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-[hsl(var(--sidebar-primary))]">E-Ledger</h1>
          <span className="hidden sm:inline text-xs text-[hsl(var(--sidebar-foreground)/0.5)] ml-1">Thanvi Collections</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))]"
                    : "hover:bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))]"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="md:hidden px-4 pb-3 space-y-1 border-t border-[hsl(var(--sidebar-border))]">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))]"
                    : "hover:bg-[hsl(var(--sidebar-accent))]"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default AppTopBar;
