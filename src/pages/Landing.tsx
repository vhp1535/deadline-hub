import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { KPICard } from "@/components/ui/KPICard";
import { LiveIndicator } from "@/components/ui/LiveIndicator";
import { kpiData } from "@/data/mockData";
import { 
  FileText, 
  Search, 
  AlertTriangle, 
  ArrowRight, 
  Shield, 
  Clock, 
  MapPin,
  CheckCircle2,
  BarChart3,
  Users,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: FileText,
    title: "Submit",
    description: "File your complaint with location, category, and attachments. Get instant confirmation with a tracking ID.",
  },
  {
    icon: Search,
    title: "Track",
    description: "Monitor your complaint status in real-time. See timeline updates, SLA progress, and assigned officers.",
  },
  {
    icon: AlertTriangle,
    title: "Escalate",
    description: "Automatic escalation if SLA is breached. Higher authorities are notified to ensure resolution.",
  },
];

const FEATURES = [
  { icon: Shield, title: "Secure & Private", description: "Your data is protected with enterprise-grade security" },
  { icon: Clock, title: "SLA Guaranteed", description: "Strict timelines ensure timely resolution" },
  { icon: MapPin, title: "Location Aware", description: "GPS-enabled for accurate complaint mapping" },
  { icon: CheckCircle2, title: "Track Progress", description: "Real-time updates on complaint status" },
];

export default function Landing() {
  const [authOpen, setAuthOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmitClick = () => {
    navigate("/submit");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin": return "/dashboard";
      case "officer": return "/officer";
      case "authority": return "/authority";
      default: return "/submit";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Deadline</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/track">
                <Button variant="ghost" size="sm">Track Complaint</Button>
              </Link>
              {isAuthenticated ? (
                <Link to={getDashboardLink()}>
                  <Button size="sm">Dashboard</Button>
                </Link>
              ) : (
                <Button size="sm" onClick={() => setAuthOpen(true)}>Sign In</Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <LiveIndicator isLive label="System Active" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Citizen Complaint
            <br />
            <span className="text-gradient">Management System</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Submit, track, and resolve complaints efficiently. Automatic escalation ensures no issue goes unresolved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={handleSubmitClick} className="w-full sm:w-auto">
              <FileText className="w-5 h-5 mr-2" />
              Submit Complaint
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" onClick={() => setAuthOpen(true)} className="w-full sm:w-auto">
                Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* KPI Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Real-time Statistics</h2>
            <p className="text-muted-foreground">Live data from our complaint management system</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <KPICard
              title="Total Complaints"
              value={kpiData.totalComplaints.toLocaleString()}
              icon={FileText}
              change="this month"
              changeType="neutral"
              changeValue={kpiData.monthlyChange.complaints}
            />
            <KPICard
              title="Active Cases"
              value={kpiData.activeComplaints}
              icon={Users}
              change="vs last month"
              changeType="negative"
              changeValue={Math.abs(kpiData.monthlyChange.active)}
              variant="warning"
            />
            <KPICard
              title="SLA Compliance"
              value={`${kpiData.slaCompliance}%`}
              icon={BarChart3}
              progress={kpiData.slaCompliance}
              variant="success"
            />
            <KPICard
              title="Avg Resolution"
              value={`${kpiData.avgResolutionTime}h`}
              icon={Clock}
              isLive
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A simple three-step process to get your complaints addressed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="relative glass-card p-6 text-center group hover:border-primary/50 transition-colors"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border/50 bg-card/50 hover:border-primary/30 transition-colors"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Submit a Complaint?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get started now. No account required to submit and track your complaint.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={handleSubmitClick}>
              <FileText className="w-5 h-5 mr-2" />
              Submit Complaint
            </Button>
            <Link to="/track">
              <Button size="lg" variant="outline">
                <Search className="w-5 h-5 mr-2" />
                Track Existing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Deadline</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Deadline CMS. Demo application for frontend showcase.
          </p>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
