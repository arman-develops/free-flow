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
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Milestone {
  id: string
  title: string
  description: string
  status: "not_started" | "in_progress" | "completed" | "delayed"
  progress: number
  startDate: string
  dueDate: string
  completedDate?: string
  tasksCount: number
  completedTasks: number
  deliverables: string[]
  clientVisible: boolean
  priority: "low" | "medium" | "high"
}

interface MilestonesViewProps {
  projectId: string
}

export function MilestonesView({ projectId }: MilestonesViewProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    clientVisible: true,
  })

  // Mock data - replace with actual API call
  const milestones: Milestone[] = [
    {
      id: "1",
      title: "Project Foundation & Setup",
      description: "Initial project setup, requirements gathering, and architecture design",
      status: "completed",
      progress: 100,
      startDate: "2024-11-01",
      dueDate: "2024-11-15",
      completedDate: "2024-11-14",
      tasksCount: 8,
      completedTasks: 8,
      deliverables: ["Project charter", "Technical architecture", "Development environment"],
      clientVisible: true,
      priority: "high",
    },
    {
      id: "2",
      title: "Core Features Development",
      description: "Develop main application features and user interface components",
      status: "in_progress",
      progress: 65,
      startDate: "2024-11-16",
      dueDate: "2024-12-20",
      tasksCount: 15,
      completedTasks: 10,
      deliverables: ["User authentication", "Dashboard UI", "Data management system"],
      clientVisible: true,
      priority: "high",
    },
    {
      id: "3",
      title: "Integration & Testing",
      description: "Third-party integrations, comprehensive testing, and bug fixes",
      status: "not_started",
      progress: 0,
      startDate: "2024-12-21",
      dueDate: "2025-01-10",
      tasksCount: 12,
      completedTasks: 0,
      deliverables: ["API integrations", "Test reports", "Bug fixes documentation"],
      clientVisible: true,
      priority: "medium",
    },
    {
      id: "4",
      title: "Deployment & Launch",
      description: "Production deployment, monitoring setup, and client training",
      status: "not_started",
      progress: 0,
      startDate: "2025-01-11",
      dueDate: "2025-01-25",
      tasksCount: 6,
      completedTasks: 0,
      deliverables: ["Production deployment", "User documentation", "Training materials"],
      clientVisible: true,
      priority: "high",
    },
  ]

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

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault()
    // API call would go here
    toast.success("Milestone created successfully!")
    setIsCreateOpen(false)
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      clientVisible: true,
    })
  }

  const handleViewDetails = (milestone: Milestone) => {
    setSelectedMilestone(milestone)
    setIsDetailOpen(true)
  }

  const completedMilestones = milestones.filter((m) => m.status === "completed").length
  const totalProgress = Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length)

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
                    value={formData.dueDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
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
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="clientVisible"
                  checked={formData.clientVisible}
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientVisible: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="clientVisible" className="font-normal cursor-pointer">
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
                  {milestones.reduce((acc, m) => acc + m.tasksCount, 0)}
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
          const statusConfig = getStatusConfig(milestone.status)
          const StatusIcon = statusConfig.icon

          return (
            <Card
              key={milestone.id}
              className={`border-l-4 ${getPriorityColor(milestone.priority)} hover:shadow-md transition-shadow`}
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
                        {milestone.clientVisible && (
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
                            Progress: {milestone.completedTasks}/{milestone.tasksCount} tasks
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{milestone.progress}%</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>

                      {/* Deliverables */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Key Deliverables:</p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.deliverables.map((deliverable, idx) => (
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
                          <span>Start: {new Date(milestone.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                        </div>
                        {milestone.completedDate && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Completed: {new Date(milestone.completedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(milestone)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Milestone
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Connection Line to Next Milestone */}
                {index < milestones.length - 1 && (
                  <div className="ml-5 mt-4 h-8 border-l-2 border-dashed border-gray-300" />
                )}
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
    </div>
  )
}
