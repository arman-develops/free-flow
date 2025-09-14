import { Sidebar } from "@/components/sidebar"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { TimeTracking } from "@/components/time-tracking"
import { Button } from "@/components/ui/button"
import { Download, BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-8 w-8" />
                Analytics
              </h1>
              <p className="text-muted-foreground">Detailed insights into your business performance and trends.</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Performance Metrics */}
          <PerformanceMetrics />

          {/* Analytics Charts */}
          <AnalyticsCharts />

          {/* Time Tracking */}
          <TimeTracking />
        </div>
      </main>
    </div>
  )
}
