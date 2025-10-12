"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Briefcase, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import type { TaskInvite } from "@/types/associate"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TaskInvitePanelProps {
  taskInvite: TaskInvite
  onAccept: () => void
  onDecline: () => void
  isAccepted: boolean
  disabled?: boolean
}

const priorityConfig = {
  low: { color: "text-muted-foreground", bg: "bg-muted", label: "Low Priority" },
  medium: { color: "text-info", bg: "bg-info/10", label: "Medium Priority" },
  high: { color: "text-warning", bg: "bg-warning/10", label: "High Priority" },
  urgent: { color: "text-destructive", bg: "bg-destructive/10", label: "Urgent" },
}

export function TaskInvitePanel({ taskInvite, onAccept, onDecline, isAccepted, disabled }: TaskInvitePanelProps) {
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeclining, setIsDeclining] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onAccept()
    setIsAccepting(false)
  }

  const handleDecline = async () => {
    setIsDeclining(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onDecline()
    setIsDeclining(false)
  }

  const priority = priorityConfig[taskInvite.priority]

  return (
    <Card className={cn("h-fit", disabled && "opacity-60 pointer-events-none")}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Task Invitation</CardTitle>
              <CardDescription>Project assignment details</CardDescription>
            </div>
          </div>
          {isAccepted && (
            <Badge variant="default" className="bg-success text-success-foreground">
              <Check className="h-3 w-3 mr-1" />
              Accepted
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {disabled && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-sm text-warning-foreground">
              Please accept the contract first before accepting the task invitation.
            </p>
          </div>
        )}

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {/* Project Info */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Project Details</h3>
                <Badge variant="outline" className={cn(priority.bg, priority.color)}>
                  {priority.label}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Project Name</p>
                  <p className="font-medium text-foreground">{taskInvite.projectName}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Client</p>
                  <p className="font-medium text-foreground">{taskInvite.clientName}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Role */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Your Role</h3>
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                <p className="font-medium text-foreground">{taskInvite.role}</p>
              </div>
            </div>

            <Separator />

            {/* Responsibilities */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Responsibilities</h3>
              <ul className="space-y-2">
                {taskInvite.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Timeline & Effort */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Clock className="h-4 w-4" />
                <span>Timeline & Effort</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {taskInvite.estimatedHours && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Estimated Hours</p>
                    <p className="font-medium text-foreground">{taskInvite.estimatedHours}h</p>
                  </div>
                )}
                {taskInvite.deadline && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(taskInvite.deadline), "MMM dd, yyyy")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamp */}
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                Invitation sent on {format(new Date(taskInvite.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {!isAccepted && !disabled && (
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={handleDecline}
              disabled={isAccepting || isDeclining}
            >
              {isDeclining ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Declining...
                </>
              ) : (
                "Decline"
              )}
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleAccept}
              disabled={isAccepting || isDeclining}
            >
              {isAccepting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Accept Task
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
