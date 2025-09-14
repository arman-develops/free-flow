"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, User, ArrowRight } from "lucide-react"

const priorityTasks = [
  {
    id: 1,
    title: "Complete API documentation",
    project: "TechCorp Website",
    assignee: "Sarah Johnson",
    dueDate: "Today",
    priority: "high",
    status: "in-progress",
  },
  {
    id: 2,
    title: "Review mobile app wireframes",
    project: "StartupXYZ App",
    assignee: "Mike Chen",
    dueDate: "Tomorrow",
    priority: "high",
    status: "pending",
  },
  {
    id: 3,
    title: "Database performance optimization",
    project: "E-commerce Platform",
    assignee: "John Doe",
    dueDate: "Dec 15",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: 4,
    title: "Client presentation preparation",
    project: "Portfolio Website",
    assignee: "You",
    dueDate: "Dec 16",
    priority: "high",
    status: "not-started",
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "default"
    case "low":
      return "secondary"
    default:
      return "outline"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "in-progress":
      return "text-primary"
    case "pending":
      return "text-secondary"
    case "not-started":
      return "text-muted-foreground"
    default:
      return "text-muted-foreground"
  }
}

export function PriorityTasks() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Priority Tasks
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {priorityTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-card-foreground truncate">{task.title}</h4>
                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                  {task.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{task.project}</span>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {task.assignee}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.dueDate}
                </div>
              </div>
            </div>
            <div className={`text-xs font-medium ${getStatusColor(task.status)}`}>{task.status.replace("-", " ")}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
