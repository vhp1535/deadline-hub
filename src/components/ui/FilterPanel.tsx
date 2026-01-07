import { useState } from "react";
import { cn } from "@/lib/utils";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  multiSelect?: boolean;
}

interface FilterPanelProps {
  groups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, values: string[]) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FilterPanel({
  groups,
  selectedFilters,
  onFilterChange,
  onClearAll,
  className,
}: FilterPanelProps) {
  const activeFilterCount = Object.values(selectedFilters).reduce(
    (acc, values) => acc + values.length,
    0
  );

  const handleToggleFilter = (groupId: string, value: string, multiSelect = true) => {
    const currentValues = selectedFilters[groupId] || [];
    
    if (multiSelect) {
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      onFilterChange(groupId, newValues);
    } else {
      onFilterChange(groupId, currentValues.includes(value) ? [] : [value]);
    }
  };

  const removeFilter = (groupId: string, value: string) => {
    const currentValues = selectedFilters[groupId] || [];
    onFilterChange(
      groupId,
      currentValues.filter((v) => v !== value)
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {activeFilterCount}
            </Badge>
          )}
        </div>

        {groups.map((group) => (
          <DropdownMenu key={group.id}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-1.5 border-border bg-card hover:bg-secondary",
                  selectedFilters[group.id]?.length && "border-primary/50"
                )}
              >
                {group.label}
                {selectedFilters[group.id]?.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 text-xs bg-primary/20 text-primary"
                  >
                    {selectedFilters[group.id].length}
                  </Badge>
                )}
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-48 bg-card border-border"
            >
              <DropdownMenuLabel className="text-muted-foreground">
                {group.label}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {group.options.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.id}
                  checked={(selectedFilters[group.id] || []).includes(
                    option.value
                  )}
                  onCheckedChange={() =>
                    handleToggleFilter(group.id, option.value, group.multiSelect !== false)
                  }
                  className="cursor-pointer"
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        {activeFilterCount > 0 && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
            <X className="ml-1 h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {groups.map((group) =>
            (selectedFilters[group.id] || []).map((value) => {
              const option = group.options.find((o) => o.value === value);
              return (
                <Badge
                  key={`${group.id}-${value}`}
                  variant="secondary"
                  className="gap-1 bg-secondary hover:bg-secondary/80 cursor-pointer"
                  onClick={() => removeFilter(group.id, value)}
                >
                  <span className="text-muted-foreground">{group.label}:</span>
                  {option?.label || value}
                  <X className="h-3 w-3 ml-0.5" />
                </Badge>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
