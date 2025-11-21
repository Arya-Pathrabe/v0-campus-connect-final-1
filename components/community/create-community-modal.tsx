"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createCommunity } from "@/lib/communities"
import type { User } from "@/lib/auth"

interface CreateCommunityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onCommunityCreated: () => void
}

export function CreateCommunityModal({ open, onOpenChange, user, onCommunityCreated }: CreateCommunityModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreate = () => {
    if (!name.trim() || !description.trim() || !subject.trim()) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      createCommunity(name, description, subject, user, isPrivate)
      setName("")
      setDescription("")
      setSubject("")
      setIsPrivate(false)
      onOpenChange(false)
      onCommunityCreated()
    } catch (error) {
      console.error("Error creating community:", error)
      alert("Failed to create community")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Community</DialogTitle>
          <DialogDescription>Start a new group to chat and share with others about any topic</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="community-name">Community Name</Label>
            <Input
              id="community-name"
              placeholder="e.g., Data Structures Study Group"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="community-subject">Subject/Topic</Label>
            <Input
              id="community-subject"
              placeholder="e.g., Programming, Mathematics, Career Advice"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="community-description">Description</Label>
            <Textarea
              id="community-description"
              placeholder="Describe what this community is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="private" className="text-sm">
              Private Community (members only)
            </Label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
              {loading ? "Creating..." : "Create Community"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
