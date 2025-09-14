import { Sidebar } from "@/components/sidebar"
import { FinanceStats } from "@/components/finance-stats"
import { PaymentsTable } from "@/components/payments-table"
import { ExpensesTable } from "@/components/expenses-table"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign } from "lucide-react"

export default function FinancesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <DollarSign className="h-8 w-8" />
                Finances
              </h1>
              <p className="text-muted-foreground">Track payments, expenses, and financial performance.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Record Payment
              </Button>
            </div>
          </div>

          {/* Finance Stats */}
          <FinanceStats />

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentsTable />
            <ExpensesTable />
          </div>
        </div>
      </main>
    </div>
  )
}
