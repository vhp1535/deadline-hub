import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComplaints } from "@/contexts/ComplaintContext";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  MapPin, 
  Upload, 
  X, 
  CheckCircle2, 
  Copy, 
  Loader2,
  Zap,
  FileImage,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Technical",
  "Security",
  "Performance",
  "API",
  "Infrastructure",
  "Communication",
  "Billing",
  "Other",
];

const SEVERITY_OPTIONS = [
  { value: "low", label: "Low", description: "Minor issue, can wait", color: "text-muted-foreground" },
  { value: "medium", label: "Medium", description: "Moderate impact", color: "text-success" },
  { value: "high", label: "High", description: "Significant impact", color: "text-warning" },
  { value: "critical", label: "Critical", description: "Urgent attention needed", color: "text-destructive" },
];

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  region?: string;
}

export default function Submit() {
  const navigate = useNavigate();
  const { addComplaint } = useComplaints();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");

  // Form state
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Mock reverse geocoding - in production this would call a geocoding API
        const mockAddress = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E - Auto-detected location`;
        setLocation({ lat: latitude, lng: longitude, address: mockAddress });
        setManualAddress(mockAddress);
        setIsDetectingLocation(false);
        toast({ title: "Location detected", description: "Your location has been captured." });
      },
      (error) => {
        setIsDetectingLocation(false);
        toast({ title: "Location error", description: error.message, variant: "destructive" });
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 5MB limit`, variant: "destructive" });
        return false;
      }
      return true;
    });
    setAttachments(prev => [...prev, ...validFiles].slice(0, 5));
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !title.trim() || !description.trim()) {
      toast({ title: "Missing fields", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const complaintId = addComplaint({
      title: title.trim(),
      description: description.trim(),
      severity,
      status: "open",
      slaProgress: 0,
      slaRemaining: severity === "critical" ? "4h" : severity === "high" ? "12h" : severity === "medium" ? "24h" : "48h",
      slaDuration: severity === "critical" ? 4 : severity === "high" ? 12 : severity === "medium" ? 24 : 48,
      category,
      location: {
        lat: location?.lat || 28.6139,
        lng: location?.lng || 77.2090,
        address: location?.address || manualAddress || "Address not provided",
        region: location?.region || "Delhi NCR",
      },
      assignee: {
        id: "pending",
        name: "Pending Assignment",
        initials: "PA",
        department: "Triage Queue",
      },
      attachments: attachments.map(f => f.name),
      notes: [],
    });

    setSubmittedId(complaintId);
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  const copyId = () => {
    navigator.clipboard.writeText(submittedId);
    toast({ title: "Copied!", description: "Complaint ID copied to clipboard" });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-8 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Complaint Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Your complaint has been registered successfully. Use the ID below to track its status.
          </p>

          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Your Complaint ID</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-mono font-bold text-primary">{submittedId}</span>
              <Button variant="ghost" size="icon" onClick={copyId}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link to={`/track?id=${submittedId}`}>
              <Button className="w-full">Track Complaint</Button>
            </Link>
            <Link to="/landing">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/landing">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Submit Complaint</h1>
            <p className="text-sm text-muted-foreground">Fill in the details below</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your complaint"
              className="bg-secondary/50 border-border"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground text-right">{title.length}/100</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your complaint..."
              className="bg-secondary/50 border-border min-h-[120px]"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">{description.length}/1000</p>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label>Severity</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEVERITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSeverity(option.value as any)}
                  className={cn(
                    "p-3 rounded-lg border transition-all text-left",
                    severity === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/30 hover:bg-secondary/50"
                  )}
                >
                  <div className={cn("text-sm font-medium", option.color)}>{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              System may adjust severity based on analysis
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex gap-2">
              <Input
                value={manualAddress}
                onChange={(e) => {
                  setManualAddress(e.target.value);
                  setLocation(null);
                }}
                placeholder="Enter address or detect location"
                className="bg-secondary/50 border-border flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={detectLocation}
                disabled={isDetectingLocation}
              >
                {isDetectingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                <span className="ml-2 hidden sm:inline">Detect</span>
              </Button>
            </div>
            {location && (
              <p className="text-xs text-success flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                GPS coordinates captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div
              className={cn(
                "border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors",
                attachments.length >= 5 && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => attachments.length < 5 && fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max 5 files, 5MB each • Images, PDFs, Documents
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border"
                  >
                    <FileImage className="w-4 h-4 text-primary" />
                    <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Submit Complaint
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
