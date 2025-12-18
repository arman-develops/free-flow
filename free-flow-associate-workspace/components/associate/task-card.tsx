"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTaskStore } from "@/stores/task-store"
import { Calendar, Clock, MoreVertical, Play, Pause, MessageSquare, AlertTriangle } from "lucide-react"
import { format, isPast } from "date-fns"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/associate"

interface TaskCardProps {
  task: Task
  isSelected?: boolean
}

const statusConfig = {
  todo: { label: "To Do", color: "bg-muted text-muted-foreground" },
  in_progress: { label: "In Progress", color: "bg-info/10 text-info" },
  review: { label: "Review", color: "bg-warning/10 text-warning" },
  completed: { label: "Completed", color: "bg-success/10 text-success" },
  blocked: { label: "Blocked", color: "bg-destructive/10 text-destructive" },
}

const priorityConfig = {
  low: { label: "Low", color: "border-muted-foreground/30" },
  medium: { label: "Medium", color: "border-info" },
  high: { label: "High", color: "border-warning" },
  urgent: { label: "Urgent", color: "border-destructive" },
}

export function TaskCard({ task, isSelected = false }: TaskCardProps) {
  const { updateTask, startTimer, stopTimer, activeTimeEntry } = useTaskStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const isTimerActive = activeTimeEntry?.taskId === task.id
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate))

  const handleStatusChange = (newStatus: Task["status"]) => {
    updateTask(task.id, { status: newStatus })
  }

  const handleToggleTimer = () => {
    if (isTimerActive) {
      stopTimer()
    } else {
      startTimer(task.id, task.title, task.projectId, task.projectName)
    }
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  return (
    <Card
      className={cn(
        "border-l-4 rounded-none transition-all hover:shadow-md cursor-pointer",
        priority.color,
        isSelected && "ring-2 ring-primary shadow-md",
      )}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">{task.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{task.projectName}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem onClick={() => handleStatusChange("in_progress")}>Start Working</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("review")}>Submit for Review</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("completed")}>Mark Complete</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange("blocked")}>Mark as Blocked</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className={cn("text-xs", status?.color)}>
              {status?.label}
            </Badge>
            {isOverdue && (
              <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                Overdue
              </Badge>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  <Calendar className="h-3 w-3" />
                  {task.dueDate ? (
                    <span>{format(new Date(task.dueDate), "MMM dd")}</span>
                  ) : <span>Not Set</span>}
                </div>
              {task.estimatedHours && (
                <div className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedHours}h</span>
                </div>
              )}
            </div>

              <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                {task.comments.length > 0 ? (
                  <span>{task.comments.length}</span>
                ) : <span>0</span>}
              </div>
          </div>

          {/* Timer Button */}
          {isExpanded && (
            <Button
              variant={isTimerActive ? "destructive" : "outline"}
              size="sm"
              onClick={handleToggleTimer}
              className="w-full gap-2 text-xs h-7"
            >
              {isTimerActive ? (
                <>
                  <Pause className="h-3 w-3" />
                  Stop Timer
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  Start Timer
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
