import { Search, Bell, Menu, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Welcome back, monitor your complaints" },
  "/maps": { title: "Geographic Overview", subtitle: "Complaint distribution and hotspots" },
  "/escalations": { title: "Escalation Management", subtitle: "Monitor and manage active escalations" },
  "/analytics": { title: "Analytics", subtitle: "Performance metrics and trends" },
  "/settings": { title: "Settings", subtitle: "Configure SLA and escalation policies" },
};

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

export function TopBar({ onMobileMenuToggle }: TopBarProps) {
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || pageTitles["/"];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
        {/* Left: Mobile Menu + Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>

          {/* Title - Hidden on mobile */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground sm:text-xl">{pageInfo.title}</h1>
            <p className="hidden text-sm text-muted-foreground md:block">{pageInfo.subtitle}</p>
          </div>
        </div>

        {/* Center: Search - Hidden on mobile */}
        <div className="hidden w-full max-w-md px-4 lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search complaints, escalations..."
              className="h-10 border-border bg-secondary pl-10 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-muted-foreground hover:bg-secondary hover:text-foreground sm:h-10 sm:w-10"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary animate-pulse sm:right-2 sm:top-2" />
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-lg px-2 hover:bg-secondary"
          >
            <Avatar className="h-7 w-7 border border-border sm:h-8 sm:w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium sm:text-sm">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
