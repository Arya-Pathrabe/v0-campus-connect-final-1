export interface StudyMaterial {
  id: string
  title: string
  description: string
  subject: string
  fileType: "pdf" | "doc" | "ppt" | "image"
  fileName: string
  fileUrl: string
  previewImage?: string
  uploadedBy: string
  uploadDate: string
  downloads: number
  tags: string[]
  price?: number // For vendor materials
}

export interface CartItem {
  material: StudyMaterial
  quantity: number
}

const MATERIALS_STORAGE_KEY = "campusconnect_materials"
const CART_STORAGE_KEY = "campusconnect_cart"

// Mock data for demo
const mockMaterials: StudyMaterial[] = [
  {
    id: "1",
    title: "Data Structures and Algorithms Notes",
    description: "Comprehensive notes covering all major data structures and algorithms with examples.",
    subject: "Computer Science",
    fileType: "pdf",
    fileName: "dsa-notes.pdf",
    fileUrl: "/pdf-icon.png",
    previewImage: "/data-structures-diagram.jpg",
    uploadedBy: "CodeMaster",
    uploadDate: "2024-01-15",
    downloads: 245,
    tags: ["algorithms", "data-structures", "programming"],
  },
  {
    id: "2",
    title: "Engineering Mathematics Formula Sheet",
    description: "Quick reference sheet for all important formulas in engineering mathematics.",
    subject: "Mathematics",
    fileType: "pdf",
    fileName: "math-formulas.pdf",
    fileUrl: "/math-formulas-pdf.jpg",
    previewImage: "/mathematical-equations.jpg",
    uploadedBy: "MathWiz",
    uploadDate: "2024-01-10",
    downloads: 189,
    tags: ["mathematics", "formulas", "reference"],
  },
  {
    id: "3",
    title: "Circuit Analysis Lab Manual",
    description: "Complete lab manual for circuit analysis with practical examples and solutions.",
    subject: "Electrical Engineering",
    fileType: "pdf",
    fileName: "circuit-lab.pdf",
    fileUrl: "/circuit-diagram-pdf.jpg",
    previewImage: "/electronic-circuit-diagram.jpg",
    uploadedBy: "CircuitGuru",
    uploadDate: "2024-01-08",
    downloads: 156,
    tags: ["circuits", "lab", "electrical"],
    price: 50, // Vendor material
  },
]

export function getMaterials(): StudyMaterial[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(MATERIALS_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return mockMaterials
      }
    }
  }
  return mockMaterials
}

export function saveMaterials(materials: StudyMaterial[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(materials))
  }
}

export function addMaterial(material: Omit<StudyMaterial, "id" | "uploadDate" | "downloads">): void {
  const materials = getMaterials()
  const newMaterial: StudyMaterial = {
    ...material,
    id: Date.now().toString(),
    uploadDate: new Date().toISOString().split("T")[0],
    downloads: 0,
  }
  materials.unshift(newMaterial)
  saveMaterials(materials)
}

export function getCart(): CartItem[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
  }
  return []
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }
}

export function addToCart(material: StudyMaterial): void {
  const cart = getCart()
  const existingItem = cart.find((item) => item.material.id === material.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ material, quantity: 1 })
  }

  saveCart(cart)
}

export function removeFromCart(materialId: string): void {
  const cart = getCart().filter((item) => item.material.id !== materialId)
  saveCart(cart)
}

export function clearCart(): void {
  saveCart([])
}
