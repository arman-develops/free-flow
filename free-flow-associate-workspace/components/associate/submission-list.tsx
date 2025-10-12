import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, AlertCircle, FileText } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

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

interface SubmissionsListProps {
  submissions: Submission[]
}

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", color: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20" },
  "revision-requested": { label: "Revision Requested", color: "bg-info/10 text-info border-info/20" },
}

export function SubmissionsList({ submissions }: SubmissionsListProps) {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No submissions</h3>
          <p className="text-sm text-muted-foreground">Your submissions will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => {
        const status = statusConfig[submission.status]

        return (
          <Card key={submission.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{submission.taskTitle}</h3>
                      <Badge variant="outline" className={cn("text-xs", status.color)}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{submission.projectName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted {format(new Date(submission.submittedAt), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>

                {submission.feedback && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-1">Feedback:</p>
                    <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Files ({submission.files.length})</p>
                  <div className="grid gap-2">
                    {submission.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-foreground truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={file.url} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
