"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Navigation } from "@/components/layout/navigation"
import { Badge } from "@/components/ui/badge"
import { getCommunityById, addMessageToCommunity, leaveCommunity, type Community } from "@/lib/communities"
import { type User, getUser } from "@/lib/auth"
import { ArrowLeft, Users, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { CommunitySettingsModal } from "@/components/community/community-settings-modal"

export default function CommunityPage() {
  const params = useParams()
  const communityId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [community, setCommunity] = useState<Community | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)

    const comm = getCommunityById(communityId)
    setCommunity(comm)
    setLoading(false)

    // Scroll to bottom
    scrollToBottom()
  }, [communityId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [community?.messages])

  const handleSendMessage = () => {
    if (!message.trim() || !user) return

    const success = addMessageToCommunity(communityId, user.nickname, message)
    if (success) {
      setMessage("")
      const updatedCommunity = getCommunityById(communityId)
      setCommunity(updatedCommunity)
    }
  }

  const handleLeaveCommunity = () => {
    if (!user || !confirm("Are you sure you want to leave this community?")) return

    const success = leaveCommunity(communityId, user.collegeId)
    if (success) {
      window.location.href = "/community"
    }
  }

  const handleLogout = () => {
    setUser(null)
  }

  const handleSettingsUpdated = () => {
    const updatedCommunity = getCommunityById(communityId)
    setCommunity(updatedCommunity)
    setShowSettings(false)
  }

  const handleCommunityDeleted = () => {
    window.location.href = "/community"
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">Community not found</p>
              <Link href="/community">
                <Button>Back to Communities</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const isMember = community.members.some((m) => m.userId === user.collegeId)
  const isAdmin = community.members.find((m) => m.userId === user.collegeId)?.role === "admin"

  if (!isMember) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">You are not a member of this community</p>
              <Link href="/community">
                <Button>Back to Communities</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6 h-[calc(100vh-120px)]">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Community Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className="flex items-center gap-4">
              <Link href="/community">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{community.icon}</span>
                  <h1 className="text-2xl font-bold">{community.name}</h1>
                  {community.isPrivate && <Badge variant="secondary">Private</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{community.subject}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" title={`${community.memberCount} members`}>
                <Users className="h-4 w-4" />
                <span className="ml-1 text-sm">{community.memberCount}</span>
              </Button>
              {isAdmin && (
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} title="Community settings">
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleLeaveCommunity} title="Leave community">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pb-4">
            {community.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <p className="text-muted-foreground text-lg">No messages yet</p>
                  <p className="text-sm text-muted-foreground">Start the conversation!</p>
                </div>
              </div>
            ) : (
              community.messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-cyan-100 text-cyan-700 text-xs">
                      {msg.senderName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">{msg.senderName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm mt-1 text-foreground">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-cyan-600 hover:bg-cyan-700 px-6">
              Send
            </Button>
          </div>
        </div>
      </main>

      {/* Community Settings Modal */}
      {community && (
        <CommunitySettingsModal
          open={showSettings}
          onOpenChange={setShowSettings}
          community={community}
          userId={user.collegeId || ""}
          onSettingsUpdated={handleSettingsUpdated}
          onCommunityDeleted={handleCommunityDeleted}
        />
      )}
    </div>
  )
}
