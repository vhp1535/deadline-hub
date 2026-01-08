import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Timeline, TimelineStep } from "@/components/ui/Timeline";
import { policyRules as initialRules } from "@/data/mockData";
import { Save, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const severityColors: Record<string, string> = {
  critical: "bg-destructive",
  high: "bg-warning",
  medium: "bg-primary",
  low: "bg-muted",
};

export default function Settings() {
  const [rules, setRules] = useState(initialRules);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  
  const updateSLA = (id: string, hours: number) => {
    setRules(r => r.map(rule => rule.id === id ? { ...rule, slaDuration: hours } : rule));
  };

  const toggleExpand = (id: string) => {
    setExpandedRule(expandedRule === id ? null : id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">Policy Builder</h2>
            <p className="text-sm text-muted-foreground">Configure SLA and escalation policies</p>
          </div>
          <Button className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Policy Cards */}
        <div className="grid gap-4">
          {rules.map((rule) => {
            const isExpanded = expandedRule === rule.id;
            
            return (
              <div key={rule.id} className="glass-card overflow-hidden">
                {/* Header */}
                <div 
                  className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-secondary/30 transition-colors"
                  onClick={() => toggleExpand(rule.id)}
                >
                  <div className="flex items-center gap-3">
                    <Badge className={cn("uppercase text-xs", severityColors[rule.severity])}>
                      {rule.severity}
                    </Badge>
                    <span className="text-foreground font-medium text-sm sm:text-base">Severity Policy</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Desktop SLA Input */}
                    <div className="hidden sm:flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <span className="text-sm text-muted-foreground">SLA:</span>
                      <Input 
                        type="number" 
                        value={rule.slaDuration} 
                        onChange={(e) => updateSLA(rule.id, parseInt(e.target.value))} 
                        className="w-16 h-8 text-center" 
                      />
                      <span className="text-sm text-muted-foreground">hours</span>
                    </div>
                    
                    {/* Mobile: Just show SLA value */}
                    <span className="text-sm text-muted-foreground sm:hidden">
                      {rule.slaDuration}h SLA
                    </span>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="border-t border-border p-4 sm:p-6 bg-secondary/10">
                    {/* Mobile SLA Input */}
                    <div className="flex items-center gap-2 mb-4 sm:hidden">
                      <span className="text-sm text-muted-foreground">SLA Duration:</span>
                      <Input 
                        type="number" 
                        value={rule.slaDuration} 
                        onChange={(e) => updateSLA(rule.id, parseInt(e.target.value))} 
                        className="w-20 h-8 text-center" 
                      />
                      <span className="text-sm text-muted-foreground">hours</span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">Escalation Chain</p>
                    
                    {/* Desktop: Horizontal Timeline */}
                    <div className="hidden md:block overflow-x-auto pb-2">
                      <Timeline 
                        orientation="horizontal" 
                        compact 
                        steps={rule.escalationLevels.map((lvl, i) => ({
                          id: `${rule.id}-${lvl.level}`,
                          title: `L${lvl.level}: ${lvl.title}`,
                          description: `${lvl.department} • ${lvl.timeThreshold}h`,
                          status: i === 0 ? "current" : "pending" as TimelineStep["status"],
                        }))} 
                      />
                    </div>

                    {/* Mobile: Vertical Timeline */}
                    <div className="md:hidden">
                      <Timeline 
                        orientation="vertical" 
                        compact 
                        steps={rule.escalationLevels.map((lvl, i) => ({
                          id: `${rule.id}-${lvl.level}`,
                          title: `L${lvl.level}: ${lvl.title}`,
                          description: `${lvl.department} • ${lvl.timeThreshold}h`,
                          status: i === 0 ? "current" : "pending" as TimelineStep["status"],
                        }))} 
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
