"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { updateCommunityDescription, deleteCommunity, type Community } from "@/lib/communities"

interface CommunitySettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  community: Community
  userId: string
  onSettingsUpdated: () => void
  onCommunityDeleted: () => void
}

export function CommunitySettingsModal({
  open,
  onOpenChange,
  community,
  userId,
  onSettingsUpdated,
  onCommunityDeleted,
}: CommunitySettingsModalProps) {
  const [description, setDescription] = useState(community.description)
  const [loading, setLoading] = useState(false)

  const isAdmin = community.members.find((m) => m.userId === userId)?.role === "admin"

  if (!isAdmin) return null

  const handleUpdateDescription = () => {
    if (!description.trim()) {
      alert("Description cannot be empty")
      return
    }

    setLoading(true)
    try {
      updateCommunityDescription(community.id, description, userId)
      onSettingsUpdated()
      alert("Community description updated!")
    } catch (error) {
      console.error("Error updating description:", error)
      alert("Failed to update description")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCommunity = () => {
    if (
      !confirm(
        "Are you sure you want to delete this community? This action cannot be undone and all members will be removed.",
      )
    ) {
      return
    }

    setLoading(true)
    try {
      deleteCommunity(community.id, userId)
      onCommunityDeleted()
    } catch (error) {
      console.error("Error deleting community:", error)
      alert("Failed to delete community")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Community Settings</DialogTitle>
          <DialogDescription>Manage your community settings and members</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Community Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Community Name</label>
                <p className="text-muted-foreground mt-1">{community.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mb-2"
                />
                <Button onClick={handleUpdateDescription} disabled={loading} size="sm">
                  Update Description
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <p className="text-muted-foreground mt-1">{community.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Type</label>
                <p className="text-muted-foreground mt-1">{community.isPrivate ? "Private" : "Public"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Members ({community.members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {community.members.map((member) => (
                  <div key={member.userId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-cyan-100 text-cyan-700 text-xs">
                          {member.nickname.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.nickname}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                      {member.role === "admin" ? "Admin" : "Member"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleDeleteCommunity} disabled={loading} className="w-full">
                Delete Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
