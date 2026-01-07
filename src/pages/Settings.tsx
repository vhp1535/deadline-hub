import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Timeline, TimelineStep } from "@/components/ui/Timeline";
import { policyRules as initialRules } from "@/data/mockData";
import { Save, Plus } from "lucide-react";

export default function Settings() {
  const [rules, setRules] = useState(initialRules);
  
  const updateSLA = (id: string, hours: number) => {
    setRules(r => r.map(rule => rule.id === id ? { ...rule, slaDuration: hours } : rule));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Policy Builder</h2>
            <p className="text-muted-foreground">Configure SLA and escalation policies</p>
          </div>
          <Button><Save className="h-4 w-4 mr-2" />Save Changes</Button>
        </div>
        <div className="grid gap-6">
          {rules.map((rule) => (
            <div key={rule.id} className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Badge className={
                    rule.severity === "critical" ? "bg-destructive" :
                    rule.severity === "high" ? "bg-warning" :
                    rule.severity === "medium" ? "bg-primary" : "bg-muted"
                  }>{rule.severity.toUpperCase()}</Badge>
                  <span className="text-foreground font-medium">Severity Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">SLA Duration:</span>
                  <Input type="number" value={rule.slaDuration} onChange={(e) => updateSLA(rule.id, parseInt(e.target.value))} className="w-20 h-8" />
                  <span className="text-sm text-muted-foreground">hours</span>
                </div>
              </div>
              <div className="pl-4">
                <p className="text-sm text-muted-foreground mb-4">Escalation Chain</p>
                <Timeline orientation="horizontal" compact steps={rule.escalationLevels.map((lvl, i) => ({
                  id: `${rule.id}-${lvl.level}`,
                  title: `L${lvl.level}: ${lvl.title}`,
                  description: `${lvl.department} • ${lvl.timeThreshold}h`,
                  status: i === 0 ? "current" : "pending" as TimelineStep["status"],
                }))} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
