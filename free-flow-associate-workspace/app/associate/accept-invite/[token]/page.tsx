"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { ContractPanel } from "@/components/associate/contract-panel"
import { TaskInvitePanel } from "@/components/associate/task-invite-panel"
import { Loader2, XCircle, AlertTriangle } from "lucide-react"
import type { Contract, TaskInvite } from "@/types/associate"
import { InviteApi } from "@/lib/api"
import { parsePaymentTerms } from '@/utils/parse-payment-terms'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function AcceptInvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const [acceptanceState, setAcceptanceState] = useState<{
    contractAccepted: boolean
    taskAccepted: boolean
  }>({
    contractAccepted: false,
    taskAccepted: false,
  })
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)

  const { data: inviteData, isLoading, error } = useQuery({
    queryKey: ["invite_details"],
    queryFn: () => InviteApi.getInviteDetails(token)
  })

  const inviteMutation = useMutation({
    mutationFn: ({ token, data }: { token: string, data: {} }) => InviteApi.inviteResponse(token, data),
    onSuccess: (data, variables: any) => {
      if (variables.data.status === "declined") {
        // Show success message or redirect to declined page
        router.push(`/associate/declined`)
      } else {
        router.push(`/associate/dashboard`)
      }
    },
    onError: (err) => {
      console.error("Failed to update invite response", err)
    },
  })

  useEffect(() => {
    if (acceptanceState.contractAccepted && acceptanceState.taskAccepted) {
      const data = {
        status: "accepted"
      }
      inviteMutation.mutate({ token, data })
    }
  }, [acceptanceState, router, token])

  const handleDecline = () => {
    setShowDeclineDialog(true)
  }

  const confirmDecline = () => {
    const data = {
      status: "declined"
    }
    inviteMutation.mutate({ token, data })
    setShowDeclineDialog(false)
    router.push("/associate/declined")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Invalid Invitation</h1>
          <p className="text-muted-foreground">
            This invitation link is invalid or has expired. Please contact the freelancer who sent you this invitation.
          </p>
        </div>
      </div>
    )
  }

  const data = inviteData?.data

  const inviteDetails = {
    contract: {
      title: `${data.contract.role} — ${data.project.name}`,
      description: data.contract.description,
      startDate: data.contract.start_date,
      endDate: data.contract.end_date,
      paymentTerms: parsePaymentTerms(data.contract.payment_terms),
      confidentialityClause: data.contract.confidentiality || "None provided.",
      ownershipClause: data.contract.ownership || "None provided.",
      createdAt: data.contract.timestamp,
    },
    taskInvite: {
      projectName: data.project.name,
      clientName: `${data.freelancer.first_name} ${data.freelancer.last_name}`,
      role: data.contract.role,
      responsibilities: data.contract.responsibilities,
      estimatedHours: data.task.estimated_hours,
      deadline: data.task.due_date,
      priority: data.task.priority,
      createdAt: data.task.created_at,
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Freeflow</h1>
              <p className="text-sm text-muted-foreground mt-1">Contract & Task Invitation</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{data.contract.freelancerName}</p>
              {data.contract.freelancerCompany && (
                <p className="text-xs text-muted-foreground">{data.contract.freelancerCompany}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Split View Content */}
      <div className="container mx-auto p-4 lg:p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Contract */}
          <ContractPanel
            contract={inviteDetails.contract}
            onAccept={() => setAcceptanceState((prev) => ({ ...prev, contractAccepted: true }))}
            onDecline={handleDecline}
            isAccepted={acceptanceState.contractAccepted}
          />

          {/* Right: Task Invite */}
          <TaskInvitePanel
            taskInvite={inviteDetails.taskInvite}
            onAccept={() => setAcceptanceState((prev) => ({ ...prev, taskAccepted: true }))}
            onDecline={handleDecline}
            isAccepted={acceptanceState.taskAccepted}
            disabled={!acceptanceState.contractAccepted}
          />
        </div>
      </div>

      {/* Decline Confirmation Dialog */}
      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <AlertDialogTitle className="text-xl">Decline Invitation?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base leading-relaxed">
              Are you sure you want to decline this invitation for <span className="font-semibold text-foreground">{inviteDetails.taskInvite.projectName}</span>?
              <br /><br />
              This action cannot be undone. The freelancer will be notified of your decision, and you won't be able to accept this invitation later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="mt-0">
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDecline}
              disabled={inviteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {inviteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Declining...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Yes, Decline
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}