import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Invoice } from "@/types/associate"

interface InvoicesListProps {
  invoices: Invoice[]
  isLoading: boolean
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground border-muted" },
  sent: { label: "Sent", color: "bg-info/10 text-info border-info/20" },
  paid: { label: "Paid", color: "bg-success/10 text-success border-success/20" },
  overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive border-destructive/20" },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground border-muted" },
}

export function InvoicesList({ invoices, isLoading }: InvoicesListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No invoices yet</h3>
          <p className="text-sm text-muted-foreground">Your invoices will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>View and download your invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invoices.map((invoice) => {
            const status = statusConfig[invoice.status]

            return (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">Invoice #{invoice.invoiceNumber}</h4>
                    <Badge variant="outline" className={cn("text-xs", status.color)}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{invoice.projectName}</span>
                    <span>•</span>
                    <span>{invoice.clientName}</span>
                    <span>•</span>
                    <span>Issued {format(new Date(invoice.issuedAt), "MMM dd, yyyy")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">
                      {invoice.currency} {invoice.amount.toLocaleString()}
                    </div>
                    {invoice.status === "sent" && (
                      <p className="text-xs text-muted-foreground">Due {format(new Date(invoice.dueDate), "MMM dd")}</p>
                    )}
                    {invoice.paidAt && (
                      <p className="text-xs text-success">Paid {format(new Date(invoice.paidAt), "MMM dd")}</p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
