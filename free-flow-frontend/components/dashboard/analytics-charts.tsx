"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", revenue: 8500, expenses: 2100, profit: 6400 },
  { month: "Feb", revenue: 12200, expenses: 2800, profit: 9400 },
  { month: "Mar", revenue: 9800, expenses: 2200, profit: 7600 },
  { month: "Apr", revenue: 15600, expenses: 3200, profit: 12400 },
  { month: "May", revenue: 11400, expenses: 2600, profit: 8800 },
  { month: "Jun", revenue: 13800, expenses: 3100, profit: 10700 },
  { month: "Jul", revenue: 16200, expenses: 3400, profit: 12800 },
  { month: "Aug", revenue: 14500, expenses: 3000, profit: 11500 },
  { month: "Sep", revenue: 17800, expenses: 3600, profit: 14200 },
  { month: "Oct", revenue: 19200, expenses: 3800, profit: 15400 },
  { month: "Nov", revenue: 16800, expenses: 3300, profit: 13500 },
  { month: "Dec", revenue: 18500, expenses: 3500, profit: 15000 },
]

const projectData = [
  { month: "Jan", completed: 2, active: 3, new: 1 },
  { month: "Feb", completed: 3, active: 4, new: 2 },
  { month: "Mar", completed: 2, active: 3, new: 1 },
  { month: "Apr", completed: 4, active: 5, new: 3 },
  { month: "May", completed: 3, active: 4, new: 2 },
  { month: "Jun", completed: 5, active: 6, new: 3 },
  { month: "Jul", completed: 4, active: 5, new: 2 },
  { month: "Aug", completed: 3, active: 4, new: 2 },
  { month: "Sep", completed: 6, active: 7, new: 4 },
  { month: "Oct", completed: 5, active: 6, new: 3 },
  { month: "Nov", completed: 4, active: 5, new: 2 },
  { month: "Dec", completed: 3, active: 4, new: 1 },
]

const clientDistribution = [
  { name: "TechCorp Inc.", value: 35, color: "#0891b2" },
  { name: "StartupXYZ", value: 25, color: "#84cc16" },
  { name: "RetailCorp", value: 20, color: "#f59e0b" },
  { name: "Creative Agency", value: 12, color: "#6366f1" },
  { name: "Others", value: 8, color: "#e3342f" },
]

const taskCompletionData = [
  { week: "Week 1", completed: 12, assigned: 15 },
  { week: "Week 2", completed: 18, assigned: 20 },
  { week: "Week 3", completed: 14, assigned: 16 },
  { week: "Week 4", completed: 22, assigned: 25 },
]

export function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue & Profit</TabsTrigger>
          <TabsTrigger value="projects">Project Trends</TabsTrigger>
          <TabsTrigger value="clients">Client Distribution</TabsTrigger>
          <TabsTrigger value="tasks">Task Completion</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Profit Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
                  expenses: { label: "Expenses", color: "hsl(var(--chart-3))" },
                  profit: { label: "Profit", color: "hsl(var(--chart-2))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="var(--color-chart-1)"
                      fill="var(--color-chart-1)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stackId="2"
                      stroke="var(--color-chart-2)"
                      fill="var(--color-chart-2)"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Activity Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  completed: { label: "Completed", color: "hsl(var(--chart-2))" },
                  active: { label: "Active", color: "hsl(var(--chart-1))" },
                  new: { label: "New", color: "hsl(var(--chart-4))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="active" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="new" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ChartContainer
                  config={{
                    techcorp: { label: "TechCorp Inc.", color: "#0891b2" },
                    startup: { label: "StartupXYZ", color: "#84cc16" },
                    retail: { label: "RetailCorp", color: "#f59e0b" },
                    creative: { label: "Creative Agency", color: "#6366f1" },
                    others: { label: "Others", color: "#e3342f" },
                  }}
                  className="h-[300px] w-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {clientDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-4 space-y-2">
                {clientDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  completed: { label: "Completed", color: "hsl(var(--chart-2))" },
                  assigned: { label: "Assigned", color: "hsl(var(--chart-1))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="assigned"
                      stroke="var(--color-chart-1)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="var(--color-chart-2)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-chart-2)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
