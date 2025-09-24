import { AssociatesTable } from "@/components/dashboard/associates-table";
import { AssociateStats } from "@/components/dashboard/associate-stats";
import { Button } from "@/components/ui/button";
import { Plus, UserCheck } from "lucide-react";
import Link from "next/link";
import { CreateAssociateDialog } from "@/components/dashboard/create-associate-dialog";

export default function AssociatesPage() {
  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <UserCheck className="h-8 w-8" />
                Associates
              </h1>
              <p className="text-muted-foreground">
                Manage your team of skilled associates and their assignments.
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <Link href="/dashboard/associates/create">Add Associate</Link>
            </Button>
          </div>

          {/* Associate Stats */}
          <AssociateStats />

          {/* Associates Table */}
          <AssociatesTable />

          <CreateAssociateDialog />
        </div>
      </main>
    </div>
  );
}
