// Mock data for the Deadline dashboard

export interface Complaint {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in-progress" | "escalated" | "resolved" | "failed";
  slaProgress: number;
  slaRemaining: string;
  slaDuration: number; // in hours
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    region: string;
  };
  assignee: {
    id: string;
    name: string;
    initials: string;
    department: string;
  };
  createdAt: string;
  updatedAt: string;
  escalationLevel: number;
  retryCount: number;
  attachments: string[];
  notes: string[];
}

export interface Escalation {
  id: string;
  complaintId: string;
  complaintTitle: string;
  level: number;
  status: "pending" | "active" | "resolved" | "failed";
  retryCount: number;
  maxRetries: number;
  assignedTo: string;
  department: string;
  createdAt: string;
  failReason?: string;
}

export interface Officer {
  id: string;
  name: string;
  department: string;
  resolvedCount: number;
  pendingCount: number;
  averageResolutionTime: number; // in hours
  slaCompliance: number; // percentage
  performance: "excellent" | "good" | "average" | "poor";
}

export interface PolicyRule {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  slaDuration: number; // in hours
  escalationLevels: {
    level: number;
    title: string;
    department: string;
    timeThreshold: number; // hours until escalation
  }[];
}

export interface MapHotspot {
  id: string;
  lat: number;
  lng: number;
  complaintCount: number;
  severity: "critical" | "high" | "medium" | "low";
  region: string;
  slaCompliance: number;
}

// Sample complaints data
export const complaints: Complaint[] = [
  {
    id: "CMP-001",
    title: "Payment gateway timeout issues",
    description: "Multiple users reporting payment failures during checkout",
    severity: "critical",
    status: "escalated",
    slaProgress: 85,
    slaRemaining: "2h 15m",
    slaDuration: 4,
    category: "Technical",
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: "123 Main St, New York, NY",
      region: "Northeast",
    },
    assignee: { id: "u1", name: "Sarah Chen", initials: "SC", department: "Technical Support" },
    createdAt: "2026-01-05T09:15:00Z",
    updatedAt: "2026-01-07T10:30:00Z",
    escalationLevel: 3,
    retryCount: 0,
    attachments: ["screenshot1.png", "log-file.txt"],
    notes: ["Initial triage completed", "Escalated to L2 after 4 hours"],
  },
  {
    id: "CMP-002",
    title: "User authentication failures",
    description: "SSO login not working for enterprise customers",
    severity: "high",
    status: "in-progress",
    slaProgress: 45,
    slaRemaining: "8h 30m",
    slaDuration: 12,
    category: "Security",
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: "456 Tech Blvd, Los Angeles, CA",
      region: "West",
    },
    assignee: { id: "u2", name: "Mike Ross", initials: "MR", department: "Security Team" },
    createdAt: "2026-01-06T14:20:00Z",
    updatedAt: "2026-01-07T08:00:00Z",
    escalationLevel: 2,
    retryCount: 1,
    attachments: ["error-logs.zip"],
    notes: ["Investigating OAuth provider"],
  },
  {
    id: "CMP-003",
    title: "Dashboard loading slowly",
    description: "Analytics dashboard takes 30+ seconds to load",
    severity: "medium",
    status: "open",
    slaProgress: 20,
    slaRemaining: "22h 45m",
    slaDuration: 24,
    category: "Performance",
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: "789 Data Center Rd, Chicago, IL",
      region: "Midwest",
    },
    assignee: { id: "u3", name: "Emma Wilson", initials: "EW", department: "Engineering" },
    createdAt: "2026-01-07T02:30:00Z",
    updatedAt: "2026-01-07T02:30:00Z",
    escalationLevel: 1,
    retryCount: 0,
    attachments: [],
    notes: [],
  },
  {
    id: "CMP-004",
    title: "Email notifications delayed",
    description: "Transactional emails arriving 2-3 hours late",
    severity: "low",
    status: "in-progress",
    slaProgress: 60,
    slaRemaining: "5h 00m",
    slaDuration: 48,
    category: "Communication",
    location: {
      lat: 29.7604,
      lng: -95.3698,
      address: "321 Houston Center, Houston, TX",
      region: "South",
    },
    assignee: { id: "u4", name: "James Lee", initials: "JL", department: "DevOps" },
    createdAt: "2026-01-05T18:45:00Z",
    updatedAt: "2026-01-07T06:15:00Z",
    escalationLevel: 1,
    retryCount: 0,
    attachments: ["email-queue-status.png"],
    notes: ["Queue backlog identified"],
  },
  {
    id: "CMP-005",
    title: "API rate limiting errors",
    description: "Enterprise API clients hitting rate limits unexpectedly",
    severity: "high",
    status: "escalated",
    slaProgress: 92,
    slaRemaining: "45m",
    slaDuration: 8,
    category: "API",
    location: {
      lat: 47.6062,
      lng: -122.3321,
      address: "555 Cloud Way, Seattle, WA",
      region: "West",
    },
    assignee: { id: "u1", name: "Sarah Chen", initials: "SC", department: "Technical Support" },
    createdAt: "2026-01-06T22:00:00Z",
    updatedAt: "2026-01-07T11:15:00Z",
    escalationLevel: 3,
    retryCount: 2,
    attachments: ["api-metrics.json"],
    notes: ["Rate limit configuration reviewed", "Temporary increase applied"],
  },
  {
    id: "CMP-006",
    title: "Database connection pool exhaustion",
    description: "Production database running out of connections during peak hours",
    severity: "critical",
    status: "in-progress",
    slaProgress: 70,
    slaRemaining: "1h 12m",
    slaDuration: 4,
    category: "Infrastructure",
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "100 DB Lane, San Francisco, CA",
      region: "West",
    },
    assignee: { id: "u5", name: "Alex Kumar", initials: "AK", department: "DBA Team" },
    createdAt: "2026-01-07T08:00:00Z",
    updatedAt: "2026-01-07T10:48:00Z",
    escalationLevel: 2,
    retryCount: 0,
    attachments: [],
    notes: ["Scaling connection pool"],
  },
];

