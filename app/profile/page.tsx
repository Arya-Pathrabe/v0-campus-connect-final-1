"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUser, clearUser, saveUser, type User } from "@/lib/auth"
import { getMaterials } from "@/lib/materials"
import { UserIcon, Edit, Save, BookOpen, Download, Upload, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    nickname: "",
    bio: "",
    interests: "",
    year: "",
    department: "",
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser?.isAuthenticated) {
      router.push("/")
      return
    }
    setUser(currentUser)
    setProfileData({
      nickname: currentUser.nickname,
      bio: "Engineering student passionate about technology and innovation.",
      interests: "Programming, Data Structures, Machine Learning",
      year: "3rd Year",
      department: "Computer Science Engineering",
    })
  }, [router])

  const handleLogout = () => {
    clearUser()
    router.push("/")
  }

  const handleSave = async () => {
    setSaving(true)

    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (user) {
      const updatedUser = { ...user, nickname: profileData.nickname }
      saveUser(updatedUser)
      setUser(updatedUser)
    }

    setIsEditing(false)
    setSaving(false)

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const userMaterials = getMaterials().filter((material) => material.uploadedBy === user.nickname)
  const totalDownloads = userMaterials.reduce((sum, material) => sum + material.downloads, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {user.nickname.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{user.nickname}</CardTitle>
                <CardDescription>{user.userType === "vendor" ? "Vendor Account" : "Student Account"}</CardDescription>
                <div className="flex justify-center mt-2">
                  <Badge variant={user.userType === "vendor" ? "default" : "secondary"}>
                    {user.userType === "vendor" ? "Vendor" : "Student"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">College ID</p>
                  <p className="font-mono font-medium">{user.collegeId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{userMaterials.length}</p>
                    <p className="text-xs text-muted-foreground">Materials Uploaded</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{totalDownloads}</p>
                    <p className="text-xs text-muted-foreground">Total Downloads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile Details</TabsTrigger>
                <TabsTrigger value="materials">My Materials</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Manage your profile details and preferences</CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        disabled={saving}
                      >
                        {isEditing ? (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? "Saving..." : "Save"}
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nickname">Nickname</Label>
                        <Input
                          id="nickname"
                          value={profileData.nickname}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, nickname: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Academic Year</Label>
                        <Input
                          id="year"
                          value={profileData.year}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, year: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, department: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interests">Interests</Label>
                      <Input
                        id="interests"
                        value={profileData.interests}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, interests: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Separate interests with commas"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials">
                <Card>
                  <CardHeader>
                    <CardTitle>My Uploaded Materials</CardTitle>
                    <CardDescription>Materials you've shared with the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userMaterials.length > 0 ? (
                      <div className="space-y-4">
                        {userMaterials.map((material) => (
                          <div key={material.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="p-2 bg-primary/10 rounded">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{material.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1">{material.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{material.subject}</Badge>
                                <span className="text-xs text-muted-foreground">{material.downloads} downloads</span>
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {material.uploadDate}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No materials uploaded yet</p>
                        <Button className="mt-4" onClick={() => router.push("/materials")}>
                          Upload Your First Material
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="p-2 bg-green-100 rounded">
                          <Upload className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Uploaded study material</p>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="p-2 bg-blue-100 rounded">
                          <Download className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Downloaded course notes</p>
                          <p className="text-sm text-muted-foreground">1 day ago</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="p-2 bg-purple-100 rounded">
                          <UserIcon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Updated profile information</p>
                          <p className="text-sm text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
