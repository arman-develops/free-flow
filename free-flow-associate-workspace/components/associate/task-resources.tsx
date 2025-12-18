"use client"

import React, { useState } from "react"
import { Paperclip, FileText, Download, Eye, Link as LinkIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
import { TooltipTrigger } from "@radix-ui/react-tooltip"

type Attachment = {
  id: string
  name: string
  size: number // bytes
  type?: string // "image/png", "application/pdf", "text/plain", ...
  url: string
}

interface TaskResourcesProps {
  attachments: Attachment[]
  // optional hooks for parent (e.g. logging or analytics)
  onDownload?: (attachment: Attachment) => void
  onOpen?: (attachment: Attachment) => void
  className?: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export default function TaskResources({ attachments, onDownload, onOpen, className }: TaskResourcesProps) {
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleOpen = (att: Attachment) => {
    onOpen?.(att)
    // open in new tab for full view
    window.open(att.url, "_blank")
  }

  const handleDownload = (att: Attachment) => {
    onDownload?.(att)
    // create an anchor to trigger download with filename
    const a = document.createElement("a")
    a.href = att.url
    a.download = att.name
    a.target = "_blank"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleCopyLink = async (att: Attachment) => {
    try {
      await navigator.clipboard.writeText(att.url)
      setCopiedId(att.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      // fallback: open the link in new tab if clipboard not available
      window.open(att.url, "_blank")
    }
  }

  const canPreview = (att: Attachment) => {
    if (!att.type) return false
    return (
      att.type.startsWith("image/") ||
      att.type === "application/pdf" ||
      att.type.startsWith("text/")
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Attached Files ({attachments.length})
        </h3>
      </div>

      {attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(attachment.size)} • {attachment.type ?? "unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {canPreview(attachment) ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPreviewAttachment(attachment)}
                        aria-label={`Preview ${attachment.name}`}
                        >
                        <Eye className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Preview</p>
                    </TooltipContent>
                  </Tooltip>
                ) : null}

                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpen(attachment)}
                            aria-label={`Open ${attachment.name}`}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Open in new tab</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(attachment)}
                            aria-label={`Download ${attachment.name}`}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Download</p>
                    </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No attachments</p>
        </div>
      )}

      {/* Preview dialog */}
      <Dialog open={!!previewAttachment} onOpenChange={() => setPreviewAttachment(null)}>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>{previewAttachment?.name}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setPreviewAttachment(null)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="mt-4">
            {previewAttachment ? (
              previewAttachment.type?.startsWith("image/") ? (
                // image preview
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewAttachment.url}
                  alt={previewAttachment.name}
                  className="max-h-[70vh] w-full object-contain rounded"
                />
              ) : previewAttachment.type === "application/pdf" ? (
                // PDF preview using <iframe>
                <iframe
                  src={previewAttachment.url}
                  className="w-full h-[70vh] border rounded"
                  title={previewAttachment.name}
                />
              ) : previewAttachment.type?.startsWith("text/") ? (
                // attempt to fetch text content (safe fallback)
                <TextFilePreview url={previewAttachment.url} />
              ) : (
                <div className="p-6 text-sm text-muted-foreground">
                  Preview not available for this file type. Use Open or Download instead.
                </div>
              )
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* small helper to fetch & show text files */
function TextFilePreview({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr(null)
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch file")
        return r.text()
      })
      .then((t) => {
        if (!cancelled) setText(t)
      })
      .catch((e) => {
        if (!cancelled) setErr((e as Error).message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [url])

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading preview...</div>
  if (err) return <div className="p-6 text-sm text-destructive">Failed to load preview</div>
  return (
    <pre className="whitespace-pre-wrap max-h-[70vh] overflow-auto p-4 bg-muted/10 rounded text-sm">
      {text}
    </pre>
  )
}
