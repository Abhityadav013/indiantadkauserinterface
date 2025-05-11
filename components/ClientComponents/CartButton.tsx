"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { useCart } from "@/hooks/useCartDetails"

export default function CartButton() {
  //const { getTotalItems } = useCart()
  const totalItems = 5

  return (
    <Button variant="outline" className="relative">
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {totalItems}
        </span>
      )}
    </Button>
  )
}
