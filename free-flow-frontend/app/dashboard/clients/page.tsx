import { ClientsTable } from "@/components/dashboard/clients-table";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-8 w-8" />
                Clients
              </h1>
              <p className="text-muted-foreground">
                Manage your client relationships and contact information.
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>

          {/* Clients Table */}
          <ClientsTable />
        </div>
      </main>
    </div>
  );
}
