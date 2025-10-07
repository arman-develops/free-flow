"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Star,
  Loader2,
} from "lucide-react";

export function AssociateStats() {
  const {
    data: associateStatsResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ["associate_stats"],
    queryFn: statsApi.getAssociateStats
  })

  if(isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
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

  const associateStats = associateStatsResponse.success ? associateStatsResponse.data : {}

  const stats = [
    {
      title: "Total Associates",
      value: associateStats.total_associates ?? 0,
      change: `+${associateStats.active_associates ?? 0}`,
      changeType: (associateStats.active_associates ?? 0) > 0 ? "positive" : "negative",
      icon: Users,
      description: "Active team members",
    },
    {
      title: "Active Assignments",
      value: associateStats.total_associate_projects ?? 0,
      change: `+${associateStats.active_associate_projects ?? 0}`,
      changeType: (associateStats.active_associate_projects ?? 0) > 0 ? "positive" : "negative",
      icon: Clock,
      description: "Current projects",
    },
    {
      title: "Completed Tasks",
      value: associateStats.total_completed_tasks ?? 0,
      change: `+${associateStats.monthly_completed_tasks ?? 0}`,
      changeType: (associateStats.monthly_completed_tasks ?? 0) > 0 ? "positive" : "negative",
      icon: CheckCircle,
      description: "This month",
    },
    {
      title: "Total Earnings",
      value: `KSh ${associateStats.total_associate_earnings?.toLocaleString() ?? 0}`,
      change: `+${associateStats.associate_earnings_percent ?? 0}%`,
      changeType: (associateStats.associate_earnings_percent ?? 0) > 0 ? "positive" : "negative",
      icon: DollarSign,
      description: "Associate payments",
    },
    {
      title: "Avg. Performance",
      value: `${associateStats.average_performance.toFixed(1) ?? 0}/5`,
      change: `${associateStats.rating_deviation.toFixed(1) ?? 0}%`,
      changeType: (associateStats.rating_deviation ?? 0) > 0 ? "positive" : "negative",
      icon: Star,
      description: "Rating score",
    },
    {
      title: "Efficiency Rate",
      value: `${associateStats.efficiency_rate_percent ?? 0}%`,
      change: `${associateStats.efficiency_deviation_percent ?? 0}%`,
      changeType: (associateStats.efficiency_deviation_percent ?? 0) > 0 ? "positive" : "negative",
      icon: TrendingUp,
      description: "On-time delivery",
    },
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
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
