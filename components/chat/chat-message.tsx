"use client"

import type { ChatMessage } from "@/lib/chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: ChatMessage
  userNickname: string
}

export function ChatMessageComponent({ message, userNickname }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")}>
      <Avatar className="w-8 h-8 mt-1">
        <AvatarFallback
          className={cn("text-xs", isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
        >
          {isUser ? userNickname.charAt(0).toUpperCase() : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex-1 max-w-[80%]", isUser && "flex justify-end")}>
        <Card className={cn("p-3", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
          <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
          <div
            className={cn("text-xs mt-2 opacity-70", isUser ? "text-primary-foreground/70" : "text-muted-foreground")}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
