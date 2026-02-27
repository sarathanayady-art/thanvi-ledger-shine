import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Receipt,
  FileBarChart,
  Split,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/retail", icon: ShoppingBag, label: "Retail Sales" },
  { to: "/expenses", icon: Receipt, label: "Expenses" },
  { to: "/partners", icon: Split, label: "Partner Splits" },
  { to: "/reports", icon: FileBarChart, label: "Reports" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] flex flex-col z-50">
      <div className="px-5 py-6 border-b border-[hsl(var(--sidebar-border))]">
        <h1 className="text-lg font-bold text-[hsl(var(--sidebar-primary))]">E-Ledger</h1>
        <p className="text-xs text-[hsl(var(--sidebar-foreground)/0.6)] mt-0.5">Thanvi Collections</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-[hsl(var(--sidebar-border))] text-xs text-[hsl(var(--sidebar-foreground)/0.4)]">
        © 2025 Thanvi Collections
      </div>
    </aside>
  );
};

export default AppSidebar;
