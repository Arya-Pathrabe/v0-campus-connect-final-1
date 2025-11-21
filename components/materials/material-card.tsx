"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type StudyMaterial, addToCart } from "@/lib/materials"
import { Download, ShoppingCart, Eye, FileText, ImageIcon, Presentation } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MaterialCardProps {
  material: StudyMaterial
  onPreview?: (material: StudyMaterial) => void
}

export function MaterialCard({ material, onPreview }: MaterialCardProps) {
  const [downloading, setDownloading] = useState(false)
  const { toast } = useToast()

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-5 w-5" />
      case "image":
        return <ImageIcon className="h-5 w-5" />
      case "ppt":
        return <Presentation className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDownloading(false)
    toast({
      title: "Download Started",
      description: `${material.title} is being downloaded.`,
    })
  }

  const handleAddToCart = () => {
    addToCart(material)
    toast({
      title: "Added to Cart",
      description: `${material.title} has been added to your cart.`,
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {material.previewImage && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={material.previewImage || "/placeholder.svg"}
            alt={material.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{material.description}</CardDescription>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            {getFileIcon(material.fileType)}
            <span className="text-xs uppercase">{material.fileType}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>by {material.uploadedBy}</span>
          <span>•</span>
          <span>{material.downloads} downloads</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="secondary">{material.subject}</Badge>
          {material.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {material.price && (
          <div className="mb-3">
            <span className="text-lg font-semibold text-primary">₹{material.price}</span>
          </div>
        )}

        <div className="flex gap-2">
          {material.price ? (
            <Button onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          ) : (
            <Button onClick={handleDownload} disabled={downloading} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              {downloading ? "Downloading..." : "Download"}
            </Button>
          )}

          {onPreview && (
            <Button variant="outline" size="icon" onClick={() => onPreview(material)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
