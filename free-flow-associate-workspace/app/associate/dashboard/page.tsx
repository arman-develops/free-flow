"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, DollarSign, Clock, TrendingUp, ArrowRight, AlertCircle, Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface DashboardStats {
  activeTasks: number
  completedThisWeek: number
  totalEarnings: number
  pendingPayments: number
  hoursThisWeek: number
  activeProjects: number
}

interface RecentTask {
  id: string
  title: string
  projectName: string
  status: string
  priority: string
  dueDate?: string
}

export default function AssociateDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/associate/dashboard/stats")
      return response.data
    },
  })

  const { data: recentTasks, isLoading: tasksLoading } = useQuery<RecentTask[]>({
    queryKey: ["recent-tasks"],
    queryFn: async () => {
      const response = await apiClient.get("/associate/tasks/recent")
      return response.data
    },
  })

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your work today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{stats?.activeTasks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats?.completedThisWeek || 0} completed this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              ${(stats?.totalEarnings || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${(stats?.pendingPayments || 0).toLocaleString()} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hours This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{stats?.hoursThisWeek || 0}h</div>
            <Progress value={((stats?.hoursThisWeek || 0) / 40) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{stats?.activeProjects || 0}</div>
            <p className="text-xs text-success mt-1">All on track</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your most recent task assignments</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/associate/dashboard/tasks">
                View all
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : recentTasks && recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">{task.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.projectName}</p>
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground ml-4">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(task.dueDate), "MMM dd")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recent tasks</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
