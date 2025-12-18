// utils/mapTasks.ts
import type { Task } from "@/types/associate"

export const mapTasksResponse = (data: any[]): Task[] => {
  return data?.map((t) => ({
    id: t.id,
    projectId: t.project?.id || "",
    projectName: t.project?.name || "Unknown Project",
    clientName: t.project?.entity?.companyName || "Anonymous client",
    title: t.title,
    description: t.description || "",
    status: t.status === "done" ? "completed" : t.status, // normalize backend -> frontend
    priority: t.priority || "medium",
    assignedBy: t.freelancer ? `${t.freelancer?.firstname} ${t.freelancer?.lastname}` : "Anonymous", // you can fill this in later
    dueDate: t.due_date || undefined,
    startedAt: t.start_date || undefined,
    completedAt: t.completed_at || undefined,
    estimatedHours: t.estimated_hours || 0,
    actualHours: t.actual_hours || 0,
    tags: [],
    attachments: [],
    comments: [],
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }))
}
