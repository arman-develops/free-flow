"use client"

import { useTaskStore } from "@/stores/task-store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "blocked", label: "Blocked" },
]

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

export function TaskFilters() {
  const { statusFilter, priorityFilter, setStatusFilter, setPriorityFilter, clearFilters } = useTaskStore()

  const handleStatusToggle = (value: string) => {
    if (statusFilter.includes(value)) {
      setStatusFilter(statusFilter.filter((s) => s !== value))
    } else {
      setStatusFilter([...statusFilter, value])
    }
  }

  const handlePriorityToggle = (value: string) => {
    if (priorityFilter.includes(value)) {
      setPriorityFilter(priorityFilter.filter((p) => p !== value))
    } else {
      setPriorityFilter([...priorityFilter, value])
    }
  }

  const hasActiveFilters = statusFilter.length > 0 || priorityFilter.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-1">
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Status</Label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={statusFilter.includes(option.value)}
                  onCheckedChange={() => handleStatusToggle(option.value)}
                />
                <Label htmlFor={`status-${option.value}`} className="text-sm font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Priority</Label>
          <div className="space-y-2">
            {priorityOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`priority-${option.value}`}
                  checked={priorityFilter.includes(option.value)}
                  onCheckedChange={() => handlePriorityToggle(option.value)}
                />
                <Label htmlFor={`priority-${option.value}`} className="text-sm font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
