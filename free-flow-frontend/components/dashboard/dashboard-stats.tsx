"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, CheckSquare, Users, DollarSign, TrendingUp, Clock } from "lucide-react"

const stats = [
  {
    title: "Total Projects",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: FolderOpen,
    description: "Active projects",
  },
  {
    title: "Completed Tasks",
    value: "156",
    change: "+8%",
    changeType: "positive" as const,
    icon: CheckSquare,
    description: "This month",
  },
  {
    title: "Active Clients",
    value: "18",
    change: "+3",
    changeType: "positive" as const,
    icon: Users,
    description: "Total clients",
  },
  {
    title: "Monthly Revenue",
    value: "$12,450",
    change: "+15%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "This month",
  },
  {
    title: "Project Efficiency",
    value: "94%",
    change: "+2%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "On-time delivery",
  },
  {
    title: "Avg. Task Time",
    value: "2.4h",
    change: "-0.3h",
    changeType: "positive" as const,
    icon: Clock,
    description: "Per task",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
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
        )
      })}
    </div>
  )
}
