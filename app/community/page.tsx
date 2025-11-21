"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/layout/navigation"
import { CreateCommunityModal } from "@/components/community/create-community-modal"
import { CommunitiesList } from "@/components/community/communities-list"
import { getAllCommunities, joinCommunity, getUserCommunities, type Community } from "@/lib/communities"
import { type User, getUser } from "@/lib/auth"
import { Search, Plus } from "lucide-react"

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null)
  const [communities, setCommunities] = useState<Community[]>([])
  const [userCommunities, setUserCommunities] = useState<Community[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "joined">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getUser()
    setUser(currentUser)

    if (currentUser) {
      const allCommunities = getAllCommunities()
      setCommunities(allCommunities)

      const userComms = getUserCommunities(currentUser.collegeId)
      setUserCommunities(userComms)
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    setUser(null)
  }

  const handleJoinCommunity = (communityId: string) => {
    if (!user) return

    const joined = joinCommunity(communityId, user)
    if (joined) {
      // Refresh communities
      const allCommunities = getAllCommunities()
      setCommunities(allCommunities)

      const userComms = getUserCommunities(user.collegeId)
      setUserCommunities(userComms)
    }
  }

  const handleCommunityCreated = () => {
    const allCommunities = getAllCommunities()
    setCommunities(allCommunities)

    if (user) {
      const userComms = getUserCommunities(user.collegeId)
      setUserCommunities(userComms)
    }
  }

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredUserCommunities = userCommunities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const userCommunityIds = userCommunities.map((c) => c.id)

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-balance">Communities</h1>
              <p className="text-muted-foreground mt-2">
                Join or create communities to connect with others about any topic
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-cyan-600 hover:bg-cyan-700 whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search communities by name, topic, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button variant={activeTab === "all" ? "default" : "outline"} onClick={() => setActiveTab("all")}>
              All Communities ({communities.length})
            </Button>
            <Button variant={activeTab === "joined" ? "default" : "outline"} onClick={() => setActiveTab("joined")}>
              My Communities ({userCommunities.length})
            </Button>
          </div>

          {/* Communities List */}
          {activeTab === "all" ? (
            <CommunitiesList
              communities={filteredCommunities}
              userJoinedCommunities={userCommunityIds}
              onJoin={handleJoinCommunity}
            />
          ) : (
            <CommunitiesList
              communities={filteredUserCommunities}
              userJoinedCommunities={userCommunityIds}
              onJoin={handleJoinCommunity}
            />
          )}
        </div>
      </main>

      {/* Create Community Modal */}
      <CreateCommunityModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        user={user}
        onCommunityCreated={handleCommunityCreated}
      />
    </div>
  )
}
