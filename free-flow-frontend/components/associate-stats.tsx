"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, Clock, DollarSign, TrendingUp, Star } from "lucide-react"

const stats = [
  {
    title: "Total Associates",
    value: "8",
    change: "+2",
    changeType: "positive" as const,
    icon: Users,
    description: "Active team members",
  },
  {
    title: "Active Assignments",
    value: "15",
    change: "+3",
    changeType: "positive" as const,
    icon: Clock,
    description: "Current projects",
  },
  {
    title: "Completed Tasks",
    value: "89",
    change: "+12",
    changeType: "positive" as const,
    icon: CheckCircle,
    description: "This month",
  },
  {
    title: "Total Earnings",
    value: "$28,450",
    change: "+18%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Associate payments",
  },
  {
    title: "Avg. Performance",
    value: "4.7/5",
    change: "+0.2",
    changeType: "positive" as const,
    icon: Star,
    description: "Rating score",
  },
  {
    title: "Efficiency Rate",
    value: "92%",
    change: "+5%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "On-time delivery",
  },
]

export function AssociateStats() {
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
