"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Community } from "@/lib/communities"
import { Users, Lock } from "lucide-react"
import Link from "next/link"

interface CommunitiesListProps {
  communities: Community[]
  userJoinedCommunities: string[]
  onJoin: (communityId: string) => void
}

export function CommunitiesList({ communities, userJoinedCommunities, onJoin }: CommunitiesListProps) {
  if (communities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No communities yet. Create one or discover existing ones!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {communities.map((community) => {
        const isJoined = userJoinedCommunities.includes(community.id)

        return (
          <Card key={community.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{community.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{community.name}</h3>
                      <p className="text-sm text-muted-foreground">Created by {community.createdBy}</p>
                    </div>
                  </div>

                  <p className="text-sm mb-3">{community.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{community.memberCount} members</span>
                    </div>
                    <Badge variant="outline">{community.subject}</Badge>
                    {community.isPrivate && (
                      <div className="flex items-center gap-1">
                        <Lock className="h-4 w-4" />
                        <span>Private</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {isJoined ? (
                    <Link href={`/community/${community.id}`}>
                      <Button className="bg-cyan-600 hover:bg-cyan-700">View</Button>
                    </Link>
                  ) : (
                    <Button variant="outline" onClick={() => onJoin(community.id)}>
                      Join
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
