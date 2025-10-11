"use client";

import { statsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  FolderOpen,
  CheckSquare,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStats() {

  const {
    data: dashboardStatsResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: statsApi.getDashboardStats
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
            <p className="text-red-600">Failed to load Dashboard</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
            <p>{`${error}`}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const dashboardStats = dashboardStatsResponse?.data?.dashboard_stats || []
  const stats = dashboardStats ? [
    {
      title: "Total Projects",
      value: dashboardStats.total_projects,
      change: `${dashboardStats.projects_change}%`,
      changeType: dashboardStats.projects_change >= 0 ? "positive" : "negative",
      icon: FolderOpen,
      description: "Active projects"
    },
    {
      title: "Active Clients",
      value: dashboardStats.total_clients,
      change: dashboardStats.clients_this_month,
      changeType: dashboardStats.clients_this_month >= 0 ? "positive" : "negative",
      icon: Users,
      description: "Clients this month"
    },
    {
      title: "Monthly Revenue",
      value: `KES ${dashboardStats.revenue_this_month}`,
      change: `${dashboardStats.revenue_change}%`,
      changeType: dashboardStats.revenue_change >= 0 ? "positive" : "negative",
      icon: DollarSign,
      description: "This month",
    },
  ] : []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat:any) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {stat.value}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span
                  className={`font-medium ${stat.changeType === "positive" ? "text-secondary" : "text-destructive"}`}
                >
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
