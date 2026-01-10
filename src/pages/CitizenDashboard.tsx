import { Link } from "react-router-dom";
import { useAuth, DEMO_ACCOUNTS } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/ui/KPICard";
import { SLAProgress } from "@/components/ui/SLAProgress";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Plus,
  Search,
  LogOut,
  User,
  ArrowRight
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "open": { label: "Open", variant: "secondary" },
  "in-progress": { label: "In Progress", variant: "default" },
  "resolved": { label: "Resolved", variant: "outline" },
  "escalated": { label: "Escalated", variant: "destructive" },
  "failed": { label: "Failed", variant: "destructive" },
};

export default function CitizenDashboard() {
  const { user, logout, switchRole } = useAuth();
  const { complaints } = useComplaints();

  // Filter complaints for this citizen (in real app, would filter by user ID)
  // For demo, show all complaints as if they belong to the citizen
  const myComplaints = complaints.slice(0, 5);
  
  const stats = {
    total: myComplaints.length,
    pending: myComplaints.filter(c => c.status === "open" || c.status === "in-progress").length,
    resolved: myComplaints.filter(c => c.status === "resolved").length,
    escalated: myComplaints.filter(c => c.status === "escalated").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Mode Banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/20">Demo Mode</Badge>
            <span className="text-sm text-muted-foreground">
              Logged in as <strong>{user?.name}</strong> ({user?.role})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Switch role:</span>
            {DEMO_ACCOUNTS.map(acc => (
              <Button
                key={acc.role}
                variant={user?.role === acc.role ? "default" : "ghost"}
                size="sm"
                onClick={() => switchRole(acc.role)}
                className="text-xs h-7"
              >
                {acc.role}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">Track and manage your complaints</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {user?.email}
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/submit">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Submit New Complaint</h3>
                  <p className="text-sm text-muted-foreground">Report an issue in your area</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/track">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-secondary/50 text-secondary-foreground group-hover:bg-secondary transition-colors">
                  <Search className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Track Complaint</h3>
                  <p className="text-sm text-muted-foreground">Check status by complaint ID</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Total Complaints"
            value={stats.total}
            icon={FileText}
            change="+2 this month"
            changeType="positive"
          />
          <KPICard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            change="awaiting action"
            changeType="neutral"
            variant="warning"
          />
          <KPICard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            change="+1 this week"
            changeType="positive"
            variant="success"
          />
          <KPICard
            title="Escalated"
            value={stats.escalated}
            icon={AlertTriangle}
            change="needs attention"
            changeType="neutral"
            variant="destructive"
          />
        </div>

        {/* My Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>My Recent Complaints</CardTitle>
            <CardDescription>Your submitted complaints and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            {myComplaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-medium text-lg mb-2">No complaints yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't submitted any complaints. Start by reporting an issue.
                </p>
                <Link to="/submit">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Complaint
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myComplaints.map((complaint, index) => {
                  // Calculate SLA progress (mock data)
                  const hoursRemaining = Math.max(0, 72 - (index * 15));
                  const progress = Math.round(((72 - hoursRemaining) / 72) * 100);
                  const remaining = hoursRemaining > 0 ? `${hoursRemaining}h left` : "Overdue";
                  
                  return (
                    <div
                      key={complaint.id}
                      className="p-4 border rounded-lg hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm text-muted-foreground">
                              {complaint.id}
                            </span>
                            <Badge variant={STATUS_CONFIG[complaint.status]?.variant || "secondary"}>
                              {STATUS_CONFIG[complaint.status]?.label || complaint.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium">{complaint.title}</h4>
                        </div>
                        <Link to={`/track/${complaint.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {complaint.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {complaint.location.address}
                        </span>
                        <SLAProgress 
                          progress={progress}
                          remaining={remaining}
                          size="sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
