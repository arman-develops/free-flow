"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  MessageSquare,
  FileUp,
  CheckCircle2,
  AlertTriangle,
  Download,
  Paperclip,
  Send,
  X,
  Clock11,
  Clock2,
} from "lucide-react"
import { format, formatDistanceToNow, isPast } from "date-fns"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/associate"
import { TaskHeader } from "./task-header"
import { TaskOverview } from "./task-overview"
import TaskResources from "./task-resources"
import TaskDeliverables from "./task-deliverables"
import TaskActivityLog from "./task-activity-log"
import TaskMessages from "./task-messages"

interface TaskDetailPanelProps {
  task: Task | null
  onClose: () => void
}

const statusConfig = {
  todo: { label: "To Do", color: "bg-muted text-muted-foreground" },
  "in_progress": { label: "In Progress", color: "bg-info/10 text-info" },
  review: { label: "Review", color: "bg-warning/10 text-warning" },
  completed: { label: "Completed", color: "bg-success/10 text-success" },
  blocked: { label: "Blocked", color: "bg-destructive/10 text-destructive" },
}

const priorityConfig = {
  low: { label: "Low", color: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", color: "bg-info/10 text-info" },
  high: { label: "High", color: "bg-warning/10 text-warning" },
  urgent: { label: "Urgent", color: "bg-destructive/10 text-destructive" },
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!task) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select a task to view details</p>
      </div>
    )
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate))
  const daysUntilDue = task.dueDate ? formatDistanceToNow(new Date(task.dueDate), { addSuffix: true }) : null

  return (
    <div className="flex flex-col h-full bg-background">
      <TaskHeader
        task={task}
        onClose={onClose}
        status={status}
        priority={priority}
        isOverdue={isOverdue}
        daysUntilDue={daysUntilDue}
      />
      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-border px-4">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 rounded-none">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Resources
            </TabsTrigger>
            <TabsTrigger
              value="deliverables"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Deliverables
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Messages
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          {/* Overview Tab */}
          <TabsContent value="overview" className="m-0">
            <TaskOverview task={task} status={status} priority={priority} />
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <TaskResources attachments={task.attachments} />
          </TabsContent>

          {/* Deliverables Tab */}
          <TabsContent value="deliverables">
            <TaskDeliverables />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <TaskActivityLog
              activities={[
                { type: "status", text: "Status changed to In Progress", time: "2 hours ago" },
                { type: "comment", text: "New comment added", time: "5 hours ago" },
                { type: "created", text: "Task created", time: "1 day ago" },
              ]}
            />
            </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <TaskMessages
              initialMessages={[
                { author: "Client", text: "Please ensure the design is responsive", time: "3 hours ago", isOwn: false },
                { author: "You", text: "Will do! I'll test on all devices.", time: "2 hours ago", isOwn: true },
              ]}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
