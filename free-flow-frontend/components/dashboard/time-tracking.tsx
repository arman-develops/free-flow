"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Play, Pause, Square } from "lucide-react"

const timeEntries = [
  {
    id: 1,
    project: "TechCorp Website",
    task: "API Documentation",
    timeSpent: "2h 30m",
    estimatedTime: "3h",
    status: "active",
    startTime: "09:30 AM",
  },
  {
    id: 2,
    project: "StartupXYZ App",
    task: "Mobile UI Design",
    timeSpent: "1h 45m",
    estimatedTime: "2h",
    status: "paused",
    startTime: "11:15 AM",
  },
  {
    id: 3,
    project: "E-commerce Platform",
    task: "Database Optimization",
    timeSpent: "4h 20m",
    estimatedTime: "4h",
    status: "completed",
    startTime: "08:00 AM",
  },
  {
    id: 4,
    project: "Portfolio Website",
    task: "Content Review",
    timeSpent: "45m",
    estimatedTime: "1h",
    status: "completed",
    startTime: "02:30 PM",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <Play className="h-3 w-3 text-secondary" />
    case "paused":
      return <Pause className="h-3 w-3 text-primary" />
    case "completed":
      return <Square className="h-3 w-3 text-muted-foreground" />
    default:
      return <Clock className="h-3 w-3 text-muted-foreground" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="secondary">Active</Badge>
    case "paused":
      return <Badge variant="default">Paused</Badge>
    case "completed":
      return <Badge variant="outline">Completed</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const parseTime = (timeStr: string) => {
  const parts = timeStr.split(" ")
  let totalMinutes = 0
  parts.forEach((part) => {
    if (part.includes("h")) {
      totalMinutes += Number.parseInt(part) * 60
    } else if (part.includes("m")) {
      totalMinutes += Number.parseInt(part)
    }
  })
  return totalMinutes
}

export function TimeTracking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeEntries.map((entry) => {
            const timeSpentMinutes = parseTime(entry.timeSpent)
            const estimatedMinutes = parseTime(entry.estimatedTime)
            const progressPercentage = Math.min(100, (timeSpentMinutes / estimatedMinutes) * 100)
            const isOvertime = timeSpentMinutes > estimatedMinutes

            return (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(entry.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">{entry.task}</h4>
                      {getStatusBadge(entry.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{entry.project}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Started: {entry.startTime}</span>
                      <span>
                        Time: {entry.timeSpent} / {entry.estimatedTime}
                      </span>
                      {isOvertime && <span className="text-destructive font-medium">Overtime</span>}
                    </div>
                  </div>
                </div>
                <div className="w-24">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className={`h-2 ${isOvertime ? "bg-destructive/20" : ""}`} />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
