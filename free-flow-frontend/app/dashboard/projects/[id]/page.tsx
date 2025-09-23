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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, FolderOpen, CheckSquare, Clock, User, ArrowLeft, Loader2, Calendar } from "lucide-react"
import { projectsApi, tasksApi } from "@/lib/api"
import { toast } from "sonner"
import { DetailPanel } from "@/components/dashboard/details-panel"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const projectId = params.id as string

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
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
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "todo":
        return "bg-yellow-100 text-yellow-800"
      case "on_hold":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

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
          <p className="text-gray-600 text-sm">{project?.data?.description}</p>
        </div>
      </div>

      {/* Project Info */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-medium text-gray-900">Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Estimated Value</p>
              <p className="text-lg font-semibold text-gray-700">
                {project?.data?.currency} {project?.data?.estimated_value?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Progress</p>
              <p className="text-lg font-semibold text-gray-700">{project?.data?.progress_percent || 0}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Tasks</p>
              <p className="text-lg font-semibold text-gray-700">{tasks?.data?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Status</p>
              <Badge className={getStatusColor(project?.data?.status || "active")}>
                {project?.data?.status || "active"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Current Phase</p>
              <p className="text-sm text-gray-600">{project?.data?.current_phase || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Priority</p>
              <Badge className={getPriorityColor(project?.data?.priority || "medium")}>
                {project?.data?.priority || "medium"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Your Cut</p>
              <p className="text-sm text-gray-600">{project?.data?.your_cut_percent || 0}%</p>
            </div>
          </div>

          {project?.data?.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-900 mb-2">Notes</p>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{project.data.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-gray-700" />
          Tasks
        </h2>
        <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white">
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
                <Button type="button" variant="outline" onClick={() => setIsCreateTaskOpen(false)} className="flex-1">
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
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasksLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : tasks?.data?.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No tasks yet</h3>
              <p className="text-gray-500 text-center mb-4">Create your first task to get started with this project.</p>
            </CardContent>
          </Card>
        ) : (
          tasks?.data?.map((task: any) => (
            <Card
              key={task.id}
              className="border border-gray-200 shadow-sm bg-white hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => handleTaskClick(task)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 hover:text-blue-600">{task.title}</h3>
                      <Badge className={getStatusColor(task.status || "todo")}>{task.status || "todo"}</Badge>
                      <Badge className={getPriorityColor(task.priority || "medium")}>{task.priority || "medium"}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.estimated_hours}h est. / {task.actual_hours || 0}h actual
                      </div>
                      {task.assigned_associate && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Assigned
                        </div>
                      )}
                      {task.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* DetailPanel for task details */}
      <DetailPanel
        isOpen={isTaskDetailOpen}
        onClose={() => setIsTaskDetailOpen(false)}
        type="task"
        data={selectedTask}
      />
    </div>
  )
}
