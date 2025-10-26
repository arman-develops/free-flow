"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { ContractPanel } from "@/components/associate/contract-panel"
import { TaskInvitePanel } from "@/components/associate/task-invite-panel"
import { Loader2 } from "lucide-react"
import type { Contract, TaskInvite } from "@/types/associate"
import { InviteApi } from "@/lib/api"
import { parsePaymentTerms } from '@/utils/parse-payment-terms';

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

  const { data:inviteData, isLoading, error } = useQuery({
    queryKey: ["invite_details"],
    queryFn: () => InviteApi.getInviteDetails(token)
  })

  const inviteMutation = useMutation({
    mutationFn: ({token, data}: {token: string, data: {}}) => InviteApi.inviteResponse(token, data),
    onSuccess: () => {
      router.push(`/associate/dashboard`)
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
      inviteMutation.mutate({token, data})
    }
  }, [acceptanceState, router, token])

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
  };

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
            onDecline={() => router.push("/associate/declined")}
            isAccepted={acceptanceState.contractAccepted}
          />

          {/* Right: Task Invite */}
          <TaskInvitePanel
            taskInvite={inviteDetails.taskInvite}
            onAccept={() => setAcceptanceState((prev) => ({ ...prev, taskAccepted: true }))}
            onDecline={() => router.push("/associate/declined")}
            isAccepted={acceptanceState.taskAccepted}
            disabled={!acceptanceState.contractAccepted}
          />
        </div>
      </div>
    </div>
  )
}
