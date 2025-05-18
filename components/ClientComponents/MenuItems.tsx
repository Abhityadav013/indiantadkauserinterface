"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardMedia, Typography, Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { Add, Remove, Close, Info } from "@mui/icons-material"
import Image from "next/image"
import { useCart } from "@/hooks/useCartDetails"
import { MenuItem } from "@/lib/types/menu_type"
import { MenuCategory } from "@/lib/types/menu_category"

interface MenuItemsProps {
  menuItems: MenuItem[]
  categories: MenuCategory[]
}

export default function MenuItems({ menuItems, categories }: MenuItemsProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const { addToCart, removeFromCart, items:cartItems } = useCart()

  // Create refs for each category section to track which is in view
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryRefs = useRef<Record<string, any>>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories.reduce<Record<string, any>>((acc, category) => {
      acc[category.id] = null
      return acc
    }, {}),
  )

  const [categoryInView, setCategoryInView] = useState<string | null>(null)
  console.log('categoryInView:::::::',categoryInView)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryId = entry.target.id.replace("category-", "")
            setCategoryInView(categoryId)
          }
        })
      },
      {
        threshold: 0.5,
      },
    )

    Object.values(categoryRefs.current).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [categories])

  // Group menu items by category
  const itemsByCategory = categories
    .sort((a, b) => a.order - b.order)
    .map((category) => {
      const items = menuItems.filter((item) => item.category.id === category.id)
      return { category, items }
    })
    .filter((group) => group.items.length > 0)

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const getItemQuantity = (itemId: string) => {
    const item = cartItems.find((item) => item.itemId === itemId)
    return item ? item.quantity : 0
  }

  return (
    <div className="pb-24 md:pb-8">
      {itemsByCategory.map(({ category, items }) => (
        <div key={category.id} id={`category-${category.id}`} ref={categoryRefs.current[category.id]} className="mb-8">
          <Typography variant="h5" component="h2" className="font-bold mb-4">
            {category.categoryName}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className={`overflow-hidden menu-card ${expandedItems.has(item.id) ? "md:col-span-2" : ""}`}
              >
                <div className={`flex ${expandedItems.has(item.id) ? "flex-col" : "flex-row"} md:flex-row`}>
                  <div className={`${expandedItems.has(item.id) ? "w-full" : "w-1/3"} md:w-1/3`}>
                    <CardMedia component="div" className="relative h-32 md:h-full">
                      <Image
                        src={item.imageURL || "/placeholder.svg?height=200&width=200"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </CardMedia>
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Typography variant="h6" component="h3" className="font-bold">
                        {item.name}
                      </Typography>
                      <Typography variant="h6" className="font-bold">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </div>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className={`mb-4 ${expandedItems.has(item.id) ? "" : "line-clamp-2"}`}
                    >
                      {item.description}
                      {!expandedItems.has(item.id) && item.description.length > 100 && (
                        <button className="text-primary ml-1 font-medium" onClick={() => toggleExpand(item.id)}>
                          ...more
                        </button>
                      )}
                    </Typography>

                    <div className="flex justify-between items-center">
                      {getItemQuantity(item.id) === 0 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Add />}
                          onClick={() => addToCart(item)}
                          className="bg-primary hover:bg-primary-dark btn-primary"
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <IconButton
                            size="small"
                            onClick={() => removeFromCart(item)}
                            className="border border-gray-300"
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography>{getItemQuantity(item.id)}</Typography>
                          <IconButton size="small" onClick={() => addToCart(item)} className="border border-gray-300">
                            <Add fontSize="small" />
                          </IconButton>
                        </div>
                      )}

                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => setSelectedItem(item)}
                        startIcon={<Info />}
                        className="text-primary hover:bg-gray-100"
                      >
                        More
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)} maxWidth="md" fullWidth>
        {selectedItem && (
          <>
            <DialogTitle className="flex justify-between items-center">
              <Typography variant="h6" component="h2" className="font-bold">
                {selectedItem.name}
              </Typography>
              <IconButton onClick={() => setSelectedItem(null)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="mb-4 relative h-64 w-full">
                <Image
                  src={selectedItem.imageURL || "/placeholder.svg?height=400&width=600"}
                  alt={selectedItem.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex justify-between items-center mb-4">
                <Typography variant="h5" component="p" className="font-bold">
                  ${selectedItem.price.toFixed(2)}
                </Typography>

                {getItemQuantity(selectedItem.id) === 0 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => addToCart(selectedItem)}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <IconButton
                      size="small"
                      onClick={() => removeFromCart(selectedItem)}
                      className="border border-gray-300"
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography>{getItemQuantity(selectedItem.id)}</Typography>
                    <IconButton size="small" onClick={() => addToCart(selectedItem)} className="border border-gray-300">
                      <Add fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </div>

              <Typography variant="body1" className="mb-4">
                {selectedItem.description}
              </Typography>

              <div className="p-4 bg-gray-100 rounded-lg">
                <Typography variant="subtitle1" className="font-medium mb-2">
                  Allergic Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Information not available. Please ask our staff for details.
                </Typography>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  )
}
