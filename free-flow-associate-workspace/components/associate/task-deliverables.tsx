"use client"

import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileUp, Send, CheckCircle2, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

type UploadedFile = {
  id: string
  file: File
  preview: string
}

export default function TaskDeliverables() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [notes, setNotes] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  })

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleSaveDraft = () => {
    console.log("Saving draft with:", { uploadedFiles, notes })
    // 🔹 Add logic: save draft to server or local storage
  }

  const handleSubmitWork = () => {
    console.log("Submitting work:", { uploadedFiles, notes })
    // 🔹 Add logic: upload files + notes to server
  }

  return (
    <div className="p-4 space-y-6">
      {/* Submit section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <FileUp className="h-4 w-4" />
          Submit Your Work
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload your completed work, add notes, and submit for review.
        </p>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors cursor-pointer bg-muted/30",
            isDragActive && "border-primary/50 bg-muted/50"
          )}
        >
          <input {...getInputProps()} />
          <FileUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">
            {isDragActive ? "Drop files here..." : "Drag and drop files here"}
          </p>
          <p className="text-xs text-muted-foreground">or click to browse</p>
        </div>

        {/* Uploaded files list */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Files to Submit</h4>
            {uploadedFiles.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-foreground truncate">
                    {item.file.name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Notes input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Submission Notes</label>
          <textarea
            placeholder="Describe what you've completed, any challenges faced, and additional notes..."
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button className="flex-1" onClick={handleSubmitWork}>
            <Send className="h-4 w-4 mr-2" />
            Submit Work
          </Button>
        </div>
      </div>

      <Separator />

      {/* Previous submissions */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Previous Submissions</h3>
        <div className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No submissions yet</p>
        </div>
      </div>
    </div>
  )
}
