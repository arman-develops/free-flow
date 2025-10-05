"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Loader2, CreditCard, Zap } from "lucide-react"
import { toast } from "sonner"

interface RecordSettlementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecordSettlementDialog({ open, onOpenChange }: RecordSettlementDialogProps) {
  const [settlementDate, setSettlementDate] = useState<Date>()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    associateId: "",
    amount: "",
    currency: "KES",
    method: "",
    transactionRef: "",
    phoneNumber: "",
    notes: "",
  })

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!settlementDate) {
      toast.error("Please select a settlement date")
      return
    }

    setIsProcessing(true)

    try {
      // Here you would typically make an API call to record the settlement
      const settlementData = {
        ...formData,
        date: settlementDate.toISOString(),
      }

      console.log("Recording manual settlement:", settlementData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Settlement recorded successfully!")
      onOpenChange(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to record settlement")
      console.error("Record settlement error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAutomaticTransfer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.phoneNumber) {
      toast.error("Phone number is required for automatic transfer")
      return
    }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsProcessing(true)

    try {
      // Here you would typically make an API call to initiate the transfer
      const transferData = {
        associateId: formData.associateId,
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        phoneNumber: formData.phoneNumber,
        notes: formData.notes,
      }

      console.log("Initiating automatic transfer:", transferData)

      toast.loading("Initiating M-PESA transfer...")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2500))

      toast.success("Transfer initiated successfully! Awaiting confirmation.")
      onOpenChange(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to initiate transfer")
      console.error("Transfer error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setFormData({
      associateId: "",
      amount: "",
      currency: "KES",
      method: "",
      transactionRef: "",
      phoneNumber: "",
      notes: "",
    })
    setSettlementDate(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Record Settlement</DialogTitle>
          <DialogDescription>
            Record a payment to an associate manually or initiate an automatic transfer.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="automatic" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automatic Transfer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="associateId">Associate *</Label>
                  <Select
                    value={formData.associateId}
                    onValueChange={(value) => setFormData({ ...formData, associateId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select associate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sarah Johnson</SelectItem>
                      <SelectItem value="2">Mike Chen</SelectItem>
                      <SelectItem value="3">John Doe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">KES</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method *</Label>
                  <Select
                    value={formData.method}
                    onValueChange={(value) => setFormData({ ...formData, method: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mpesa">M-PESA</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Settlement Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !settlementDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {settlementDate ? format(settlementDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={settlementDate} onSelect={setSettlementDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionRef">Transaction Reference</Label>
                  <Input
                    id="transactionRef"
                    value={formData.transactionRef}
                    onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                    placeholder="e.g., MPE123456"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about this settlement"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing} className="flex-1 bg-gray-900 hover:bg-gray-800">
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    "Record Settlement"
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="automatic" className="space-y-4 mt-4">
            <form onSubmit={handleAutomaticTransfer} className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>M-PESA Integration:</strong> Funds will be transferred automatically to the associate's phone
                  number.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="auto-associateId">Associate *</Label>
                  <Select
                    value={formData.associateId}
                    onValueChange={(value) => setFormData({ ...formData, associateId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select associate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sarah Johnson</SelectItem>
                      <SelectItem value="2">Mike Chen</SelectItem>
                      <SelectItem value="3">John Doe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auto-amount">Amount *</Label>
                  <Input
                    id="auto-amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="auto-currency">Currency *</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">KES</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number (M-PESA) *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+254712345678"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-notes">Notes</Label>
                <Textarea
                  id="auto-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about this transfer"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing} className="flex-1 bg-gray-900 hover:bg-gray-800">
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Initiate Transfer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
