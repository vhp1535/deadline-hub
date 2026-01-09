import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "citizen" | "officer" | "authority" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  assignedComplaints?: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

interface SignupData {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
}

// Demo accounts
export const DEMO_ACCOUNTS = [
  { email: "admin@deadline.test", password: "pass", name: "Admin User", role: "admin" as UserRole, id: "demo-admin" },
  { email: "officer@deadline.test", password: "pass", name: "Officer Demo", role: "officer" as UserRole, id: "demo-officer", assignedComplaints: ["CMP-001", "CMP-003", "CMP-005"] },
  { email: "authority@deadline.test", password: "pass", name: "Authority Demo", role: "authority" as UserRole, id: "demo-authority" },
  { email: "citizen@deadline.test", password: "pass", name: "Citizen Demo", role: "citizen" as UserRole, id: "demo-citizen" },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "deadline_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const account = DEMO_ACCOUNTS.find(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    if (account) {
      const userData: User = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        assignedComplaints: account.assignedComplaints,
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        user: userData, 
        token: `MOCK_JWT_${account.role.toUpperCase()}_${Date.now()}` 
      }));
      return { success: true };
    }

    // Check custom registered users
    const customUsers = JSON.parse(localStorage.getItem("deadline_users") || "[]");
    const customUser = customUsers.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (customUser) {
      const userData: User = {
        id: customUser.id,
        name: customUser.name,
        email: customUser.email,
        phone: customUser.phone,
        role: customUser.role,
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        user: userData, 
        token: `MOCK_JWT_${customUser.role.toUpperCase()}_${Date.now()}` 
      }));
      return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email already exists
    const exists = DEMO_ACCOUNTS.some(acc => acc.email.toLowerCase() === data.email.toLowerCase());
    const customUsers = JSON.parse(localStorage.getItem("deadline_users") || "[]");
    const customExists = customUsers.some((u: any) => u.email.toLowerCase() === data.email.toLowerCase());

    if (exists || customExists) {
      return { success: false, error: "Email already registered" };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      password: data.password,
    };

    customUsers.push(newUser);
    localStorage.setItem("deadline_users", JSON.stringify(customUsers));

    // Auto-login after signup
    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    };
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      user: userData, 
      token: `MOCK_JWT_${newUser.role.toUpperCase()}_${Date.now()}` 
    }));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (role: UserRole) => {
    const account = DEMO_ACCOUNTS.find(acc => acc.role === role);
    if (account) {
      const userData: User = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        assignedComplaints: account.assignedComplaints,
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        user: userData, 
        token: `MOCK_JWT_${account.role.toUpperCase()}_${Date.now()}` 
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout,
      switchRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
