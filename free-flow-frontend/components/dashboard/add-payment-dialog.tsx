"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CreditCard, Plus, Smartphone } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { paymentApi } from "@/lib/api"
import { queryClient } from "@/lib/query-client"

interface AddPaymentDialogProps {
  trigger?: React.ReactNode
  data: any
}

export function AddPaymentDialog({ trigger, data }: AddPaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const [paidDate, setPaidDate] = useState<Date>()
  const [formData, setFormData] = useState({
    invoice_id: data.id,
    amount: "",
    currency: "USD",
    method: "",
    transaction_ref: "",
    status: "confirmed",
    phoneNumber: "", // For M-PESA integration
  })

  const createPaymentMutation = useMutation({
    mutationFn: paymentApi.create,
    onSuccess: () => {
      toast.success("Expenses added successfully!")
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to record payment")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paidDate) {
      toast.error("Please select a payment date")
      return
    }

    if (formData.method === "mpesa" && !formData.phoneNumber) {
      toast.error("Phone number is required for M-PESA payments")
      return
    }

    try {
      // Here you would typically make an API call to record the payment
      const paymentData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        paidDate: paidDate.toISOString(),
      }

      console.log("Recording payment:", paymentData)

      // If M-PESA, simulate gateway integration
      if (formData.method === "mpesa") {
        toast.loading("Processing M-PESA payment...")
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      createPaymentMutation.mutate(paymentData)
      toast.success("Payment recorded successfully!")
      setOpen(false)

      // Reset form
      setFormData({
        invoice_id: "",
        amount: "",
        currency: "USD",
        method: "",
        transaction_ref: "",
        status: "confirmed",
        phoneNumber: "",
      })
      setPaidDate(undefined)
    } catch (error) {
      toast.error("Failed to record payment")
      console.error("Record payment error:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full mb-2">
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Record Payment
          </DialogTitle>
          <DialogDescription>
            Record a payment for an invoice. This can be manual or via payment gateway.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_id">Invoice Number *</Label>
              <div className="font-semibold text-lg mt-1">
                {data.invoice_number}
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pending" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="KES">KES</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="method">Payment Method *</Label>
            <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mpesa">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    M-PESA
                  </div>
                </SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.method === "mpesa" && (
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+254712345678"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Required for M-PESA gateway integration</p>
            </div>
          )}

          <div>
            <Label>Payment Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !paidDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {paidDate ? format(paidDate, "PPP") : "Select payment date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={paidDate} onSelect={setPaidDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="transactionRef">Transaction Reference</Label>
            <Input
              id="transactionRef"
              value={formData.transaction_ref}
              onChange={(e) => setFormData({ ...formData, transaction_ref: e.target.value })}
              placeholder="Transaction ID or reference"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Record Payment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
