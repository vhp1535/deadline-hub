import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquareWarning, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Zap,
  Map
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Map, label: "Maps", path: "/maps" },
  { icon: TrendingUp, label: "Escalations", path: "/escalations", badge: 8 },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-foreground">Deadline</span>
            )}
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          <span className={cn(
            "mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground",
            collapsed && "sr-only"
          )}>
            Navigation
          </span>
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
