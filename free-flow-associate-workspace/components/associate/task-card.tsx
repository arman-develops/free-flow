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
import { Calendar, Clock, MoreVertical, Play, Pause, MessageSquare, Paperclip } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/associate"

interface TaskCardProps {
  task: Task
}

const statusConfig = {
  todo: { label: "To Do", color: "bg-muted text-muted-foreground" },
  "in-progress": { label: "In Progress", color: "bg-info/10 text-info" },
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

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, startTimer, stopTimer, activeTimeEntry } = useTaskStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const isTimerActive = activeTimeEntry?.taskId === task.id

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
    <Card className={cn("border-l-4 transition-all hover:shadow-md", priority.color)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {task.title}
                </h3>
                <Badge variant="outline" className={cn("text-xs", status.color)}>
                  {status.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{task.projectName}</span>
                <span>•</span>
                <span>{task.clientName}</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>Start Working</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("review")}>Submit for Review</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("completed")}>Mark Complete</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange("blocked")}>Mark as Blocked</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description (when expanded) */}
          {isExpanded && task.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {task.dueDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(task.dueDate), "MMM dd")}</span>
                </div>
              )}
              {task.estimatedHours && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{task.estimatedHours}h</span>
                </div>
              )}
              {task.comments.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  <span>{task.comments.length}</span>
                </div>
              )}
              {task.attachments.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Paperclip className="h-4 w-4" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
            </div>

            <Button
              variant={isTimerActive ? "destructive" : "outline"}
              size="sm"
              onClick={handleToggleTimer}
              className="gap-2"
            >
              {isTimerActive ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  Stop Timer
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Start Timer
                </>
              )}
            </Button>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {task.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
