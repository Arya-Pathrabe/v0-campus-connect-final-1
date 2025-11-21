"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUser, clearUser, type User } from "@/lib/auth"
import { getMaterials, type StudyMaterial } from "@/lib/materials"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { DollarSign, Package, TrendingUp, Users, Eye, Download, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function VendorDashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [vendorMaterials, setVendorMaterials] = useState<StudyMaterial[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser?.isAuthenticated) {
      router.push("/")
      return
    }
    if (currentUser.userType !== "vendor") {
      router.push("/profile")
      return
    }
    setUser(currentUser)

    const materials = getMaterials().filter((m) => m.uploadedBy === currentUser.nickname && m.price)
    setVendorMaterials(materials)
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

  // Calculate vendor stats
  const totalRevenue = vendorMaterials.reduce((sum, material) => sum + (material.price || 0) * material.downloads, 0)
  const totalSales = vendorMaterials.reduce((sum, material) => sum + material.downloads, 0)
  const averagePrice =
    vendorMaterials.length > 0
      ? vendorMaterials.reduce((sum, material) => sum + (material.price || 0), 0) / vendorMaterials.length
      : 0

  // Chart data
  const salesData = vendorMaterials.map((material) => ({
    name: material.title.slice(0, 20) + "...",
    sales: material.downloads,
    revenue: (material.price || 0) * material.downloads,
  }))

  const subjectData = vendorMaterials.reduce(
    (acc, material) => {
      const existing = acc.find((item) => item.name === material.subject)
      if (existing) {
        existing.value += material.downloads
      } else {
        acc.push({ name: material.subject, value: material.downloads })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  const COLORS = ["#0891b2", "#6366f1", "#8b5cf6", "#06b6d4", "#10b981"]

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and track performance</p>
          </div>
          <Link href="/materials">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Material
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue}</div>
              <p className="text-xs text-muted-foreground">From {totalSales} sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorMaterials.length}</div>
              <p className="text-xs text-muted-foreground">Active materials</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{averagePrice.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Per material</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Downloads per material</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#0891b2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subject Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Distribution</CardTitle>
                  <CardDescription>Sales by subject area</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subjectData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {subjectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
                <CardDescription>Manage your study materials and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                {vendorMaterials.length > 0 ? (
                  <div className="space-y-4">
                    {vendorMaterials.map((material) => (
                      <div key={material.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        {material.previewImage && (
                          <img
                            src={material.previewImage || "/placeholder.svg"}
                            alt={material.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}

                        <div className="flex-1">
                          <h4 className="font-medium">{material.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{material.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{material.subject}</Badge>
                            <Badge variant="outline">{material.fileType.toUpperCase()}</Badge>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-semibold text-primary">₹{material.price}</div>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {material.downloads} sales
                            </div>
                          </div>
                        </div>

                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No products uploaded yet</p>
                    <Link href="/materials">
                      <Button>Upload Your First Product</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Revenue generated per material</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                  <CardDescription>Key metrics and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-medium text-primary mb-2">Top Performing Material</h4>
                    <p className="text-sm">
                      {vendorMaterials.length > 0
                        ? vendorMaterials.reduce((top, current) => (current.downloads > top.downloads ? current : top))
                            .title
                        : "No materials yet"}
                    </p>
                  </div>

                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <h4 className="font-medium text-accent mb-2">Recommendation</h4>
                    <p className="text-sm">
                      Consider creating more materials in your best-performing subject areas to maximize revenue.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
