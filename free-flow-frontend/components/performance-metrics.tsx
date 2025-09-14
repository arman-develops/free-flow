"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, Clock, CheckCircle, AlertTriangle } from "lucide-react"

const metrics = [
  {
    title: "Project Success Rate",
    value: 94,
    target: 90,
    trend: "up",
    description: "Projects completed on time",
    icon: Target,
  },
  {
    title: "Client Satisfaction",
    value: 4.8,
    target: 4.5,
    trend: "up",
    description: "Average rating out of 5",
    icon: CheckCircle,
    isRating: true,
  },
  {
    title: "Revenue Growth",
    value: 15.2,
    target: 12,
    trend: "up",
    description: "Month over month growth",
    icon: TrendingUp,
    isPercentage: true,
  },
  {
    title: "Task Efficiency",
    value: 87,
    target: 85,
    trend: "up",
    description: "Tasks completed within estimate",
    icon: Clock,
  },
  {
    title: "Profit Margin",
    value: 68.5,
    target: 65,
    trend: "up",
    description: "Net profit percentage",
    icon: TrendingUp,
    isPercentage: true,
  },
  {
    title: "Overdue Tasks",
    value: 3,
    target: 5,
    trend: "down",
    description: "Tasks past due date",
    icon: AlertTriangle,
    isCount: true,
    lowerIsBetter: true,
  },
]

export function PerformanceMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const isOnTarget = metric.lowerIsBetter ? metric.value <= metric.target : metric.value >= metric.target
        const progressValue = metric.lowerIsBetter
          ? Math.max(0, 100 - (metric.value / metric.target) * 100)
          : Math.min(100, (metric.value / metric.target) * 100)

        return (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-card-foreground">
                  {metric.isRating
                    ? metric.value.toFixed(1)
                    : metric.isPercentage
                      ? `${metric.value}%`
                      : metric.isCount
                        ? metric.value
                        : `${metric.value}%`}
                </div>
                <div className="flex items-center gap-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-secondary" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`text-sm font-medium ${isOnTarget ? "text-secondary" : "text-destructive"}`}>
                    {isOnTarget ? "On Target" : "Below Target"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress to Target</span>
                  <span>
                    Target:{" "}
                    {metric.isRating
                      ? metric.target.toFixed(1)
                      : metric.isPercentage
                        ? `${metric.target}%`
                        : metric.isCount
                          ? metric.target
                          : `${metric.target}%`}
                  </span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>

              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
