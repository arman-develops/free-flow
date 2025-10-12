"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload, File } from "lucide-react"

interface SubmissionUploadProps {
  onClose: () => void
}

export function SubmissionUpload({ onClose }: SubmissionUploadProps) {
  const [selectedTask, setSelectedTask] = useState("")
  const [notes, setNotes] = useState("")
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = () => {
    // Handle submission
    console.log({ selectedTask, notes, files })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>New Submission</CardTitle>
              <CardDescription>Upload your work deliverables</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task">Select Task</Label>
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger id="task">
                <SelectValue placeholder="Choose a task" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task-1">Website Design - Homepage</SelectItem>
                <SelectItem value="task-2">Logo Design - Brand Identity</SelectItem>
                <SelectItem value="task-3">Mobile App UI - Dashboard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Upload Files</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png,.gif"
              />
              <label htmlFor="files" className="cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-foreground font-medium">Click to upload files</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, ZIP, or images up to 50MB</p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2 mt-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground flex-1">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or comments about this submission..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedTask || files.length === 0} className="flex-1">
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
