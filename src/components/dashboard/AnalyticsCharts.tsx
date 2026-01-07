import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const lineData = [
  { name: "Mon", complaints: 45, escalations: 8 },
  { name: "Tue", complaints: 52, escalations: 12 },
  { name: "Wed", complaints: 48, escalations: 6 },
  { name: "Thu", complaints: 70, escalations: 18 },
  { name: "Fri", complaints: 61, escalations: 14 },
  { name: "Sat", complaints: 35, escalations: 5 },
  { name: "Sun", complaints: 28, escalations: 3 },
];

const pieData = [
  { name: "Critical", value: 12, color: "hsl(0 72% 51%)" },
  { name: "High", value: 28, color: "hsl(38 92% 50%)" },
  { name: "Medium", value: 45, color: "hsl(174 72% 40%)" },
  { name: "Low", value: 35, color: "hsl(240 10% 40%)" },
];

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Line Chart */}
      <div className="glass-card p-5 animate-fade-in">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-foreground">Trends Overview</h3>
          <p className="text-sm text-muted-foreground">Complaints vs Escalations this week</p>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 18%)" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(215 20% 55%)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(215 20% 55%)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(240 10% 10%)",
                  border: "1px solid hsl(240 10% 18%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px -4px hsl(0 0% 0% / 0.5)",
                }}
                labelStyle={{ color: "hsl(210 20% 98%)" }}
              />
              <Line
                type="monotone"
                dataKey="complaints"
                stroke="hsl(174 72% 40%)"
                strokeWidth={2}
                dot={{ fill: "hsl(174 72% 40%)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(174 72% 40%)", strokeWidth: 2, fill: "hsl(240 10% 4%)" }}
              />
              <Line
                type="monotone"
                dataKey="escalations"
                stroke="hsl(38 92% 50%)"
                strokeWidth={2}
                dot={{ fill: "hsl(38 92% 50%)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(38 92% 50%)", strokeWidth: 2, fill: "hsl(240 10% 4%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Complaints</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-warning" />
            <span className="text-sm text-muted-foreground">Escalations</span>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="glass-card p-5 animate-fade-in">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-foreground">Severity Distribution</h3>
          <p className="text-sm text-muted-foreground">Breakdown by complaint severity</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="h-64 w-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(240 10% 10%)",
                    border: "1px solid hsl(240 10% 18%)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name}: <span className="text-foreground font-medium">{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