// Escalations data
export const escalations: Escalation[] = [
  {
    id: "ESC-001",
    complaintId: "CMP-001",
    complaintTitle: "Payment gateway timeout issues",
    level: 3,
    status: "active",
    retryCount: 0,
    maxRetries: 3,
    assignedTo: "Department Head",
    department: "Technical Support",
    createdAt: "2026-01-06T10:00:00Z",
  },
  {
    id: "ESC-002",
    complaintId: "CMP-005",
    complaintTitle: "API rate limiting errors",
    level: 3,
    status: "active",
    retryCount: 2,
    maxRetries: 3,
    assignedTo: "VP Engineering",
    department: "Engineering",
    createdAt: "2026-01-07T09:00:00Z",
  },
  {
    id: "ESC-003",
    complaintId: "CMP-002",
    complaintTitle: "User authentication failures",
    level: 2,
    status: "pending",
    retryCount: 1,
    maxRetries: 3,
    assignedTo: "Security Lead",
    department: "Security Team",
    createdAt: "2026-01-07T06:00:00Z",
  },
  {
    id: "ESC-004",
    complaintId: "CMP-007",
    complaintTitle: "Webhook delivery failures",
    level: 2,
    status: "failed",
    retryCount: 3,
    maxRetries: 3,
    assignedTo: "Integration Team Lead",
    department: "Integrations",
    createdAt: "2026-01-05T14:00:00Z",
    failReason: "Endpoint unreachable after 3 retry attempts",
  },
  {
    id: "ESC-005",
    complaintId: "CMP-006",
    complaintTitle: "Database connection pool exhaustion",
    level: 2,
    status: "active",
    retryCount: 0,
    maxRetries: 3,
    assignedTo: "DBA Lead",
    department: "DBA Team",
    createdAt: "2026-01-07T09:30:00Z",
  },
];

// Officers/staff performance data
export const officers: Officer[] = [
  { id: "u1", name: "Sarah Chen", department: "Technical Support", resolvedCount: 145, pendingCount: 8, averageResolutionTime: 3.2, slaCompliance: 94, performance: "excellent" },
  { id: "u2", name: "Mike Ross", department: "Security Team", resolvedCount: 98, pendingCount: 12, averageResolutionTime: 5.8, slaCompliance: 88, performance: "good" },
  { id: "u3", name: "Emma Wilson", department: "Engineering", resolvedCount: 76, pendingCount: 5, averageResolutionTime: 4.1, slaCompliance: 91, performance: "good" },
  { id: "u4", name: "James Lee", department: "DevOps", resolvedCount: 112, pendingCount: 3, averageResolutionTime: 2.8, slaCompliance: 96, performance: "excellent" },
  { id: "u5", name: "Alex Kumar", department: "DBA Team", resolvedCount: 67, pendingCount: 15, averageResolutionTime: 6.5, slaCompliance: 78, performance: "average" },
  { id: "u6", name: "Lisa Park", department: "Customer Success", resolvedCount: 203, pendingCount: 22, averageResolutionTime: 4.2, slaCompliance: 85, performance: "good" },
];

