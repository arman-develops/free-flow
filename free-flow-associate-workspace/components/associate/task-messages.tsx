import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Message {
  author: string;
  text: string;
  time: string;
  isOwn: boolean;
}

interface TaskMessagesProps {
  initialMessages?: Message[];
}

export default function TaskMessages({ initialMessages = [] }: TaskMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      author: "You",
      text: newMessage.trim(),
      time: "Just now",
      isOwn: true,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div className="p-4 space-y-4 m-0">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Task Messages
      </h3>

      {/* Messages */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex gap-3", msg.isOwn && "flex-row-reverse")}>
            <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
            <div className={cn("flex-1 max-w-xs", msg.isOwn && "flex flex-col items-end")}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-foreground">{msg.author}</span>
                <span className="text-xs text-muted-foreground">{msg.time}</span>
              </div>
              <div
                className={cn(
                  "rounded-lg p-2 text-sm",
                  msg.isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No messages yet. Start the conversation below.
          </div>
        )}
      </div>

      <Separator />

      {/* Message input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button size="icon" onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
