import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, DEMO_ACCOUNTS, UserRole } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { User, Shield, Building2, Crown, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLE_CONFIG = {
  citizen: { label: "Citizen", icon: User, description: "Submit & track complaints" },
  officer: { label: "Officer", icon: Shield, description: "Handle assigned cases" },
  authority: { label: "Higher Authority", icon: Building2, description: "Manage escalations" },
  admin: { label: "Admin", icon: Crown, description: "Full system access" },
};

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("citizen");

  const { login, signup } = useAuth();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setSelectedRole("citizen");
    setShowDemoAccounts(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        const result = await login(email, password);
        if (result.success) {
          toast({ title: "Welcome back!", description: "You've been logged in successfully." });
          handleClose();
        } else {
          toast({ title: "Login failed", description: result.error, variant: "destructive" });
        }
      } else {
        if (!name.trim()) {
          toast({ title: "Name required", description: "Please enter your name.", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        const result = await signup({ name, email, phone, role: selectedRole, password });
        if (result.success) {
          toast({ title: "Account created!", description: "Welcome to Deadline." });
          handleClose();
        } else {
          toast({ title: "Signup failed", description: result.error, variant: "destructive" });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setShowDemoAccounts(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md glass-card border-border p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold">
            {mode === "login" ? "Sign In" : "Create Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === "signup" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="bg-secondary/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Select Role</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(ROLE_CONFIG) as [UserRole, typeof ROLE_CONFIG.citizen][]).map(([role, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
                          selectedRole === role
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary/30 hover:bg-secondary/50"
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{config.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{config.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-secondary/50 border-border"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-secondary/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-secondary/50 border-border"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>{mode === "login" ? "Sign In" : "Create Account"}</>
            )}
          </Button>

          {mode === "login" && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto"
              >
                Demo Accounts
                <ChevronRight className={cn("w-4 h-4 transition-transform", showDemoAccounts && "rotate-90")} />
              </button>

              {showDemoAccounts && (
                <div className="mt-3 p-3 rounded-lg bg-secondary/30 border border-border space-y-2 animate-fade-in">
                  {DEMO_ACCOUNTS.map((account) => {
                    const config = ROLE_CONFIG[account.role];
                    const Icon = config.icon;
                    return (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() => fillDemoAccount(account)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{config.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{account.email}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </form>

        <div className="p-4 border-t border-border bg-secondary/20 text-center">
          {mode === "login" ? (
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => { setMode("signup"); setShowDemoAccounts(false); }}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
