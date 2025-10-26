"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Check, 
  Briefcase,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Target,
  Eye
} from "lucide-react"
import type { TaskInvite } from "@/types/associate"
import { format, differenceInDays, formatDistance } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TaskInvitePanelProps {
  taskInvite: TaskInvite
  onAccept: () => void
  onDecline: () => void
  isAccepted: boolean
  disabled?: boolean
}

const priorityConfig = {
  low: { 
    color: "text-blue-700", 
    bg: "bg-blue-50 dark:bg-blue-950/20", 
    border: "border-blue-200",
    label: "Low Priority",
    icon: TrendingUp
  },
  medium: { 
    color: "text-yellow-700", 
    bg: "bg-yellow-50 dark:bg-yellow-950/20", 
    border: "border-yellow-200",
    label: "Medium Priority",
    icon: Target
  },
  high: { 
    color: "text-orange-700", 
    bg: "bg-orange-50 dark:bg-orange-950/20", 
    border: "border-orange-200",
    label: "High Priority",
    icon: AlertCircle
  },
  urgent: { 
    color: "text-red-700", 
    bg: "bg-red-50 dark:bg-red-950/20", 
    border: "border-red-200",
    label: "Urgent",
    icon: AlertCircle
  },
}

export function TaskInvitePanel({ taskInvite, onAccept, onDecline, isAccepted, disabled }: TaskInvitePanelProps) {
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeclining, setIsDeclining] = useState(false)
  const [showAllResponsibilities, setShowAllResponsibilities] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    onAccept()
    setIsAccepting(false)
  }

  const handleDecline = async () => {
    setIsDeclining(true)
    onDecline()
    setIsDeclining(false)
  }

  const priority = priorityConfig[taskInvite.priority]
  const PriorityIcon = priority.icon

  // Calculate deadline proximity
  const daysUntilDeadline = taskInvite.deadline 
    ? differenceInDays(new Date(taskInvite.deadline), new Date())
    : null

  const visibleResponsibilities = showAllResponsibilities 
    ? taskInvite.responsibilities 
    : taskInvite.responsibilities.slice(0, 3)

  return (
    <Card className={cn(
      "h-fit shadow-lg border-2",
      disabled && "opacity-60"
    )}>
      <CardHeader className="">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Task Invitation</CardTitle>
              <CardDescription>Project assignment details</CardDescription>
            </div>
          </div>
          {isAccepted && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white shadow-md">
              <Check className="h-3 w-3 mr-1" />
              Accepted
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {disabled && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Contract Acceptance Required
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-200">
                Please accept the contract first before accepting the task invitation.
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn("rounded-lg p-3 border-2 cursor-help", priority.bg, priority.border)}>
                  <div className="flex items-center gap-2 mb-1">
                    <PriorityIcon className={cn("h-4 w-4", priority.color)} />
                    <p className="text-xs text-muted-foreground font-medium">Priority</p>
                  </div>
                  <p className={cn("text-sm font-bold", priority.color)}>{priority.label}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Task urgency level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {daysUntilDeadline !== null && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "rounded-lg p-3 border-2 cursor-help",
                    daysUntilDeadline < 7 ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className={cn("h-4 w-4", daysUntilDeadline < 7 ? "text-red-600" : "text-blue-600")} />
                      <p className="text-xs text-muted-foreground font-medium">Deadline</p>
                    </div>
                    <p className={cn(
                      "text-sm font-bold",
                      daysUntilDeadline < 7 ? "text-red-600" : "text-blue-600"
                    )}>
                      {daysUntilDeadline > 0 ? `${daysUntilDeadline} days` : 'Due today'}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Time until deadline</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-muted/30 rounded-xl p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Project Details</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-3 border border-blue-200/50">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Project Name</p>
                  <p className="font-semibold text-foreground text-lg">{taskInvite.projectName}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-3 border border-green-200/50">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">Client</p>
                  <p className="font-semibold text-foreground">{taskInvite.clientName}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Role */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                Your Role
              </h3>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 rounded-xl p-4">
                <p className="font-semibold text-foreground text-lg">{taskInvite.role}</p>
              </div>
            </div>

            <Separator />

            {/* Responsibilities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Key Responsibilities
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {taskInvite.responsibilities.length} total
                </Badge>
              </div>
              <ul className="space-y-2">
                {visibleResponsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3 border hover:border-green-300 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-sm text-foreground leading-relaxed flex-1">{responsibility}</span>
                  </li>
                ))}
              </ul>
              
              {taskInvite.responsibilities.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllResponsibilities(!showAllResponsibilities)}
                  className="w-full text-xs"
                >
                  {showAllResponsibilities ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show {taskInvite.responsibilities.length - 3} More
                    </>
                  )}
                </Button>
              )}
            </div>

            <Separator />

            {/* Timeline & Effort */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Timeline & Effort</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {taskInvite.estimatedHours && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-200/50">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Estimated Hours</p>
                    <p className="font-bold text-blue-700 text-2xl">{taskInvite.estimatedHours}h</p>
                  </div>
                )}
                {taskInvite.deadline && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-200/50">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Deadline</p>
                    <p className="font-semibold text-purple-700 text-sm">
                      {format(new Date(taskInvite.deadline), "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {formatDistance(new Date(taskInvite.deadline), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamp */}
            <div className="pt-4 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
              <span>Invitation sent on {format(new Date(taskInvite.createdAt), "MMMM dd, yyyy 'at' h:mm a")}</span>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {!isAccepted && !disabled && (
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
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
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg"
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

        {/* Disabled State Message */}
        {disabled && (
          <div className="text-center text-sm text-muted-foreground pt-2 pb-1">
            <Eye className="h-4 w-4 inline-block mr-1" />
            Review mode - Accept contract to enable actions
          </div>
        )}
      </CardContent>
    </Card>
  )
}