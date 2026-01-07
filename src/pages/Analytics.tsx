import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KPICard } from "@/components/ui/KPICard";
import { LineChartWrapper, BarChartWrapper, DonutChartWrapper } from "@/components/ui/ChartWrapper";
import { Button } from "@/components/ui/button";
import { trendData, officers, severityDistribution, kpiData } from "@/data/mockData";
import { TrendingUp, Users, Clock, Download } from "lucide-react";

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
            <p className="text-muted-foreground">Performance metrics and trends</p>
          </div>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <KPICard title="SLA Compliance" value={`${kpiData.slaCompliance}%`} change="from last month" changeType="positive" changeValue={2.3} icon={TrendingUp} variant="success" />
          <KPICard title="Avg Resolution Time" value={`${kpiData.avgResolutionTime}h`} change="improvement" changeType="positive" changeValue={-12} icon={Clock} variant="primary" />
          <KPICard title="Active Officers" value={officers.length.toString()} change="on duty" changeType="neutral" icon={Users} variant="default" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card p-5">
            <h3 className="text-lg font-semibold mb-4">Trend Intelligence</h3>
            <LineChartWrapper data={trendData} xAxisKey="date" lines={[
              { dataKey: "complaints", color: "hsl(160 84% 44%)", name: "Complaints" },
              { dataKey: "escalations", color: "hsl(38 92% 50%)", name: "Escalations" },
            ]} height={280} />
          </div>
          <div className="glass-card p-5">
            <h3 className="text-lg font-semibold mb-4">Severity Distribution</h3>
            <DonutChartWrapper data={severityDistribution} height={240} />
          </div>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold mb-4">Officer Performance</h3>
          <BarChartWrapper data={officers.map(o => ({ name: o.name, resolved: o.resolvedCount, pending: o.pendingCount }))} xAxisKey="name" bars={[
            { dataKey: "resolved", color: "hsl(160 84% 44%)", name: "Resolved" },
            { dataKey: "pending", color: "hsl(38 92% 50%)", name: "Pending" },
          ]} height={300} showLegend />
        </div>
      </div>
    </DashboardLayout>
  );
}