// Default policy rules
export const policyRules: PolicyRule[] = [
  {
    id: "policy-critical",
    severity: "critical",
    slaDuration: 4,
    escalationLevels: [
      { level: 1, title: "Agent Assigned", department: "L1 Support", timeThreshold: 0 },
      { level: 2, title: "Supervisor Review", department: "L2 Support", timeThreshold: 1 },
      { level: 3, title: "Department Head", department: "Management", timeThreshold: 2 },
      { level: 4, title: "Executive Review", department: "C-Suite", timeThreshold: 3 },
    ],
  },
  {
    id: "policy-high",
    severity: "high",
    slaDuration: 12,
    escalationLevels: [
      { level: 1, title: "Agent Assigned", department: "L1 Support", timeThreshold: 0 },
      { level: 2, title: "Supervisor Review", department: "L2 Support", timeThreshold: 4 },
      { level: 3, title: "Department Head", department: "Management", timeThreshold: 8 },
    ],
  },
  {
    id: "policy-medium",
    severity: "medium",
    slaDuration: 24,
    escalationLevels: [
      { level: 1, title: "Agent Assigned", department: "L1 Support", timeThreshold: 0 },
      { level: 2, title: "Supervisor Review", department: "L2 Support", timeThreshold: 12 },
    ],
  },
  {
    id: "policy-low",
    severity: "low",
    slaDuration: 48,
    escalationLevels: [
      { level: 1, title: "Agent Assigned", department: "L1 Support", timeThreshold: 0 },
    ],
  },
];

// Map hotspots for heatmap/visualization - India locations
export const mapHotspots: MapHotspot[] = [
  { id: "h1", lat: 28.6139, lng: 77.2090, complaintCount: 58, severity: "critical", region: "Delhi NCR", slaCompliance: 72 },
  { id: "h2", lat: 19.0760, lng: 72.8777, complaintCount: 45, severity: "high", region: "Mumbai", slaCompliance: 78 },
  { id: "h3", lat: 13.0827, lng: 80.2707, complaintCount: 32, severity: "medium", region: "Chennai", slaCompliance: 85 },
  { id: "h4", lat: 22.5726, lng: 88.3639, complaintCount: 28, severity: "high", region: "Kolkata", slaCompliance: 81 },
  { id: "h5", lat: 12.9716, lng: 77.5946, complaintCount: 42, severity: "critical", region: "Bangalore", slaCompliance: 74 },
  { id: "h6", lat: 17.3850, lng: 78.4867, complaintCount: 35, severity: "medium", region: "Hyderabad", slaCompliance: 88 },
  { id: "h7", lat: 23.0225, lng: 72.5714, complaintCount: 22, severity: "low", region: "Ahmedabad", slaCompliance: 92 },
  { id: "h8", lat: 26.9124, lng: 75.7873, complaintCount: 18, severity: "medium", region: "Jaipur", slaCompliance: 89 },
  { id: "h9", lat: 21.1702, lng: 72.8311, complaintCount: 15, severity: "low", region: "Surat", slaCompliance: 94 },
  { id: "h10", lat: 18.5204, lng: 73.8567, complaintCount: 38, severity: "high", region: "Pune", slaCompliance: 82 },
  { id: "h11", lat: 26.8467, lng: 80.9462, complaintCount: 25, severity: "medium", region: "Lucknow", slaCompliance: 86 },
  { id: "h12", lat: 30.7333, lng: 76.7794, complaintCount: 20, severity: "low", region: "Chandigarh", slaCompliance: 91 },
];

// Analytics trend data
export const trendData = [
  { date: "Jan 1", complaints: 42, escalations: 8, resolved: 38, slaCompliance: 91 },
  { date: "Jan 2", complaints: 55, escalations: 12, resolved: 48, slaCompliance: 87 },
  { date: "Jan 3", complaints: 48, escalations: 6, resolved: 52, slaCompliance: 93 },
  { date: "Jan 4", complaints: 70, escalations: 18, resolved: 45, slaCompliance: 82 },
  { date: "Jan 5", complaints: 61, escalations: 14, resolved: 58, slaCompliance: 85 },
  { date: "Jan 6", complaints: 52, escalations: 9, resolved: 55, slaCompliance: 89 },
  { date: "Jan 7", complaints: 45, escalations: 7, resolved: 49, slaCompliance: 92 },
];

// KPI summary data
export const kpiData = {
  totalComplaints: 1284,
  activeComplaints: 156,
  escalatedCount: 24,
  resolvedCount: 1104,
  slaCompliance: 86.5,
  avgResolutionTime: 4.2,
  monthlyChange: {
    complaints: 12,
    active: -8,
    escalated: 3,
    resolved: 15,
  },
};

// Severity distribution
export const severityDistribution = [
  { name: "Critical", value: 12, color: "hsl(0 72% 55%)" },
  { name: "High", value: 28, color: "hsl(38 92% 50%)" },
  { name: "Medium", value: 45, color: "hsl(160 84% 44%)" },
  { name: "Low", value: 35, color: "hsl(215 20% 55%)" },
];

// Category distribution
export const categoryDistribution = [
  { name: "Technical", count: 42 },
  { name: "Security", count: 28 },
  { name: "Performance", count: 35 },
  { name: "API", count: 22 },
  { name: "Infrastructure", count: 18 },
  { name: "Communication", count: 11 },
];
