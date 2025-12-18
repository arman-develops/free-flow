"use client"

import { format } from "date-fns"
import { AlertTriangle, Clock2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/associate"

interface TaskHeaderProps {
  task: Task
  onClose: () => void
  status: { label: string; color: string }
  priority: { label: string; color: string }
  isOverdue: boolean | string | undefined
  daysUntilDue: string | null
}

export function TaskHeader({
  task,
  onClose,
  status,
  priority,
  isOverdue,
  daysUntilDue,
}: TaskHeaderProps) {
  return (
    <div>
      {/* Header */}
      <div className="border-b border-border p-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h2 className="text-lg font-semibold text-foreground truncate">{task.title}</h2>
            <Badge className={cn("text-xs", status.color)}>{status.label}</Badge>
            <Badge className={cn("text-xs", priority.color)}>{priority.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {task.projectName} • {task.clientName}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Urgency Banner */}
      {isOverdue ? (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 flex items-center gap-2 text-destructive text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>This task is overdue</span>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center gap-2 text-emerald-400 text-sm">
          <Clock2 className="h-4 w-4 flex-shrink-0" />
          <span>This task is on track</span>
        </div>
      )}

      {/* Quick Info Bar */}
      <div className="border-b border-border px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs mb-1">Due Date</p>
          {task.dueDate ? (
            <p className={cn("font-medium", isOverdue && "text-destructive")}>
              {format(new Date(task.dueDate), "MMM dd")}
            </p>
          ) : (
            <p className="font-medium">N/A</p>
          )}
          <p className="text-xs text-muted-foreground">{daysUntilDue}</p>
        </div>

        {task.estimatedHours && (
          <div>
            <p className="text-muted-foreground text-xs mb-1">Estimated Hours</p>
            <p className="font-medium">{task.estimatedHours}h</p>
          </div>
        )}

        <div>
          <p className="text-muted-foreground text-xs mb-1">Actual Hours</p>
          <p className="font-medium">
            {task.actualHours ? `${task.actualHours}h` : "N/A"}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs mb-1">Created</p>
          <p className="font-medium text-xs">{format(new Date(task.createdAt), "MMM dd")}</p>
        </div>
      </div>
    </div>
  )
}