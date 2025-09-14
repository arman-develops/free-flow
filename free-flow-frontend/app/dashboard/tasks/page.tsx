import { Sidebar } from "@/components/dashboard/sidebar"
import { TasksTable } from "@/components/dashboard/tasks-table"
import { Button } from "@/components/ui/button"
import { Plus, CheckSquare } from "lucide-react"

export default function TasksPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <CheckSquare className="h-8 w-8" />
                Tasks
              </h1>
              <p className="text-muted-foreground">Manage and track individual tasks across all projects.</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </div>

          {/* Tasks Table */}
          <TasksTable />
        </div>
      </main>
    </div>
  )
}
