"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Message, Conversation } from "@/types/associate"

interface MessageThreadProps {
  conversationId: string
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  const [messageText, setMessageText] = useState("")
  const queryClient = useQueryClient()

  const { data: conversation } = useQuery<Conversation>({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const response = await apiClient.get(`/associate/messages/conversations/${conversationId}`)
      return response.data
    },
  })

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const response = await apiClient.get(`/associate/messages/conversations/${conversationId}/messages`)
      return response.data
    },
  })

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiClient.post(`/associate/messages/conversations/${conversationId}/messages`, {
        content,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      setMessageText("")
    },
  })

  const handleSend = () => {
    if (messageText.trim()) {
      sendMutation.mutate(messageText.trim())
    }
  }

  const otherParticipants = conversation?.participants.filter((p) => p.role !== "associate") || []
  const displayName = otherParticipants.map((p) => p.name).join(", ")

  return (
    <>
      <CardHeader className="border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherParticipants[0]?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {otherParticipants[0]?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{displayName}</h3>
            {conversation?.projectName && <p className="text-sm text-muted-foreground">{conversation.projectName}</p>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId === "current-user-id" // Replace with actual user ID
                return (
                  <div key={message.id} className={cn("flex gap-3", isOwn && "flex-row-reverse")}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-muted text-xs">
                        {message.senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className={cn("flex-1 max-w-[70%]", isOwn && "flex flex-col items-end")}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{message.senderName}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), "h:mm a")}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "rounded-lg p-3 text-sm",
                          isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={sendMutation.isPending}
            />
            <Button onClick={handleSend} disabled={!messageText.trim() || sendMutation.isPending} className="gap-2">
              {sendMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  )
}
