import type { User } from "./auth"

export interface CommunityMember {
  userId: string
  nickname: string
  joinedAt: number
  role: "admin" | "member"
}

export interface CommunityMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: number
}

export interface Community {
  id: string
  name: string
  description: string
  subject: string
  createdBy: string
  createdAt: number
  members: CommunityMember[]
  messages: CommunityMessage[]
  icon: string
  isPrivate: boolean
  memberCount: number
}

const STORAGE_KEY = "campus_communities"
const COMMUNITY_MESSAGES_KEY_PREFIX = "campus_community_messages_"

export function getAllCommunities(): Community[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function getCommunityById(communityId: string): Community | null {
  const communities = getAllCommunities()
  return communities.find((c) => c.id === communityId) || null
}

export function createCommunity(
  name: string,
  description: string,
  subject: string,
  user: User,
  isPrivate = false,
): Community {
  const community: Community = {
    id: `community_${Date.now()}`,
    name,
    description,
    subject,
    createdBy: user.nickname,
    createdAt: Date.now(),
    members: [
      {
        userId: user.collegeId,
        nickname: user.nickname,
        joinedAt: Date.now(),
        role: "admin",
      },
    ],
    messages: [],
    icon: String.fromCodePoint(0x1f4ac),
    isPrivate,
    memberCount: 1,
  }

  const communities = getAllCommunities()
  communities.push(community)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(communities))

  return community
}

export function joinCommunity(communityId: string, user: User): boolean {
  const communities = getAllCommunities()
  const community = communities.find((c) => c.id === communityId)

  if (!community) return false

  // Check if user already member
  if (community.members.find((m) => m.userId === user.collegeId)) {
    return true
  }

  community.members.push({
    userId: user.collegeId,
    nickname: user.nickname,
    joinedAt: Date.now(),
    role: "member",
  })

  community.memberCount = community.members.length

  localStorage.setItem(STORAGE_KEY, JSON.stringify(communities))
  return true
}

export function leaveCommunity(communityId: string, userId: string): boolean {
  const communities = getAllCommunities()
  const community = communities.find((c) => c.id === communityId)

  if (!community) return false

  community.members = community.members.filter((m) => m.userId !== userId)
  community.memberCount = community.members.length

  localStorage.setItem(STORAGE_KEY, JSON.stringify(communities))
  return true
}

export function addMessageToCommunity(communityId: string, senderName: string, message: string): boolean {
  const communities = getAllCommunities()
  const community = communities.find((c) => c.id === communityId)

  if (!community) return false

  community.messages.push({
    id: `msg_${Date.now()}`,
    senderId: senderName,
    senderName,
    message,
    timestamp: Date.now(),
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(communities))
  return true
}

export function getCommunityMessages(communityId: string): CommunityMessage[] {
  const community = getCommunityById(communityId)
  return community?.messages || []
}

export function getUserCommunities(userId: string): Community[] {
  const communities = getAllCommunities()
  return communities.filter((c) => c.members.some((m) => m.userId === userId))
}

export function deleteCommunity(communityId: string, userId: string): boolean {
  const communities = getAllCommunities()
  const community = communities.find((c) => c.id === communityId)

  if (!community) return false

  // Only admin can delete
  const userMember = community.members.find((m) => m.userId === userId)
  if (userMember?.role !== "admin") return false

  const filtered = communities.filter((c) => c.id !== communityId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}

export function updateCommunityDescription(communityId: string, description: string, userId: string): boolean {
  const communities = getAllCommunities()
  const community = communities.find((c) => c.id === communityId)

  if (!community) return false

  const userMember = community.members.find((m) => m.userId === userId)
  if (userMember?.role !== "admin") return false

  community.description = description
  localStorage.setItem(STORAGE_KEY, JSON.stringify(communities))
  return true
}
