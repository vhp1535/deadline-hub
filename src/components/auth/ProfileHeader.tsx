import { useNavigate } from "react-router-dom";
import { useAuth, DEMO_ACCOUNTS, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Shield,
  UserCog,
  Users,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_CONFIG: Record<UserRole, { icon: React.ElementType; label: string; color: string }> = {
  citizen: { icon: Users, label: "Citizen", color: "text-blue-400" },
  officer: { icon: UserCog, label: "Field Officer", color: "text-warning" },
  authority: { icon: Building2, label: "Higher Authority", color: "text-purple-400" },
  admin: { icon: Shield, label: "Administrator", color: "text-primary" },
};

interface ProfileHeaderProps {
  title?: string;
  subtitle?: string;
  showDemoSwitcher?: boolean;
  className?: string;
}

export function ProfileHeader({ 
  title, 
  subtitle, 
  showDemoSwitcher = true,
  className 
}: ProfileHeaderProps) {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role];
  const RoleIcon = roleConfig.icon;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSwitchRole = (role: UserRole) => {
    switchRole(role);
    // Navigate to appropriate dashboard after switching
    switch (role) {
      case "admin":
        navigate("/dashboard");
        break;
      case "officer":
        navigate("/officer");
        break;
      case "authority":
        navigate("/authority");
        break;
      case "citizen":
        navigate("/citizen");
        break;
    }
  };

  return (
    <div className={cn(
      "glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-primary/30",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
          <RoleIcon className={cn("w-6 h-6", roleConfig.color)} />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-lg">{user.name}</span>
            <Badge variant="outline" className={cn("text-xs", roleConfig.color, "border-current/30 bg-current/10")}>
              {roleConfig.label}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              Demo Mode
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {title || `${roleConfig.label} Dashboard`}
            {subtitle && ` — ${subtitle}`}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Demo Role Switcher */}
        {showDemoSwitcher && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                Switch Role
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Demo Accounts
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {DEMO_ACCOUNTS.map((account) => {
                const config = ROLE_CONFIG[account.role];
                const Icon = config.icon;
                return (
                  <DropdownMenuItem
                    key={account.role}
                    onClick={() => handleSwitchRole(account.role)}
                    className={cn(
                      "cursor-pointer",
                      user.role === account.role && "bg-primary/10"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 mr-2", config.color)} />
                    <span className="flex-1">{config.label}</span>
                    {user.role === account.role && (
                      <Badge variant="secondary" className="text-[10px] h-4">
                        Current
                      </Badge>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              Profile
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
