"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  X,
  Edit3,
  Save,
  Share2,
  CheckCircle2,
  DollarSign,
  Mail,
  Phone,
  Building2,
  FolderOpen,
  ListTodo,
  Calendar,
  User,
  ExternalLink,
  UserCheck,
  Star,
} from "lucide-react"
import { projectsApi } from "@/lib/api"
import { useUpdateProject } from "@/hooks/use-projects"
import { useUpdateTask } from "@/hooks/use-tasks"
import { useUpdateAssociate } from "@/hooks/use-associates"
import { toast } from "sonner"
import { useAssociates } from "@/hooks/use-associates"

interface DetailPanelProps {
  isOpen: boolean
  onClose: () => void
  type: "client" | "project" | "task" | "associate" | null
  data: any
  client?: any
}

export function DetailPanel({ isOpen, onClose, type, data, client }: DetailPanelProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(data)
  const [notes, setNotes] = useState("")

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: [`projects`, data?.id],
    queryFn: () => projectsApi.getProjectByClientID(data.id),
    enabled: type === "client" && !!data?.id,
  })

  const updateProject = useUpdateProject()
  const updateTask = useUpdateTask()
  const updateAssociate = useUpdateAssociate()
  const { data: associatesResponse } = useAssociates()
  const associates = associatesResponse?.success ? associatesResponse.data : []

  useEffect(() => {
    setEditData(data)
    setNotes(data?.notes || "")
  }, [data])

  if (!isOpen || !type || !data) return null

  const handleSave = async () => {
    try {
      if (type === "project") {
        await updateProject.mutateAsync({ id: data.id, data: editData })
        toast.success("Project updated successfully")
      } else if (type === "task") {
        await updateTask.mutateAsync({ id: data.id, data: editData })
        toast.success("Task updated successfully")
      } else if (type === "associate") {
        await updateAssociate.mutateAsync({ id: data.id, data: editData })
        toast.success("Associate updated successfully")
      }
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to save changes")
      console.error("Save error:", error)
    }
  }

  const handleMarkComplete = () => {
    // TODO: Implement mark complete functionality
    console.log("Marking complete:", data)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Sharing:", data)
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`)
    onClose() // Close the detail panel when navigating
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      case "urgent":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderClientDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.companyName}</h3>
          <p className="text-sm text-gray-500">Client</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{data.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{data.contact}</span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Created {new Date(data.CreatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Projects</h4>
        {projectsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : projects?.data?.length ? (
          <div className="space-y-2">
            {projects.data.map((project: any) => (
              <div
                key={project.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm group-hover:text-blue-600">{project.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">${project.estimated_value}</Badge>
                    <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{project.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No projects yet</p>
        )}
      </div>
    </div>
  )

  const renderEnhancedProjectDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <FolderOpen className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.name}</h3>
          <p className="text-sm text-gray-500">Project for {client?.companyName}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Status</Label>
            {isEditing ? (
              <Select
                value={editData.status || "active"}
                onValueChange={(value) => setEditData({ ...editData, status: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                  <SelectItem value="proposal">proposal</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">completed</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="mt-1">
                {data.status || "proposal"}
              </Badge>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Priority</Label>
            {isEditing ? (
              <Select
                value={editData.priority || "medium"}
                onValueChange={(value) => setEditData({ ...editData, priority: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className={`mt-1 ${getPriorityColor(data.priority || "medium")}`}>
                {data.priority || "medium"}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Current Phase</Label>
            {isEditing ? (
              <Select
                value={editData.current_phase || "discovery"}
                onValueChange={(value) => setEditData({ ...editData, current_phase: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="deevlopment">Development</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className={`mt-1`}>
                {data.current_phase || "discovery"}
              </Badge>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Progress</Label>
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${data.progress_percent || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.progress_percent || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Estimated Value</Label>
            {isEditing ? (
              <Input
                type="number"
                value={editData.estimated_value || ""}
                onChange={(e) => setEditData({ ...editData, estimated_value: Number.parseFloat(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <DollarSign className="h-3 w-3" />
                {data.estimated_value ? `${data.currency || "$"}${data.estimated_value}` : "Not set"}
              </div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Actual Value</Label>
            {isEditing ? (
              <Input
                type="number"
                value={editData.actual_value || ""}
                onChange={(e) => setEditData({ ...editData, actual_value: Number.parseFloat(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <DollarSign className="h-3 w-3" />
                {data.actual_value ? `${data.currency || "$"}${data.actual_value}` : "Not set"}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Deadline</Label>
            {isEditing ? (
              <Input
                type="date"
                value={editData.deadline ? new Date(editData.deadline).toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setEditData({ ...editData, deadline: date.toISOString() });
                  console.log(date)
                }}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <Calendar className="h-3 w-3" />
                {data.deadline ? new Date(data.deadline).toLocaleDateString() : "Not set"}
              </div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Your Cut (%)</Label>
            {isEditing ? (
              <Input
                type="number"
                min="0"
                max="100"
                value={editData.your_cut_percent || ""}
                onChange={(e) => setEditData({ ...editData, your_cut_percent: Number.parseInt(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-600 mt-1">{data.your_cut_percent || 0}%</p>
            )}
          </div>
        </div>

        {data.completed_at && (
          <div>
            <Label className="text-sm font-medium">Completed At</Label>
            <div className="flex items-center gap-1 text-sm mt-1">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              {new Date(data.completed_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Description</h4>
        {isEditing ? (
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="min-h-[100px]"
          />
        ) : (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {data.description || "No description provided"}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button onClick={() => handleProjectClick(data.id)} variant="outline" className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Project Details & Tasks
        </Button>
      </div>
    </div>
  )

  const renderEnhancedTaskDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <ListTodo className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.title}</h3>
          <p className="text-sm text-gray-500">Task</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Status</Label>
            {isEditing ? (
              <Select
                value={editData.status || "todo"}
                onValueChange={(value) => setEditData({ ...editData, status: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant={data.status === "done" ? "default" : "secondary"} className="mt-1">
                {data.status || "todo"}
              </Badge>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Priority</Label>
            {isEditing ? (
              <Select
                value={editData.priority || "medium"}
                onValueChange={(value) => setEditData({ ...editData, priority: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className={`mt-1 ${getPriorityColor(data.priority || "medium")}`}>
                {data.priority || "medium"}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Estimated Hours</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.5"
                value={editData.estimated_hours || ""}
                onChange={(e) => setEditData({ ...editData, estimated_hours: Number.parseFloat(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-600 mt-1">{data.estimated_hours || 0}h</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Actual Hours</Label>
            <p className="text-sm text-gray-600 mt-1">{data.actual_hours || 0}h</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Due Date</Label>
            {isEditing ? (
              <Input
                type="date"
                value={editData.due_date ? new Date(editData.due_date).toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setEditData({ ...editData, due_date: date.toISOString() }); // send full datetime
                }}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <Calendar className="h-3 w-3" />
                {data.due_date ? new Date(data.due_date).toLocaleDateString() : "Not set"}
              </div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Assigned Associate</Label>
            {isEditing ? (
              <Select
                value={editData.assigned_to_associate || "unassigned"}
                onValueChange={(value) =>
                  setEditData({ ...editData, assigned_to_associate: value === "unassigned" ? null : value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select associate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {associates.map((associate: any) => (
                    <SelectItem key={associate.id} value={associate.id}>
                      {associate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <User className="h-3 w-3" />
                {data.assigned_associate?.name || "Unassigned"}
              </div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Task Value</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.5"
                value={editData.task_value || ""}
                onChange={(e) => setEditData({ ...editData, task_value: Number.parseFloat(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-600 mt-1">{data.task_value || 0} KES</p>
            )}
          </div>
        </div>

        {data.completed_at && (
          <div>
            <Label className="text-sm font-medium">Completed At</Label>
            <div className="flex items-center gap-1 text-sm mt-1">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              {new Date(data.completed_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Description</h4>
        {isEditing ? (
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="min-h-[100px]"
          />
        ) : (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {data.description || "No description provided"}
          </p>
        )}
      </div>
    </div>
  )

  const renderAssociateDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <UserCheck className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.name}</h3>
          <p className="text-sm text-gray-500">Associate</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Name</Label>
            {isEditing ? (
              <Input
                value={editData.name || ""}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-600 mt-1">{data.name}</p>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Status</Label>
            {isEditing ? (
              <Select
                value={editData.status || "active"}
                onValueChange={(value) => setEditData({ ...editData, status: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="mt-1">
                {data.status || "active"}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Email</Label>
            {isEditing ? (
              <Input
                type="email"
                value={editData.email || ""}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <Mail className="h-3 w-3" />
                {data.email}
              </div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Phone</Label>
            {isEditing ? (
              <Input
                value={editData.phone || ""}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 text-sm mt-1">
                <Phone className="h-3 w-3" />
                {data.phone}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Rating</Label>
            {isEditing ? (
              <Input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={editData.rating || ""}
                onChange={(e) => setEditData({ ...editData, rating: Number.parseFloat(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{data.rating || 4.5}</span>
              </div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Rate (%)</Label>
            {isEditing ? (
              <Input
                type="number"
                min="0"
                max="100"
                value={editData.rate || ""}
                onChange={(e) => setEditData({ ...editData, rate: Number.parseInt(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center gap-1 mt-1">
                <DollarSign className="h-3 w-3" />
                <span className="font-medium">{data.rate || 70}%</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Skills</Label>
          {isEditing ? (
            <Input
              value={Array.isArray(editData.skills) ? editData.skills.join(", ") : editData.skills || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  skills: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Enter skills separated by commas"
              className="mt-1"
            />
          ) : (
            <div className="flex flex-wrap gap-1 mt-1">
              {(data.skills || []).map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderNotes = () => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Notes</h4>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add your notes here..."
        className="min-h-[100px]"
      />
    </div>
  )

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Details</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="text-gray-600 hover:text-gray-900"
            disabled={updateProject.isPending || updateTask.isPending || updateAssociate.isPending}
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {type === "client" && renderClientDetails()}
        {type === "project" && renderEnhancedProjectDetails()}
        {type === "task" && renderEnhancedTaskDetails()}
        {type === "associate" && renderAssociateDetails()}

        {renderNotes()}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {isEditing && (
          <Button
            onClick={handleSave}
            className="w-full"
            disabled={updateProject.isPending || updateTask.isPending || updateAssociate.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateProject.isPending || updateTask.isPending || updateAssociate.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        )}

        {type === "task" && (
          <Button onClick={handleMarkComplete} variant="outline" className="w-full bg-transparent">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark Complete
          </Button>
        )}

        <Button onClick={handleShare} variant="outline" className="w-full bg-transparent">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}
