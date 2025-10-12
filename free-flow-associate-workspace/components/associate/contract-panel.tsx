"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, FileText, DollarSign, Calendar, Shield, Copyright, Loader2 } from "lucide-react"
import type { Contract } from "@/types/associate"
import { format } from "date-fns"

interface ContractPanelProps {
  contract: Contract
  onAccept: () => void
  onDecline: () => void
  isAccepted: boolean
}

export function ContractPanel({ contract, onAccept, onDecline, isAccepted }: ContractPanelProps) {
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeclining, setIsDeclining] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onAccept()
    setIsAccepting(false)
  }

  const handleDecline = async () => {
    setIsDeclining(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onDecline()
    setIsDeclining(false)
  }

  return (
    <Card className="h-fit lg:sticky lg:top-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Contract Agreement</CardTitle>
              <CardDescription>Review and accept the terms</CardDescription>
            </div>
          </div>
          {isAccepted && (
            <Badge variant="default" className="bg-success text-success-foreground">
              <Check className="h-3 w-3 mr-1" />
              Accepted
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {/* Contract Title & Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">{contract.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{contract.description}</p>
            </div>

            <Separator />

            {/* Payment Terms */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <DollarSign className="h-4 w-4" />
                <span>Payment Terms</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground capitalize">{contract.paymentTerms.type}</span>
                </div>
                {contract.paymentTerms.rate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rate</span>
                    <span className="font-medium text-foreground">
                      {contract.paymentTerms.currency} {contract.paymentTerms.rate}/hr
                    </span>
                  </div>
                )}
                {contract.paymentTerms.amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium text-foreground">
                      {contract.paymentTerms.currency} {contract.paymentTerms.amount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Schedule</span>
                  <span className="font-medium text-foreground">{contract.paymentTerms.paymentSchedule}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Calendar className="h-4 w-4" />
                <span>Timeline</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium text-foreground">
                    {format(new Date(contract.startDate), "MMM dd, yyyy")}
                  </span>
                </div>
                {contract.endDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="font-medium text-foreground">
                      {format(new Date(contract.endDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Confidentiality Clause */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Shield className="h-4 w-4" />
                <span>Confidentiality</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{contract.confidentialityClause}</p>
              </div>
            </div>

            <Separator />

            {/* Ownership Clause */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Copyright className="h-4 w-4" />
                <span>Intellectual Property & Ownership</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{contract.ownershipClause}</p>
              </div>
            </div>

            {/* Timestamp */}
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                Contract issued on {format(new Date(contract.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {!isAccepted && (
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={handleDecline}
              disabled={isAccepting || isDeclining}
            >
              {isDeclining ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Declining...
                </>
              ) : (
                "Decline"
              )}
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleAccept}
              disabled={isAccepting || isDeclining}
            >
              {isAccepting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Accept Contract
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
