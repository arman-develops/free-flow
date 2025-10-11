"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  X,
  PlusCircle,
  Circle,
  Loader,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useMutation, useQuery } from "@tanstack/react-query"
import { milestoneApi, tasksApi } from "@/lib/api"
import { queryClient } from '../../lib/query-client';
import { AddTasksToMilestoneDialog } from "./add-task-to-milestone-dialog"

interface Milestone {
  id: string
  title: string
  description: string
  status: "not_started" | "in_progress" | "completed" | "delayed"
  progress: number
  start_date: string
  due_date: string
  completed_date?: string
  tasks_count: number
  completed_tasks: number
  deliverables: string[]
  client_visible: boolean
  priority: "low" | "medium" | "high"
}

interface MilestonesViewProps {
  projectId: string
}

export function MilestonesView({ projectId }: MilestonesViewProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [isAddTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    project_id: projectId,
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    deliverables: [] as string[],
    client_visible: true,
  })
  const [deliverableInput, setDeliverableInput] = useState("")
  const [expandedMilestones, setExpandedMilestones] = useState(new Set(['1']));

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(milestoneId)) {
        newSet.delete(milestoneId);
      } else {
        newSet.add(milestoneId);
      }
      return newSet;
    });
  };

  const createMilestoneMutation = useMutation({
    mutationFn: milestoneApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["milestones"]})
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create milestone")
    },
  })

  const deleteMilestoneMutation = useMutation({
    mutationFn: (milestone_id: string) => milestoneApi.deleteMilestone(milestone_id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["milestones"]})
      console.log("deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete milestone")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] })
    },
  })

  const {
    data: MilestoneDataResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ["milestones"],
    queryFn: () => milestoneApi.milestonesByProject(projectId)
  })

  const { data: tasksResponse, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => tasksApi.getTaskByProjectID(projectId),
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
          <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
              <p className="text-red-600">Failed to load Milestones</p>
              <p className="text-sm text-muted-foreground">Please try again later</p>
              <p>{`${error}`}</p>
          </div>
          </CardContent>
      </Card>
    )
  }

  const milestones: Milestone[] = MilestoneDataResponse?.success ? MilestoneDataResponse?.data : []

  const allTasks = tasksResponse?.success ? tasksResponse.data : []
  const availableTasks = allTasks.filter((task: any) => task.milestone_id === null)
  const getTasksByMilestone = (milestone_id: string) => allTasks.filter((task: any) => task.milestone_id === milestone_id)

  const getStatusConfig = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle2,
          iconColor: "text-green-600",
        }
      case "in_progress":
        return {
          label: "In Progress",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: TrendingUp,
          iconColor: "text-blue-600",
        }
      case "delayed":
        return {
          label: "Delayed",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: AlertCircle,
          iconColor: "text-red-600",
        }
      default:
        return {
          label: "Not Started",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Clock,
          iconColor: "text-gray-600",
        }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  const getStatusDisplay = (status: string) => {
    const statusConfig:any = {
        todo: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-50', label: 'To Do' },
        'in-progress': { icon: Loader, color: 'text-blue-500', bg: 'bg-blue-50', label: 'In Progress' },
        completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', label: 'Completed' },
    };
    return statusConfig[status] || statusConfig.todo;
  };

  const getDaysUntilDeadline = (dueDate:any) => {
    if (!dueDate) return null;
    const today = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysRemaining: number) => {
    if (daysRemaining === null) return 'bg-gray-100 text-gray-600';
    if (daysRemaining < 0) return 'bg-red-100 text-red-700';
    if (daysRemaining <= 3) return 'bg-orange-100 text-orange-700';
    if (daysRemaining <= 7) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getPriorityBadge = (priority:string) => {
    const configs:any = {
      low: 'bg-blue-100 text-blue-700 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-red-100 text-red-700 border-red-200'
    };
    return configs[priority] || configs.medium;
  };

  const getUrgencyConfig = (daysRemaining:number) => {
    if (daysRemaining === null) return { color: 'text-gray-500', bg: 'bg-gray-50', label: 'No deadline' };
    if (daysRemaining < 0) return { color: 'text-red-600', bg: 'bg-red-50', label: `${Math.abs(daysRemaining)}d overdue`, urgent: true };
    if (daysRemaining === 0) return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Due today', urgent: true };
    if (daysRemaining <= 3) return { color: 'text-orange-600', bg: 'bg-orange-50', label: `${daysRemaining}d left`, urgent: true };
    if (daysRemaining <= 7) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: `${daysRemaining}d left` };
    return { color: 'text-green-600', bg: 'bg-green-50', label: `${daysRemaining}d left` };
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault()
    // API call would go here
    console.log(formData)
    createMilestoneMutation.mutate(formData)
    toast.success("Milestone created successfully!")
    setIsCreateOpen(false)
    setFormData({
      project_id: projectId,
      title: "",
      description: "",
      due_date: "",
      priority: "medium",
      deliverables: [],
      client_visible: true,
    })
  }

  const handleDeleteMilestone = (milestone_id: string) => {
    deleteMilestoneMutation.mutate(milestone_id)
  }

  const handleAddTasks = (milestone: Milestone) => {
    setSelectedMilestone(milestone)
    setIsTaskDialogOpen(true)
  }

  const addDeliverable = () => {
    if (deliverableInput.trim() && !formData.deliverables.includes(deliverableInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        deliverables: [...prev.deliverables, deliverableInput.trim()],
      }))
      setDeliverableInput("")
    }
  }

  const removeDeliverable = (deliverableToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((deliverable) => deliverable !== deliverableToRemove),
    }))
  }

  const handleDeliverableKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addDeliverable()
    }
  }

  const completedMilestones = milestones.filter((m) => m.status === "completed").length
  const totalProgress = milestones.length > 0 ? Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length) : 0

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-gray-700" />
            Project Milestones
          </h2>
          <p className="text-sm text-gray-600 mt-1">Track major deliverables and project phases</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              Create Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Milestone</DialogTitle>
              <DialogDescription>Define a major project phase or deliverable</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateMilestone} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Milestone Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Core Features Development"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this milestone aims to achieve"
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={
                      formData.due_date
                        ? new Date(formData.due_date).toISOString().split("T")[0] // show only YYYY-MM-DD
                        : ""
                    }
                    onChange={(e) => {
                      const selectedDate = e.target.value // e.g. "2025-10-23"
                      const [year, month, day] = selectedDate.split("-").map(Number)

                      // Get current local time components
                      const now = new Date()
                      const localDate = new Date(
                        year,
                        month - 1,
                        day,
                        now.getHours(),
                        now.getMinutes(),
                        now.getSeconds()
                      )

                      setFormData((prev) => ({
                        ...prev,
                        due_date: localDate.toISOString(), // preserves full local datetime
                      }))
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Deliverables *</Label>
                <div className="flex gap-2">
                  <Input
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    onKeyUp={handleDeliverableKeyPress}
                    placeholder="Add a deliverable to this milestone"
                    className="h-11 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                  <Button
                    type="button"
                    onClick={addDeliverable}
                    variant="outline"
                    size="sm"
                    className="h-11 px-3 border-gray-300 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.deliverables.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.deliverables.map((deliverable, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1"
                      >
                        {deliverable}
                        <button type="button" onClick={() => removeDeliverable(deliverable)} className="ml-1 hover:text-gray-600">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="client_visible"
                  checked={formData.client_visible}
                  onChange={(e) => setFormData((prev) => ({ ...prev, client_visible: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="client_visible" className="font-normal cursor-pointer">
                  Visible to client
                </Label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gray-900 hover:bg-gray-800">
                  Create Milestone
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Milestones</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{milestones.length}</p>
              </div>
              <Target className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{completedMilestones}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{totalProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {milestones.reduce((acc, m) => acc + m.tasks_count, 0)}
                </p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline View */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const isExpanded = expandedMilestones.has(milestone.id)
          const statusConfig = getStatusConfig(milestone.status)
          const StatusIcon = statusConfig.icon
          const milestoneTasks = getTasksByMilestone(milestone.id)

          return (
            <Card
              key={milestone.id}
              className={`border-l-4 rounded-none ${getPriorityColor(milestone.priority)} hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <StatusIcon className={`h-5 w-5 ${statusConfig.iconColor}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                        {milestone.client_visible && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Client Visible
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{milestone.description}</p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progress: {milestone.completed_tasks}/{milestone.tasks_count} tasks
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{milestone.progress}%</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>

                      {/* Deliverables */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Key Deliverables:</p>
                        <div className="flex flex-wrap gap-2">
                          {milestone?.deliverables?.map((deliverable, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700">
                              {deliverable}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Start: {new Date(milestone.start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Due: {new Date(milestone.due_date).toLocaleDateString()}</span>
                        </div>
                        {milestone.completed_date && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Completed: {new Date(milestone.completed_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {milestoneTasks.length > 0 && (
                        <button
                          onClick={() => toggleMilestone(milestone.id)}
                          className="mt-4 w-full flex items-center justify-center gap-2 mb-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm rounded-lg transition-colors border border-gray-200"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Hide {milestoneTasks.length} Tasks
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Show {milestoneTasks.length} Tasks
                            </>
                          )}
                        </button>
                      )}
                      {isExpanded && milestoneTasks.length > 0 && (
                        <div className="border-t border-gray-200 bg-gray-50">
                          <div className="divide-y divide-gray-200">
                            {milestoneTasks.map((task:any) => {
                                const daysRemaining = getDaysUntilDeadline(task.due_date);
                                const statusDisplay = getStatusDisplay(task.status);
                                const taskStatus:any = getStatusConfig(task.status);
                                const StatusIcon = statusDisplay.icon;
                                const taskDays = getDaysUntilDeadline(task.due_date);
                                const taskUrgency = getUrgencyConfig(taskDays as number);
                                return (
                                  <div key={task.id} className="p-4 hover:bg-white transition-colors">
                                    <div className="flex items-start gap-3">
                                      <div className={`h-8 w-8 rounded ${taskStatus.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                        <StatusIcon className={`h-4 w-4 ${taskStatus.color} ${taskStatus.animate ? 'animate-spin' : ''}`} />
                                      </div>                                        
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                          <h4 className="font-semibold text-gray-900 text-sm">{task.title}</h4>
                                          <div className="flex items-center gap-2 flex-shrink-0">
                                            {task.assigned_associate && (
                                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200">
                                                <Users className="h-3 w-3" />
                                                {task.assigned_associate.name}
                                              </span>
                                            )}
                                            <span className={`px-2 py-1 text-xs font-semibold rounded border ${getPriorityBadge(task.priority)}`}>
                                              {task.priority}
                                            </span>
                                          </div>
                                        </div>

                                        {task.description && (
                                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-3 text-xs">
                                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${taskStatus.bg} ${taskStatus.color} font-medium`}>
                                            {taskStatus.label}
                                          </span>
                                          
                                          {task.due_date && (
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${taskUrgency.bg} ${taskUrgency.color} font-medium`}>
                                              <Clock className="h-3 w-3" />
                                              {taskUrgency.label}
                                            </span>
                                          )}
                                          
                                          <span className="text-gray-600">
                                            <span className="font-medium text-gray-900">{task.estimated_hours}h</span> estimated
                                          </span>
                                          
                                          <span className="text-gray-600">
                                            <span className="font-medium text-gray-900">{task.actual_hours}h</span> spent
                                          </span>

                                          {task.estimated_hours > 0 && (
                                            <span className={`font-medium ${
                                              task.actual_hours > task.estimated_hours ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                              {task.actual_hours <= task.estimated_hours 
                                                ? `${((task.actual_hours / task.estimated_hours) * 100).toFixed(0)}% time used`
                                                : `${(((task.actual_hours - task.estimated_hours) / task.estimated_hours) * 100).toFixed(0)}% over budget`
                                              }
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                            })}
                          </div>
                        </div>
                        )}
                    </div>
                  </div>
                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAddTasks(milestone)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Tasks
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Milestone
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMilestone(milestone.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>                
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {milestones.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No milestones yet</h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              Create your first milestone to organize tasks into meaningful project phases and track progress
              effectively.
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-gray-900 hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Create First Milestone
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedMilestone && (
        <AddTasksToMilestoneDialog
          isOpen={isAddTaskDialogOpen}
          onClose={() => setIsTaskDialogOpen(false)}
          milestoneId={selectedMilestone.id}
          milestoneName={selectedMilestone.title}
          availableTasks={availableTasks}
        />
      )}

    </div>
  )
}
