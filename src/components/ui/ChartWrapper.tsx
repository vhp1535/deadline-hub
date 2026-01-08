import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Chart theme colors using CSS variables
const chartTheme = {
  grid: "hsl(220 15% 14%)",
  axis: "hsl(215 20% 55%)",
  tooltip: {
    bg: "hsl(220 20% 6%)",
    border: "hsl(220 15% 14%)",
  },
  colors: {
    primary: "hsl(160 84% 44%)",
    secondary: "hsl(215 20% 55%)",
    warning: "hsl(38 92% 50%)",
    destructive: "hsl(0 72% 55%)",
    success: "hsl(160 84% 44%)",
  },
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

interface LineChartWrapperProps {
  data: any[];
  lines: {
    dataKey: string;
    color: string;
    name?: string;
  }[];
  xAxisKey?: string;
  height?: number | string;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

export function LineChartWrapper({
  data,
  lines,
  xAxisKey = "name",
  height = 300,
  showGrid = true,
  showLegend = true,
  className,
}: LineChartWrapperProps) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke={chartTheme.axis}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={chartTheme.axis}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: line.color, strokeWidth: 2, fill: chartTheme.tooltip.bg }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface AreaChartWrapperProps {
  data: any[];
  areas: {
    dataKey: string;
    color: string;
    name?: string;
    gradient?: boolean;
  }[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  className?: string;
}

export function AreaChartWrapper({
  data,
  areas,
  xAxisKey = "name",
  height = 300,
  showGrid = true,
  className,
}: AreaChartWrapperProps) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            {areas.map((area) => (
              <linearGradient key={`gradient-${area.dataKey}`} id={`gradient-${area.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={area.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={area.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
          )}
          <XAxis
            dataKey={xAxisKey}
            stroke={chartTheme.axis}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={chartTheme.axis}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {areas.map((area) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              name={area.name || area.dataKey}
              stroke={area.color}
              strokeWidth={2}
              fill={area.gradient !== false ? `url(#gradient-${area.dataKey})` : area.color}
              fillOpacity={area.gradient !== false ? 1 : 0.1}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface BarChartWrapperProps {
  data: any[];
  bars: {
    dataKey: string;
    color: string;
    name?: string;
  }[];
  xAxisKey?: string;
  height?: number | string;
  showGrid?: boolean;
  showLegend?: boolean;
  layout?: "horizontal" | "vertical";
  className?: string;
}

export function BarChartWrapper({
  data,
  bars,
  xAxisKey = "name",
  height = 300,
  showGrid = true,
  showLegend = false,
  layout = "horizontal",
  className,
}: BarChartWrapperProps) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout={layout === "vertical" ? "vertical" : "horizontal"}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
          )}
          {layout === "vertical" ? (
            <>
              <XAxis type="number" stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey={xAxisKey} stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} width={100} />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisKey} stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DonutChartWrapperProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  className?: string;
}

export function DonutChartWrapper({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 90,
  showLegend = true,
  className,
}: DonutChartWrapperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {data.map((item) => (
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
      )}
    </div>
  );
}
