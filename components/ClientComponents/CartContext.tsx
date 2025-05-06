// "use client"

// import { MenuItem } from "@/lib/types/menu_type"
// import { createContext, useContext, useState, type ReactNode } from "react"


// interface CartItem extends MenuItem {
//   quantity: number
// }

// interface CartContextType {
//   items: CartItem[]
//   addToCart: (item: MenuItem) => void
//   removeFromCart: (id: string) => void
//   getItemQuantity: (id: string) => number
//   getTotalItems: () => number
//   getTotalPrice: () => number
//   clearCart: () => void
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([])

//   const addToCart = (item: MenuItem) => {
//     setItems((currentItems) => {
//       // Check if the item is already in the cart
//       const existingItem = currentItems.find((i) => i.id === item.id)

//       if (existingItem) {
//         // If it exists, increase the quantity
//         return currentItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
//       } else {
//         // If it doesn't exist, add it with quantity 1
//         return [...currentItems, { ...item, quantity: 1 }]
//       }
//     })
//   }

//   const removeFromCart = (id: string) => {
//     setItems((currentItems) => {
//       // Find the item
//       const existingItem = currentItems.find((i) => i.id === id)

//       if (existingItem && existingItem.quantity > 1) {
//         // If quantity > 1, decrease the quantity
//         return currentItems.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
//       } else {
//         // If quantity is 1 or item not found, remove it completely
//         return currentItems.filter((i) => i.id !== id)
//       }
//     })
//   }

//   const getItemQuantity = (id: string) => {
//     return items.find((item) => item.id === id)?.quantity || 0
//   }

//   const getTotalItems = () => {
//     return items.reduce((total, item) => total + item.quantity, 0)
//   }

//   const getTotalPrice = () => {
//     return items.reduce((total, item) => total + item.price * item.quantity, 0)
//   }

//   const clearCart = () => {
//     setItems([])
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         items,
//         addToCart,
//         removeFromCart,
//         getItemQuantity,
//         getTotalItems,
//         getTotalPrice,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export function useCart() {
//   const context = useContext(CartContext)
//   if (context === undefined) {
//     throw new Error("useCart must be used within a CartProvider")
//   }
//   return context
// }
