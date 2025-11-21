"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/layout/navigation"
import { ChatMessageComponent } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getChatSessions,
  saveChatSessions,
  createNewSession,
  addMessageToSession,
  deleteSession,
  generateAcademicResponse,
  type ChatSession,
} from "@/lib/chat"
import { getUser, clearUser, type User } from "@/lib/auth"
import { Bot, BookOpen, Calculator, Code, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser?.isAuthenticated) {
      router.push("/")
      return
    }
    setUser(currentUser)

    const loadedSessions = getChatSessions()
    setSessions(loadedSessions)

    if (loadedSessions.length > 0) {
      setCurrentSession(loadedSessions[0])
    }
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentSession?.messages])

  const handleLogout = () => {
    clearUser()
    router.push("/")
  }

  const handleNewSession = () => {
    const newSession = createNewSession()
    const updatedSessions = [newSession, ...sessions]
    setSessions(updatedSessions)
    saveChatSessions(updatedSessions)
    setCurrentSession(newSession)
  }

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
    }
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId)
    const updatedSessions = sessions.filter((s) => s.id !== sessionId)
    setSessions(updatedSessions)

    if (currentSession?.id === sessionId) {
      setCurrentSession(updatedSessions.length > 0 ? updatedSessions[0] : null)
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!currentSession) {
      handleNewSession()
      return
    }

    setIsLoading(true)

    // Add user message
    addMessageToSession(currentSession.id, {
      role: "user",
      content: message,
    })

    try {
      const aiResponse = await generateAcademicResponse(message, currentSession.messages)
      addMessageToSession(currentSession.id, {
        role: "assistant",
        content: aiResponse,
      })
    } catch (error) {
      console.error("Error getting AI response:", error)
      addMessageToSession(currentSession.id, {
        role: "assistant",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
      })
    }

    // Refresh sessions
    const updatedSessions = getChatSessions()
    setSessions(updatedSessions)
    const updatedCurrentSession = updatedSessions.find((s) => s.id === currentSession.id)
    if (updatedCurrentSession) {
      setCurrentSession(updatedCurrentSession)
    }

    setIsLoading(false)
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation user={user} onLogout={handleLogout} />

      <div className="flex-1 flex">
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSession?.id}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
        />

        <div className="flex-1 flex flex-col">
          {currentSession ? (
            <>
              {/* Chat Header */}
              <div className="border-b p-4 bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">AI Academic Assistant</h2>
                    <p className="text-sm text-muted-foreground">
                      Ask me about programming, mathematics, engineering, or study tips
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="max-w-4xl mx-auto">
                  {currentSession.messages.length === 0 ? (
                    <div className="text-center py-12">
                      <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Welcome to AI Assistant</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        I'm here to help you with academic questions, study strategies, and technical concepts.
                      </p>

                      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-transparent"
                          onClick={() => handleQuickQuestion("Explain data structures and algorithms")}
                        >
                          <Code className="h-4 w-4" />
                          Programming Help
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-transparent"
                          onClick={() => handleQuickQuestion("Help me with calculus concepts")}
                        >
                          <Calculator className="h-4 w-4" />
                          Math Support
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-transparent"
                          onClick={() => handleQuickQuestion("What are effective study techniques?")}
                        >
                          <BookOpen className="h-4 w-4" />
                          Study Tips
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-transparent"
                          onClick={() => handleQuickQuestion("Explain engineering principles")}
                        >
                          <Lightbulb className="h-4 w-4" />
                          Engineering
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {currentSession.messages.map((message) => (
                        <ChatMessageComponent key={message.id} message={message} userNickname={user.nickname} />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-full max-w-md text-center">
                <CardHeader>
                  <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>AI Academic Assistant</CardTitle>
                  <CardDescription>Start a new conversation to get help with your studies</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleNewSession} className="w-full">
                    Start New Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
