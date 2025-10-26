
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Check, 
  FileText, 
  DollarSign, 
  Calendar, 
  Shield, 
  Copyright, 
  Loader2,
  Briefcase,
  Clock,
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Info,
  TrendingUp,
  Target
} from "lucide-react"
import type { Contract, TaskInvite } from "@/types/associate"
import { format, differenceInDays, formatDistance } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ContractPanelProps {
  contract: Contract
  onAccept: () => void
  onDecline: () => void
  isAccepted: boolean
}

export function ContractPanel({ contract, onAccept, onDecline, isAccepted }: ContractPanelProps) {
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeclining, setIsDeclining] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    payment: true,
    timeline: true,
    confidentiality: false,
    ownership: false,
  })

  const handleAccept = async () => {
    setIsAccepting(true)
    onAccept()
    setIsAccepting(false)
  }

  const handleDecline = async () => {
    setIsDeclining(true)
    onDecline()
    setIsDeclining(false)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Calculate contract duration
  const duration = contract.endDate 
    ? differenceInDays(new Date(contract.endDate), new Date(contract.startDate))
    : null

  // Calculate time until start
  const daysUntilStart = differenceInDays(new Date(contract.startDate), new Date())

  return (
    <Card className="h-fit lg:sticky lg:top-6 shadow-lg border-2">
      <CardHeader className="">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Contract Agreement</CardTitle>
              <CardDescription>Review and accept the terms</CardDescription>
            </div>
          </div>
          {isAccepted && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white shadow-md">
              <Check className="h-3 w-3 mr-1" />
              Accepted
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-center cursor-help">
                  <Calendar className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-bold text-blue-600">{duration ? `${duration}d` : 'Ongoing'}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total contract duration</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 text-center cursor-help">
                  <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-600" />
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-bold text-green-600 capitalize">{contract.paymentTerms.type}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Payment structure</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 text-center cursor-help">
                  <Clock className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                  <p className="text-xs text-muted-foreground">Starts</p>
                  <p className="text-sm font-bold text-purple-600">
                    {daysUntilStart > 0 ? `${daysUntilStart}d` : 'Today'}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Days until contract starts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <ScrollArea className="h-[450px] pr-4">
          <div className="space-y-6">
            {/* Contract Title & Description */}
            <div className="bg-muted/30 rounded-xl p-4 border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-2 text-lg">{contract.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{contract.description}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Terms - Collapsible */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('payment')}
                className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span>Payment Terms</span>
                </div>
                {expandedSections.payment ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {expandedSections.payment && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-200/50 space-y-3 animate-in slide-in-from-top-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Type</span>
                    <Badge variant="outline" className="font-medium capitalize bg-white">
                      {contract.paymentTerms.type}
                    </Badge>
                  </div>
                  
                  {contract.paymentTerms.rate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Hourly Rate</span>
                      <span className="font-bold text-green-700 text-lg">
                        {contract.paymentTerms.currency} {contract.paymentTerms.rate}/hr
                      </span>
                    </div>
                  )}
                  
                  {contract.paymentTerms.amount && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Amount</span>
                      <span className="font-bold text-green-700 text-lg">
                        {contract.paymentTerms.currency} {contract.paymentTerms.amount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <Separator className="bg-green-200/50" />
                  
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground font-medium">Payment Schedule</span>
                    <p className="text-sm text-foreground leading-relaxed bg-white/60 rounded-lg p-3">
                      {contract.paymentTerms.paymentSchedule}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Timeline - Collapsible */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('timeline')}
                className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Timeline</span>
                </div>
                {expandedSections.timeline ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {expandedSections.timeline && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-200/50 space-y-3 animate-in slide-in-from-top-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Start Date</span>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {format(new Date(contract.startDate), "MMM dd, yyyy")}
                      </p>
                      <p className="text-xs text-blue-600">
                        {formatDistance(new Date(contract.startDate), new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  {contract.endDate && (
                    <>
                      <Separator className="bg-blue-200/50" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">End Date</span>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {format(new Date(contract.endDate), "MMM dd, yyyy")}
                          </p>
                          <p className="text-xs text-blue-600">
                            {duration} days duration
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Confidentiality Clause - Collapsible */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('confidentiality')}
                className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span>Confidentiality</span>
                </div>
                {expandedSections.confidentiality ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {expandedSections.confidentiality && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-200/50 animate-in slide-in-from-top-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">{contract.confidentialityClause}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Ownership Clause - Collapsible */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('ownership')}
                className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Copyright className="h-5 w-5 text-orange-600" />
                  <span>Intellectual Property & Ownership</span>
                </div>
                {expandedSections.ownership ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {expandedSections.ownership && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-4 border border-orange-200/50 animate-in slide-in-from-top-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">{contract.ownershipClause}</p>
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className="pt-4 flex items-center justify-between text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
              <span>Contract issued on {format(new Date(contract.createdAt), "MMMM dd, yyyy 'at' h:mm a")}</span>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {!isAccepted && (
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
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
              className="flex-1 bg-blue-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
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