"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MaterialCard } from "@/components/materials/material-card"
import { UploadForm } from "@/components/materials/upload-form"
import { Cart } from "@/components/materials/cart"
import { type StudyMaterial, getMaterials } from "@/lib/materials"
import { getUser } from "@/lib/auth"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedFileType, setSelectedFileType] = useState("all")
  const [activeTab, setActiveTab] = useState("browse")
  const [user, setUser] = useState(getUser())
  const router = useRouter()

  useEffect(() => {
    const loadedMaterials = getMaterials()
    setMaterials(loadedMaterials)
    setFilteredMaterials(loadedMaterials)
  }, [])

  useEffect(() => {
    let filtered = materials

    if (searchQuery) {
      filtered = filtered.filter(
        (material) =>
          material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter((material) => material.subject === selectedSubject)
    }

    if (selectedFileType !== "all") {
      filtered = filtered.filter((material) => material.fileType === selectedFileType)
    }

    setFilteredMaterials(filtered)
  }, [materials, searchQuery, selectedSubject, selectedFileType])

  const subjects = Array.from(new Set(materials.map((m) => m.subject)))
  const fileTypes = Array.from(new Set(materials.map((m) => m.fileType)))

  const handleUploadSuccess = () => {
    const loadedMaterials = getMaterials()
    setMaterials(loadedMaterials)
    setActiveTab("browse")
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (!user?.isAuthenticated) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Study Materials</h1>
              <p className="text-muted-foreground">Share and discover academic resources</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="cart">Cart</TabsTrigger>
            <TabsTrigger value="my-materials">My Materials</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {fileTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Materials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>

            {filteredMaterials.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No materials found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <UploadForm userNickname={user.nickname} onSuccess={handleUploadSuccess} />
          </TabsContent>

          <TabsContent value="cart">
            <Cart onCheckout={handleCheckout} />
          </TabsContent>

          <TabsContent value="my-materials">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials
                .filter((material) => material.uploadedBy === user.nickname)
                .map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
