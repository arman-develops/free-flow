"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTaskStore } from "@/stores/task-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCard } from "@/components/associate/task-card"
import { TaskFilters } from "@/components/associate/task-filters"
import { TaskDetailPanel } from "@/components/associate/task-detail-panel"
import { TimeTracker } from "@/components/associate/time-tracker"
import { Search, Filter, Loader2, AlertCircle } from "lucide-react"
import type { Task } from "@/types/associate"
import { tasksApi } from "@/lib/api"
import { mapTasksResponse } from "@/utils/map-tasks"

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const { tasks, statusFilter, priorityFilter, projectFilter, activeTimeEntry } = useTaskStore()
  const setTasks = useTaskStore((state) => state.setTasks)

  const { data: tasksResponse, isLoading } = useQuery({
    queryKey: ["associate_tasks"],
    queryFn: tasksApi.getTasks
  })
  
  useEffect(() => {
    setTasks(mapTasksResponse(tasksResponse?.success ? tasksResponse.data : []))
  }, [tasksResponse, setTasks])

  console.log(tasks)

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status)
    const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority)
    const matchesProject = projectFilter.length === 0 || projectFilter.includes(task.projectId)

    return matchesSearch && matchesStatus && matchesPriority && matchesProject
  })

  const todoTasks = filteredTasks.filter((t) => t.status === "todo")
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in_progress")
  const reviewTasks = filteredTasks.filter((t) => t.status === "review")
  const completedTasks = filteredTasks.filter((t) => t.status === "completed")
  const blockedTasks = filteredTasks.filter((t) => t.status === "blocked")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track your assigned tasks</p>
        </div>
        {activeTimeEntry && (
          <Button variant="outline" className="gap-2 bg-transparent">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            Timer Running
          </Button>
        )}
      </div>

      {/* Time Tracker */}
      {activeTimeEntry && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <TimeTracker />
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {(statusFilter.length > 0 || priorityFilter.length > 0 || projectFilter.length > 0) && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                  {statusFilter.length + priorityFilter.length + projectFilter.length}
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border">
              <TaskFilters />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Tasks List */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All <span className="ml-1 text-xs">({filteredTasks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="active" className="flex-1">
                Active <span className="ml-1 text-xs">({inProgressTasks.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-2 m-0">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer transition-all">
                    <TaskCard task={task} isSelected={selectedTask?.id === task.id} />
                  </div>
                ))
              ) : (
                <EmptyState />
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-2 m-0">
              {inProgressTasks.length > 0 ? (
                inProgressTasks.map((task) => (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer transition-all">
                    <TaskCard task={task} isSelected={selectedTask?.id === task.id} />
                  </div>
                ))
              ) : (
                <EmptyState />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Task Detail Panel */}
        <div className="lg:col-span-2 hidden lg:block">
          <Card className="h-full flex flex-col">
            <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
          </Card>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="text-sm font-medium text-foreground mb-1">No tasks found</h3>
        <p className="text-xs text-muted-foreground">Try adjusting your filters or search query</p>
      </CardContent>
    </Card>
  )
}
