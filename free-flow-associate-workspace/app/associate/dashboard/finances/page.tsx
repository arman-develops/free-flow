"use client"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { useFinanceStore } from "@/stores/finance-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { EarningsOverview } from "@/components/associate/earnings-overview"
import { PaymentsList } from "@/components/associate/payments-list"
import { InvoicesList } from "@/components/associate/invoices-list"
import { Download, TrendingUp, Loader2 } from "lucide-react"
import type { Payment, Earnings, Invoice } from "@/types/associate"

export default function FinancesPage() {
  const { setEarnings, setPayments, setInvoices } = useFinanceStore()

  const { data: earnings, isLoading: earningsLoading } = useQuery<Earnings>({
    queryKey: ["earnings"],
    queryFn: async () => {
      const response = await apiClient.get("/associate/finances/earnings")
      return response.data
    },
  })

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await apiClient.get("/associate/finances/payments")
      return response.data
    },
  })

  const { data: invoices, isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await apiClient.get("/associate/finances/invoices")
      return response.data
    },
  })

  if (earningsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Finances</h1>
          <p className="text-muted-foreground mt-1">Track your earnings, payments, and invoices</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Earnings Overview */}
      {earnings && <EarningsOverview earnings={earnings} />}

      {/* Tabs */}
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <PaymentsList payments={payments || []} isLoading={paymentsLoading} />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoicesList invoices={invoices || []} isLoading={invoicesLoading} />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Earnings Analytics</CardTitle>
              </div>
              <CardDescription>Detailed breakdown of your earnings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                Analytics charts coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
