"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  FileText,
  ImageIcon,
  LinkIcon,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
  Send,
  Calendar,
  Target,
} from "lucide-react"
import { toast } from "sonner"

interface TaskSubmissionPanelProps {
  task: {
    id: string
    title: string
    description: string
    status: string
    priority: string
    due_date?: string
    estimated_hours: number
    milestone?: string
  }
  onSubmit: (data: any) => void
  onSaveDraft: (data: any) => void
}

export function TaskSubmissionPanel({ task, onSubmit, onSaveDraft }: TaskSubmissionPanelProps) {
  const [submissionNotes, setSubmissionNotes] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState<"draft" | "submitted" | "revision">("draft")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [links, setLinks] = useState<string[]>([])
  const [newLink, setNewLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
    toast.success(`${files.length} file(s) added`)
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddLink = () => {
    if (!newLink.trim()) return
    if (!newLink.startsWith("http://") && !newLink.startsWith("https://")) {
      toast.error("Please enter a valid URL starting with http:// or https://")
      return
    }
    setLinks((prev) => [...prev, newLink])
    setNewLink("")
    toast.success("Link added")
  }

  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveDraft = () => {
    const draftData = {
      taskId: task.id,
      notes: submissionNotes,
      files: uploadedFiles,
      links,
      status: "draft",
      savedAt: new Date().toISOString(),
    }
    onSaveDraft(draftData)
    toast.success("Draft saved successfully")
  }

  const handleSubmit = async () => {
    if (!submissionNotes.trim()) {
      toast.error("Please add submission notes")
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const submissionData = {
        taskId: task.id,
        notes: submissionNotes,
        files: uploadedFiles,
        links,
        status: "submitted",
        submittedAt: new Date().toISOString(),
      }

      onSubmit(submissionData)
      toast.success("Task submitted successfully!")
      setSubmissionStatus("submitted")
    } catch (error) {
      toast.error("Failed to submit task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Task Context Card */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Estimated</p>
                <p className="font-medium text-gray-900">{task.estimated_hours}h</p>
              </div>
            </div>
            {task.due_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500 text-xs">Due Date</p>
                  <p className="font-medium text-gray-900">{new Date(task.due_date).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            {task.milestone && (
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500 text-xs">Milestone</p>
                  <p className="font-medium text-gray-900">{task.milestone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Status</p>
                <p className="font-medium text-gray-900 capitalize">{task.status.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Form */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Submit Your Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Submission Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Submission Notes *</Label>
            <Textarea
              id="notes"
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Describe what you've completed, any challenges faced, and additional notes..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">Provide detailed information about your work</p>
          </div>

          {/* File Upload Zone */}
          <div className="space-y-3">
            <Label>Attachments</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50"
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">Click to upload files</p>
              <p className="text-xs text-gray-500">Support for images, documents, and media files</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
              />
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        {getFileIcon(file.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            <Label>External Links</Label>
            <div className="flex gap-2">
              <Input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://example.com/your-work"
                onKeyPress={(e) => e.key === "Enter" && handleAddLink()}
              />
              <Button onClick={handleAddLink} variant="outline" className="flex-shrink-0 bg-transparent">
                <LinkIcon className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            {/* Links List */}
            {links.length > 0 && (
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                        <LinkIcon className="h-4 w-4" />
                      </div>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate"
                      >
                        {link}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLink(index)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission Status */}
          <div className="space-y-2">
            <Label>Submission Status</Label>
            <Select value={submissionStatus} onValueChange={(value: any) => setSubmissionStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (Save for later)</SelectItem>
                <SelectItem value="submitted">Ready to Submit</SelectItem>
                <SelectItem value="revision">Revision Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gray-900 hover:bg-gray-800"
              disabled={isSubmitting || !submissionNotes.trim()}
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Work
                </>
              )}
            </Button>
          </div>

          {/* Auto-save indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <CheckCircle2 className="h-3 w-3" />
            <span>Changes are auto-saved as you type</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
