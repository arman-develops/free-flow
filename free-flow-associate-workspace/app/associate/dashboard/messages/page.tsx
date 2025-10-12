"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConversationList } from "@/components/associate/conversation-list"
import { MessageThread } from "@/components/associate/message-thread"
import { Search, Loader2 } from "lucide-react"
import type { Conversation } from "@/types/associate"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await apiClient.get("/associate/messages/conversations")
      return response.data
    },
  })

  const filteredConversations = conversations?.filter(
    (conv) =>
      searchQuery === "" ||
      conv.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      conv.projectName?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">Communicate with your team</p>
      </div>

      {/* Messages Interface */}
      <div className="grid lg:grid-cols-[350px_1fr] gap-4 h-[calc(100vh-220px)]">
        {/* Conversations List */}
        <Card className="flex flex-col">
          <CardContent className="p-4 flex-1 flex flex-col min-h-0">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="flex-1">
              <ConversationList
                conversations={filteredConversations || []}
                selectedId={selectedConversation}
                onSelect={setSelectedConversation}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="flex flex-col">
          {selectedConversation ? (
            <MessageThread conversationId={selectedConversation} />
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
