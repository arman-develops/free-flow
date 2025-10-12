"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubmissionUpload } from "@/components/associate/submission-upload"
import { SubmissionsList } from "@/components/associate/submission-list"
import { Upload, Loader2 } from "lucide-react"

interface Submission {
  id: string
  taskId: string
  taskTitle: string
  projectName: string
  files: Array<{ name: string; url: string; size: number }>
  status: "pending" | "approved" | "rejected" | "revision-requested"
  submittedAt: string
  feedback?: string
}

export default function SubmissionsPage() {
  const [showUpload, setShowUpload] = useState(false)

  const { data: submissions, isLoading } = useQuery<Submission[]>({
    queryKey: ["submissions"],
    queryFn: async () => {
      const response = await apiClient.get("/associate/submissions")
      return response.data
    },
  })

  const pendingSubmissions = submissions?.filter((s) => s.status === "pending") || []
  const approvedSubmissions = submissions?.filter((s) => s.status === "approved") || []
  const revisionSubmissions = submissions?.filter((s) => s.status === "revision-requested") || []

  if (isLoading) {
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
          <h1 className="text-3xl font-semibold text-foreground">Submissions</h1>
          <p className="text-muted-foreground mt-1">Upload and manage your work deliverables</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          New Submission
        </Button>
      </div>

      {/* Upload Modal */}
      {showUpload && <SubmissionUpload onClose={() => setShowUpload(false)} />}

      {/* Submissions Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All <span className="ml-1.5 text-xs text-muted-foreground">({submissions?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending <span className="ml-1.5 text-xs text-muted-foreground">({pendingSubmissions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved <span className="ml-1.5 text-xs text-muted-foreground">({approvedSubmissions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="revisions">
            Revisions <span className="ml-1.5 text-xs text-muted-foreground">({revisionSubmissions.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <SubmissionsList submissions={submissions || []} />
        </TabsContent>

        <TabsContent value="pending">
          <SubmissionsList submissions={pendingSubmissions} />
        </TabsContent>

        <TabsContent value="approved">
          <SubmissionsList submissions={approvedSubmissions} />
        </TabsContent>

        <TabsContent value="revisions">
          <SubmissionsList submissions={revisionSubmissions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
