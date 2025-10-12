import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Payment } from "@/types/associate"

interface PaymentsListProps {
  payments: Payment[]
  isLoading: boolean
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-warning/10 text-warning border-warning/20" },
  processing: { label: "Processing", color: "bg-info/10 text-info border-info/20" },
  paid: { label: "Paid", color: "bg-success/10 text-success border-success/20" },
  failed: { label: "Failed", color: "bg-destructive/10 text-destructive border-destructive/20" },
  disputed: { label: "Disputed", color: "bg-destructive/10 text-destructive border-destructive/20" },
}

export function PaymentsList({ payments, isLoading }: PaymentsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No payments yet</h3>
          <p className="text-sm text-muted-foreground">Your payment history will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View and manage your payment records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments.map((payment) => {
            const status = statusConfig[payment.status]

            return (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{payment.description}</h4>
                    <Badge variant="outline" className={cn("text-xs", status.color)}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{payment.projectName}</span>
                    <span>•</span>
                    <span>{payment.clientName}</span>
                    <span>•</span>
                    <span>{format(new Date(payment.createdAt), "MMM dd, yyyy")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </div>
                    {payment.dueDate && payment.status === "pending" && (
                      <p className="text-xs text-muted-foreground">Due {format(new Date(payment.dueDate), "MMM dd")}</p>
                    )}
                    {payment.paidAt && (
                      <p className="text-xs text-success">Paid {format(new Date(payment.paidAt), "MMM dd")}</p>
                    )}
                  </div>

                  {payment.invoiceUrl && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
