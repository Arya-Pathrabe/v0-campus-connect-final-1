"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type CartItem, getCart, removeFromCart, clearCart } from "@/lib/materials"
import { Trash2, ShoppingCart, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CartProps {
  onCheckout?: () => void
}

export function Cart({ onCheckout }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setCartItems(getCart())
  }, [])

  const handleRemoveItem = (materialId: string) => {
    removeFromCart(materialId)
    setCartItems(getCart())
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    })
  }

  const handleClearCart = () => {
    clearCart()
    setCartItems([])
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.material.price || 0) * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardHeader className="text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle>Your Cart is Empty</CardTitle>
          <CardDescription>Add some study materials to your cart to get started.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Shopping Cart ({cartItems.length} items)</CardTitle>
            <Button variant="outline" size="sm" onClick={handleClearCart}>
              Clear Cart
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.material.id} className="flex items-center gap-4 p-4 border rounded-lg">
              {item.material.previewImage && (
                <img
                  src={item.material.previewImage || "/placeholder.svg"}
                  alt={item.material.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}

              <div className="flex-1">
                <h4 className="font-medium">{item.material.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-1">{item.material.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{item.material.subject}</Badge>
                  <span className="text-sm text-muted-foreground">by {item.material.uploadedBy}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold">₹{item.material.price}</div>
                <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
              </div>

              <Button variant="outline" size="icon" onClick={() => handleRemoveItem(item.material.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-lg font-semibold mb-4">
            <span>Total Amount:</span>
            <span>₹{totalAmount}</span>
          </div>
          <Button className="w-full" onClick={onCheckout}>
            <CreditCard className="h-4 w-4 mr-2" />
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
