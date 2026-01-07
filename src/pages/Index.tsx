import { 
  FileWarning, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2 
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { ComplaintsTable } from "@/components/dashboard/ComplaintsTable";
import { EscalationTimeline } from "@/components/dashboard/EscalationTimeline";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Total Complaints"
            value="1,284"
            change="+12% from last month"
            changeType="neutral"
            icon={FileWarning}
            progress={100}
            variant="default"
          />
          <OverviewCard
            title="Active Complaints"
            value="156"
            change="-8% from yesterday"
            changeType="positive"
            icon={AlertCircle}
            progress={68}
            variant="primary"
          />
          <OverviewCard
            title="Escalated"
            value="24"
            change="+3 new escalations"
            changeType="negative"
            icon={TrendingUp}
            progress={85}
            variant="warning"
          />
          <OverviewCard
            title="Resolved"
            value="1,104"
            change="86% resolution rate"
            changeType="positive"
            icon={CheckCircle2}
            progress={86}
            variant="primary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Complaints Table - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ComplaintsTable />
          </div>

          {/* Escalation Timeline - Takes 1 column */}
          <div>
            <EscalationTimeline />
          </div>
        </div>

        {/* Analytics Section */}
        <AnalyticsCharts />
      </div>
    </DashboardLayout>
  );
};

export default Index;
