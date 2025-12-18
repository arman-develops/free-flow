"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/associate"

interface TaskOverviewProps {
  task: Task
  status: { label: string; color?: string }
  priority: { label: string; color?: string }
}

export function TaskOverview({ task, status, priority }: TaskOverviewProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Description */}
      <div>
        <h3 className="font-semibold text-foreground mb-2">Description</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {task.description || "No description provided."}
        </p>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Task Details */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Task Details</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs mb-1">Status</p>
            <p className={cn("font-medium text-foreground")}>{status.label}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs mb-1">Priority</p>
            <p className={cn("font-medium text-foreground")}>{priority.label}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs mb-1">Assigned By</p>
            <p className="font-medium text-foreground">
              {task.assignedBy || "Not specified"}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-xs mb-1">Project</p>
            <p className="font-medium text-foreground truncate">
              {task.projectName || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
