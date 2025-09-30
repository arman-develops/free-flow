import { FinanceStats } from "@/components/dashboard/finance-stats"
import { PaymentsTable } from "@/components/dashboard/payments-table"
import { ExpensesTable } from "@/components/dashboard/expenses-table"
import { DollarSign } from "lucide-react"
import { CreateInvoiceDialog } from "@/components/dashboard/create-invoice-dialog"
import { AddPaymentDialog } from "@/components/dashboard/add-payment-dialog"
import { AddExpenseDialog } from "@/components/dashboard/add-expense-dialog"

export default function FinancesPage() {
  return (
    <div className="flex h-screen bg-background">
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
              <AddExpenseDialog />
              <AddPaymentDialog />
              <CreateInvoiceDialog />
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
