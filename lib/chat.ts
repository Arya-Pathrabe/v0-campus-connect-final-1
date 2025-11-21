export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

const CHAT_STORAGE_KEY = "campusconnect_chat_sessions"

export function getChatSessions(): ChatSession[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    if (stored) {
      try {
        const sessions = JSON.parse(stored)
        return sessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }))
      } catch {
        return []
      }
    }
  }
  return []
}

export function saveChatSessions(sessions: ChatSession[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions))
  }
}

export function createNewSession(title?: string): ChatSession {
  return {
    id: Date.now().toString(),
    title: title || "New Chat",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export function addMessageToSession(sessionId: string, message: Omit<ChatMessage, "id" | "timestamp">): void {
  const sessions = getChatSessions()
  const sessionIndex = sessions.findIndex((s) => s.id === sessionId)

  if (sessionIndex !== -1) {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    sessions[sessionIndex].messages.push(newMessage)
    sessions[sessionIndex].updatedAt = new Date()

    // Auto-generate title from first user message
    if (sessions[sessionIndex].messages.length === 1 && message.role === "user") {
      sessions[sessionIndex].title = message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "")
    }

    saveChatSessions(sessions)
  }
}

export function deleteSession(sessionId: string): void {
  const sessions = getChatSessions().filter((s) => s.id !== sessionId)
  saveChatSessions(sessions)
}

export async function generateAcademicResponse(userMessage: string, chatHistory: ChatMessage[] = []): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        chatHistory: chatHistory.slice(-10), // Send last 10 messages for context
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get AI response")
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error("Error generating AI response:", error)
    // Fallback to a helpful error message
    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment. In the meantime, feel free to ask specific questions about programming, mathematics, engineering, or study strategies, and I'll do my best to help you!"
  }
}
