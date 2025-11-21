"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUser, clearUser, type User } from "@/lib/auth"
import { GraduationCap, Users, BookOpen, Shield, Target, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser?.isAuthenticated) {
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleLogout = () => {
    clearUser()
    router.push("/")
  }

  if (!user) {
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-balance mb-4">About CampusConnect</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Connecting the academic community of Suryodaya College of Engineering & Technology through collaborative
            learning and resource sharing.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To create a unified platform where students, teachers, and alumni of Suryodaya College can share
                knowledge, collaborate on academic projects, and build lasting connections while maintaining privacy
                through anonymous interactions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To become the premier educational platform that empowers the Suryodaya College community with easy
                access to study materials, peer support, and innovative learning tools powered by artificial
                intelligence.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />
                <CardTitle>Study Materials</CardTitle>
                <CardDescription>
                  Upload, download, and share academic resources including notes, assignments, and reference materials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">PDF Support</Badge>
                  <Badge variant="secondary">Image Preview</Badge>
                  <Badge variant="secondary">Search & Filter</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <CardTitle>Anonymous Community</CardTitle>
                <CardDescription>
                  Connect with peers while maintaining privacy through nickname-based interactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Privacy First</Badge>
                  <Badge variant="secondary">College ID Verified</Badge>
                  <Badge variant="secondary">Safe Environment</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>
                  Get instant help with academic questions through our ChatGPT-powered assistant.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">24/7 Available</Badge>
                  <Badge variant="secondary">Academic Focus</Badge>
                  <Badge variant="secondary">Instant Responses</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* College Information */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Suryodaya College of Engineering & Technology</CardTitle>
            <CardDescription className="text-base">Empowering future engineers and technologists</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              CampusConnect is exclusively designed for the students, faculty, and alumni of Suryodaya College of
              Engineering & Technology. Our platform reflects the college's commitment to excellence in education and
              innovation in technology.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              <Badge>Engineering Excellence</Badge>
              <Badge>Innovation Hub</Badge>
              <Badge>Student-Centric</Badge>
              <Badge>Technology Focused</Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
