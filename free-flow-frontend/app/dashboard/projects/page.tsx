import { Sidebar } from "@/components/dashboard/sidebar";
import { ProjectsTable } from "@/components/dashboard/projects-table";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <FolderOpen className="h-8 w-8" />
                Projects
              </h1>
              <p className="text-muted-foreground">
                Manage your projects and track their progress.
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>

          {/* Projects Table */}
          <ProjectsTable />
        </div>
      </main>
    </div>
  );
}
