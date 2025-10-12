"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/associate"

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No conversations yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isSelected = selectedId === conversation.id
        const otherParticipants = conversation.participants.filter((p) => p.role !== "associate")
        const displayName = otherParticipants.map((p) => p.name).join(", ")
        const initials = otherParticipants[0]?.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()

        return (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={cn(
              "w-full text-left p-3 rounded-lg transition-colors",
              isSelected ? "bg-accent" : "hover:bg-accent/50",
            )}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={otherParticipants[0]?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">{displayName}</h4>
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {format(new Date(conversation.lastMessage.createdAt), "MMM dd")}
                    </span>
                  )}
                </div>

                {conversation.projectName && (
                  <p className="text-xs text-muted-foreground mb-1">{conversation.projectName}</p>
                )}

                {conversation.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.content}</p>
                )}

                {conversation.unreadCount > 0 && (
                  <Badge variant="default" className="mt-2 bg-primary text-primary-foreground">
                    {conversation.unreadCount} new
                  </Badge>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
