"use client"

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PriorityTasks } from "@/components/dashboard/priority-tasks";
import { ProjectProgress } from "@/components/dashboard/project-progress";
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview";
import { FinancialOverview } from "@/components/dashboard/financial-overview";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back!
          </p>
        </div>
        <QuickActions />
      </div>

      <DashboardStats />

      <AnalyticsOverview />

      <ProjectProgress />
    </div>
  );
}
