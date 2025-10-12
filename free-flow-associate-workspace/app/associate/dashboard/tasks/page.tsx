"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { useTaskStore } from "@/stores/task-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCard } from "@/components/associate/task-card"
import { TaskFilters } from "@/components/associate/task-filters"
import { TimeTracker } from "@/components/associate/time-tracker"
import { Search, Filter, Loader2, AlertCircle, Play } from "lucide-react"
import type { Task } from "@/types/associate"

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const { tasks, setTasks, statusFilter, priorityFilter, projectFilter, activeTimeEntry } = useTaskStore()

  const { data, isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await apiClient.get("/associate/tasks")
      return response.data
    },
  })

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
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in-progress")
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
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <div className="cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <Play className="h-4 w-4" />
              Timer Running
            </div>
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

      {/* Tasks Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All <span className="ml-1.5 text-xs text-muted-foreground">({filteredTasks.length})</span>
          </TabsTrigger>
          <TabsTrigger value="todo">
            To Do <span className="ml-1.5 text-xs text-muted-foreground">({todoTasks.length})</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress <span className="ml-1.5 text-xs text-muted-foreground">({inProgressTasks.length})</span>
          </TabsTrigger>
          <TabsTrigger value="review">
            Review <span className="ml-1.5 text-xs text-muted-foreground">({reviewTasks.length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <span className="ml-1.5 text-xs text-muted-foreground">({completedTasks.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="todo" className="space-y-3">
          {todoTasks.length > 0 ? todoTasks.map((task) => <TaskCard key={task.id} task={task} />) : <EmptyState />}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-3">
          {inProgressTasks.length > 0 ? (
            inProgressTasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-3">
          {reviewTasks.length > 0 ? reviewTasks.map((task) => <TaskCard key={task.id} task={task} />) : <EmptyState />}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <EmptyState />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-1">No tasks found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
      </CardContent>
    </Card>
  )
}
