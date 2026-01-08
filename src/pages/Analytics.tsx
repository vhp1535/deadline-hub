import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KPICard } from "@/components/ui/KPICard";
import { LineChartWrapper, BarChartWrapper, DonutChartWrapper } from "@/components/ui/ChartWrapper";
import { Button } from "@/components/ui/button";
import { trendData, officers, severityDistribution, kpiData } from "@/data/mockData";
import { TrendingUp, Users, Clock, Download } from "lucide-react";

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">Analytics</h2>
            <p className="text-sm text-muted-foreground">Performance metrics and trends</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <KPICard 
            title="SLA Compliance" 
            value={`${kpiData.slaCompliance}%`} 
            change="from last month" 
            changeType="positive" 
            changeValue={2.3} 
            icon={TrendingUp} 
            variant="success" 
          />
          <KPICard 
            title="Avg Resolution Time" 
            value={`${kpiData.avgResolutionTime}h`} 
            change="improvement" 
            changeType="positive" 
            changeValue={-12} 
            icon={Clock} 
            variant="primary" 
          />
          <KPICard 
            title="Active Officers" 
            value={officers.length.toString()} 
            change="on duty" 
            changeType="neutral" 
            icon={Users} 
            variant="default" 
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <div className="glass-card p-4 sm:p-5">
            <h3 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">Trend Intelligence</h3>
            <div className="h-56 sm:h-64 lg:h-72">
              <LineChartWrapper 
                data={trendData} 
                xAxisKey="date" 
                lines={[
                  { dataKey: "complaints", color: "hsl(160 84% 44%)", name: "Complaints" },
                  { dataKey: "escalations", color: "hsl(38 92% 50%)", name: "Escalations" },
                ]} 
                height="100%" 
              />
            </div>
          </div>
          <div className="glass-card p-4 sm:p-5">
            <h3 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">Severity Distribution</h3>
            <div className="h-56 sm:h-64 lg:h-72 flex items-center justify-center">
              <DonutChartWrapper data={severityDistribution} height={200} />
            </div>
          </div>
        </div>

        {/* Officer Performance */}
        <div className="glass-card p-4 sm:p-5">
          <h3 className="text-base font-semibold mb-3 sm:text-lg sm:mb-4">Officer Performance</h3>
          <div className="h-64 sm:h-80">
            <BarChartWrapper 
              data={officers.map(o => ({ 
                name: o.name.split(' ')[0], // First name only for mobile
                resolved: o.resolvedCount, 
                pending: o.pendingCount 
              }))} 
              xAxisKey="name" 
              bars={[
                { dataKey: "resolved", color: "hsl(160 84% 44%)", name: "Resolved" },
                { dataKey: "pending", color: "hsl(38 92% 50%)", name: "Pending" },
              ]} 
              height="100%" 
              showLegend 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
