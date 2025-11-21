"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Navigation } from "@/components/layout/navigation"
import { type User, getUser, saveUser, clearUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getUser()
    setUser(storedUser)
    setLoading(false)
  }, [])

  const handleAuthSuccess = (userData: { nickname: string; collegeId: string; userType: "user" | "vendor" }) => {
    const user: User = {
      ...userData,
      isAuthenticated: true,
    }
    saveUser(user)
    setUser(user)
  }

  const handleLogout = () => {
    clearUser()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user?.isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-balance mb-4">Welcome to CampusConnect</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Your platform for sharing study materials, connecting with peers, and accessing academic resources at
            Suryodaya College of Engineering & Technology.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Study Materials</CardTitle>
              <CardDescription>
                Upload and download study materials, notes, and resources shared by the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/materials">
                <Button className="w-full">Browse Materials</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Communities</CardTitle>
              <CardDescription>
                Create or join communities to chat, discuss, and share updates with groups interested in the same
                topics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/community">
                <Button className="w-full">Browse Communities</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Anonymous Community</CardTitle>
              <CardDescription>
                Connect with students, teachers, and alumni while maintaining your privacy through nicknames.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Join Discussions
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Get help with academic questions and general queries through our ChatGPT-powered assistant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chat">
                <Button variant="outline" className="w-full bg-transparent">
                  Ask Questions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* User Type Specific Content */}
        {user.userType === "vendor" && (
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent">Vendor Dashboard</CardTitle>
              <CardDescription>Manage your products and services for the college community.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/vendor-dashboard">
                <Button variant="secondary">Access Vendor Tools</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
