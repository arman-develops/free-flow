"use client"

import type React from "react"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  FolderOpen,
  CheckSquare,
  ArrowLeft,
  Loader2,
  Target,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  FileText,
  UserCheck,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { projectsApi, tasksApi } from "@/lib/api"
import { toast } from "sonner"
import { DetailPanel } from "@/components/dashboard/details-panel"
import { EnhancedTasksView } from "@/components/dashboard/enhanced-tasks-view"
import { MilestonesView } from "@/components/dashboard/milestones-view"
import AssociatesAssignedView from "@/components/dashboard/associates-assigned-view"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const projectId = params.id as string

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("tasks")
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    estimated_hours: "",
  })

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getProjectByID(projectId),
  })

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => tasksApi.getTaskByProjectID(projectId),
  })

  const createTaskMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      toast.success("Task created successfully!")
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] })
      setIsCreateTaskOpen(false)
      setTaskFormData({ title: "", description: "", estimated_hours: "" })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create task")
    },
  })

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    createTaskMutation.mutate({
      ...taskFormData,
      project_id: projectId,
      estimated_hours: Number.parseInt(taskFormData.estimated_hours),
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "active":
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "proposal":
      case "inquiry":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
      case "on_hold":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleTaskClick = (task: any) => {
    window.dispatchEvent(
      new CustomEvent("openDetailPanel", {
        detail: {type: "task", data: task}
      })
    )
  }

  const taskStats = {
    total: tasks?.data?.length || 0,
    completed: tasks?.data?.filter((t: any) => t.status === "done" || t.status === "completed").length || 0,
    inProgress: tasks?.data?.filter((t: any) => t.status === "in_progress").length || 0,
    todo: tasks?.data?.filter((t: any) => t.status === "todo").length || 0,
  }

  const completionRate = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0

  if (projectLoading) {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-gray-700" />
            {project?.data?.name}
          </h1>
          <p className="text-gray-600 text-sm mt-1">{project?.data?.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(project?.data?.status || "active")} border`}>
            {project?.data?.status || "active"}
          </Badge>
          <Badge className={`${getPriorityColor(project?.data?.priority || "medium")} border`}>
            {project?.data?.priority || "medium"} priority
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Metrics */}
        <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Estimated Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {project?.data?.currency} {project?.data?.estimated_value?.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="space-y-2 pt-3 border-t border-emerald-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Project Valuation</span>
                <span className="font-semibold text-gray-900">
                  {project?.data?.currency} {project?.data?.actual_value?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Your Cut</span>
                <span className="font-semibold text-emerald-700">{project?.data?.your_cut_percent || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Metrics */}
        <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Project Progress</p>
                <p className="text-2xl font-bold text-gray-900">{project?.data?.progress_percent || 0}%</p>
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-blue-100">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project?.data?.progress_percent || 0}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Task Completion</span>
                <span className="font-semibold text-blue-700">{completionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Metrics */}
        <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-purple-100">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Done</p>
                <p className="text-lg font-bold text-green-600">{taskStats.completed}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Active</p>
                <p className="text-lg font-bold text-blue-600">{taskStats.inProgress}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Todo</p>
                <p className="text-lg font-bold text-gray-600">{taskStats.todo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-700" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="h-4 w-4 text-indigo-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Current Phase</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {project?.data?.current_phase || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Calendar className="h-4 w-4 text-amber-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Deadline</p>
                <p className="text-sm font-semibold text-gray-900">
                  {project?.data?.deadline ? new Date(project.data.deadline).toLocaleDateString() : "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Clock className="h-4 w-4 text-rose-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</p>
                <p className="text-sm font-semibold text-gray-900">
                  {project?.data?.created_at ? new Date(project.data.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>

            {project?.data?.completed_at && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckSquare className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Completed</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(project.data.completed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {project?.data?.notes && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Project Notes</p>
              <p className="prose prose-gray max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.data.notes || "_No notes yet_"}
                </ReactMarkdown>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-[800px] grid-cols-4">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="associates" className="flex items-center gap-2">
              <UserCheck className="h4 w-4" />
              Associates
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <FileText className="h4 w-4" />
              Contracts
            </TabsTrigger>
          </TabsList>

          {activeTab === "tasks" && (
            <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Add a new task to this project</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      value={taskFormData.title}
                      onChange={(e) => setTaskFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title"
                      required
                      className="border-gray-300 focus:border-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={taskFormData.description}
                      onChange={(e) => setTaskFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the task"
                      required
                      className="border-gray-300 focus:border-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_hours">Estimated Hours *</Label>
                    <Input
                      id="estimated_hours"
                      type="number"
                      value={taskFormData.estimated_hours}
                      onChange={(e) => setTaskFormData((prev) => ({ ...prev, estimated_hours: e.target.value }))}
                      placeholder="0"
                      required
                      className="border-gray-300 focus:border-gray-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateTaskOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createTaskMutation.isPending}
                      className="flex-1 bg-gray-900 hover:bg-gray-800"
                    >
                      {createTaskMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Task"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <TabsContent value="tasks" className="space-y-4">
          <EnhancedTasksView tasks={tasks?.data || []} onTaskClick={handleTaskClick} isLoading={tasksLoading} />
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <MilestonesView projectId={projectId} />
        </TabsContent>
        <TabsContent value="associates" className="space-y-4">
          <AssociatesAssignedView projectID={projectId} projectCurrency={project?.data?.currency} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
