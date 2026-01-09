import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useComplaints } from "@/contexts/ComplaintContext";
import { SLAProgress } from "@/components/ui/SLAProgress";
import { Timeline } from "@/components/ui/Timeline";
import { LeafletMap } from "@/components/ui/LeafletMap";
import { Complaint } from "@/data/mockData";
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Clock, 
  User, 
  FileText,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Zap,
  Copy,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  "open": { label: "Open", variant: "outline" as const, icon: FileText },
  "in-progress": { label: "In Progress", variant: "secondary" as const, icon: Clock },
  "escalated": { label: "Escalated", variant: "destructive" as const, icon: AlertTriangle },
  "resolved": { label: "Resolved", variant: "default" as const, icon: CheckCircle2 },
  "failed": { label: "Failed", variant: "destructive" as const, icon: AlertTriangle },
};

const SEVERITY_COLORS = {
  critical: "text-destructive",
  high: "text-warning",
  medium: "text-success",
  low: "text-muted-foreground",
};

export default function Track() {
  const [searchParams] = useSearchParams();
  const { getComplaint } = useComplaints();
  
  const [searchId, setSearchId] = useState(searchParams.get("id") || "");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search if ID is in URL
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      handleSearch(urlId);
    }
  }, [searchParams]);

  const handleSearch = async (id?: string) => {
    const lookupId = id || searchId;
    if (!lookupId.trim()) {
      toast({ title: "Enter a complaint ID", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    setNotFound(false);
    setHasSearched(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const found = getComplaint(lookupId.trim());
    if (found) {
      setComplaint(found);
      setNotFound(false);
    } else {
      setComplaint(null);
      setNotFound(true);
    }

    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const copyId = () => {
    if (complaint) {
      navigator.clipboard.writeText(complaint.id);
      toast({ title: "Copied!", description: "Complaint ID copied to clipboard" });
    }
  };

  const getTimelineSteps = (complaint: Complaint) => {
    const steps = [
      {
        id: "submitted",
        title: "Complaint Submitted",
        description: new Date(complaint.createdAt).toLocaleString(),
        status: "completed" as const,
      },
      {
        id: "assigned",
        title: "Assigned to Agent",
        description: complaint.assignee.name !== "Pending Assignment" 
          ? `${complaint.assignee.name} - ${complaint.assignee.department}`
          : "Waiting for assignment",
        status: complaint.assignee.name !== "Pending Assignment" ? "completed" as const : "current" as const,
      },
    ];

    if (complaint.escalationLevel > 1) {
      steps.push({
        id: "escalated",
        title: `Escalated to Level ${complaint.escalationLevel}`,
        description: "Higher authority notified",
        status: "current" as const,
      });
    }

    if (complaint.status === "in-progress") {
      steps.push({
        id: "inprogress",
        title: "In Progress",
        description: "Agent working on resolution",
        status: "current" as const,
      });
    }

    if (complaint.status === "resolved") {
      steps.push({
        id: "resolved",
        title: "Resolved",
        description: new Date(complaint.updatedAt).toLocaleString(),
        status: "completed" as const,
      });
    }

    return steps;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/landing">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Track Complaint</h1>
            <p className="text-sm text-muted-foreground">Enter your complaint ID to view status</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                  placeholder="Enter Complaint ID (e.g., CMP-001)"
                  className="pl-10 bg-secondary/50 border-border h-12 text-lg font-mono"
                />
              </div>
              <Button type="submit" size="lg" disabled={isSearching} className="h-12">
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Track
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Not Found */}
        {notFound && (
          <div className="glass-card p-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold mb-2">Complaint Not Found</h2>
            <p className="text-muted-foreground mb-6">
              No complaint found with ID "{searchId}". Please check the ID and try again.
            </p>
            <Link to="/submit">
              <Button variant="outline">Submit a New Complaint</Button>
            </Link>
          </div>
        )}

        {/* Complaint Details */}
        {complaint && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Card */}
            <div className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">Complaint ID</span>
                    <button onClick={copyId} className="text-primary hover:underline flex items-center gap-1">
                      <span className="font-mono font-bold">{complaint.id}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold mb-2">{complaint.title}</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={STATUS_CONFIG[complaint.status].variant}>
                      {STATUS_CONFIG[complaint.status].label}
                    </Badge>
                    <Badge variant="outline" className={SEVERITY_COLORS[complaint.severity]}>
                      {complaint.severity.charAt(0).toUpperCase() + complaint.severity.slice(1)} Severity
                    </Badge>
                    <Badge variant="outline">{complaint.category}</Badge>
                  </div>
                </div>
                <SLAProgress 
                  progress={complaint.slaProgress} 
                  remaining={complaint.slaRemaining}
                  size="lg"
                />
              </div>

              <p className="text-muted-foreground">{complaint.description}</p>

              {/* Meta info */}
              <div className="mt-6 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Assigned To</p>
                    <p className="text-sm">{complaint.assignee.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm truncate">{complaint.location.region}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="glass-card p-4 sm:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Complaint Location
              </h3>
              <div className="h-[200px] sm:h-[300px] rounded-xl overflow-hidden border border-border">
                <LeafletMap
                  markers={[{
                    id: complaint.id,
                    lat: complaint.location.lat,
                    lng: complaint.location.lng,
                    title: complaint.title,
                    severity: complaint.severity,
                    status: complaint.status,
                  }]}
                  center={[complaint.location.lat, complaint.location.lng]}
                  zoom={14}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {complaint.location.address}
              </p>
            </div>

            {/* Timeline */}
            <div className="glass-card p-4 sm:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Status Timeline
              </h3>
              <Timeline steps={getTimelineSteps(complaint)} />
            </div>

            {/* Notes */}
            {complaint.notes.length > 0 && (
              <div className="glass-card p-4 sm:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Updates
                </h3>
                <div className="space-y-3">
                  {complaint.notes.map((note, index) => (
                    <div key={index} className="p-3 rounded-lg bg-secondary/30 border border-border">
                      <p className="text-sm">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/submit" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Submit Another Complaint
                </Button>
              </Link>
              <Button variant="outline" onClick={() => window.print()}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Print Details
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && !complaint && (
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Enter Your Complaint ID</h2>
            <p className="text-muted-foreground mb-6">
              Your complaint ID was provided when you submitted your complaint. Enter it above to track the status.
            </p>
            <p className="text-sm text-muted-foreground">
              Don't have a complaint ID?{" "}
              <Link to="/submit" className="text-primary hover:underline">
                Submit a new complaint
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
