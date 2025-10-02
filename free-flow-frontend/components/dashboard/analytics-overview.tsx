"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/lib/api";

// transform projects into aggregated category stats
const categoriesConfig = {
  web: { label: "Web Development", color: "#0891b2" },
  mobile: { label: "Mobile Apps", color: "#84cc16" },
  design: { label: "UI/UX Design", color: "#f59e0b" },
  consulting: { label: "Consulting", color: "#6366f1" },
  writing: { label: "Writing", color: "#ec4899" },
  marketing: { label: "Marketing & PR", color: "#10b981" },
  other: { label: "Other", color: "#6b7280" },
};

export function AnalyticsOverview() {

  const {
    data: revenueDataResponse, isLoading: revenueStatLoading, error: revenueError
  } = useQuery({
    queryKey: ["revenue_stats"],
    queryFn: statsApi.getRevenueStats
  })

  const {
    data: projectTypeDataResponse,
    isLoading: projectDataLoading,
    error: projectDataError
  } = useQuery({
    queryKey: ["project_stats"],
    queryFn: statsApi.getProjectDataStats
  })

  if (revenueStatLoading) {
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

  if (revenueError) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">Failed to load Revenue stats</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    )
  }

    if (projectDataLoading) {
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

  if (projectDataError) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">Failed to load project stats</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const projects = projectTypeDataResponse?.data?.project_stats || []

  // Dynamically build chart data
  const totalProjects = projects.length;

  const projectTypeData = Object.entries(categoriesConfig)
  .map(([key, { label, color }]) => {
    const count = projects.filter((p: any) => p.category === key).length;
    const percentage = totalProjects > 0 ? (count / totalProjects) * 100 : 0;
    return { name: label, value: Math.round(percentage), color };
  })
  .filter((item) => item.value > 0);

  const monthlyData = revenueDataResponse?.data?.revenue_stats || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-chart-1)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Project Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Project Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ChartContainer config={categoriesConfig} className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
          </div>
          <div className="mt-4 space-y-2">
            {projectTypeData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
