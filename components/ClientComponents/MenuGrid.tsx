"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "./CartContext"
import { FilteredMenuItem, MenuItem } from "@/lib/types/menu_type"
import ViewCartFooter from "../ViewCartFooter"
import { Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import SearchFoodCategory from "./SearchFoodCategory"

interface MenuGridProps {
    menuItems: MenuItem[],
    menuCategories: FilteredMenuItem[],
}
const MenuGrid: React.FC<MenuGridProps> = ({ menuItems }) => {
    const [openCardId, setOpenCardId] = useState<string | null>(null); // Track which card is open
    const { addToCart, removeFromCart, getItemQuantity } = useCart()
    const [showFilter, setShowFilter] = useState(false)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("")
    //   const { toast } = useToast()

    const toggleCard = (id: string) => {
        // If the clicked card is already open, close it. Otherwise, open it.
        setOpenCardId(openCardId === id ? null : id);
    };
    // Filter menu items by category if a category is selected
    const filteredItems = menuItems.filter((item) => {
        const matchesCategory = activeCategory ? item.category === activeCategory : true;
        const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            searchQuery.toLowerCase().includes(`category: ${activeCategory?.toLowerCase()}`);
        return matchesCategory && matchesSearch;
    });

    const noItemsFound = filteredItems.length === 0
    // Categories for filter buttons
    const categories = Array.from(new Set(menuItems.map((item) => item.category)))

    const handleAddToCart = (item: MenuItem) => {
        addToCart(item)
        // toast({
        //   title: "Added to cart",
        //   description: `${item.name} has been added to your cart.`,
        //   duration: 2000,
        // })
    }

    const handleRemoveFromCart = (item: MenuItem) => {
        removeFromCart(item.id)
        // toast({
        //   title: "Removed from cart",
        //   description: `${item.name} has been removed from your cart.`,
        //   variant: "destructive",
        //   duration: 2000,
        // })
    }

    return (
        <div>
            {/* Category filter buttons */}
            <SearchFoodCategory
                categories={categories}
                showFilter={showFilter}
                activeCategory={activeCategory}
                setShowFilter={setShowFilter}
                setActiveCategory={setActiveCategory}
                searchTerm={searchQuery}
                setSearchTerm={setSearchQuery} />

            {noItemsFound && (
                <div className="text-center text-lg text-gray-600 mt-6">
                    No food found
                </div>
            )}

            {/* Menu grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => {
                    const quantity = getItemQuantity(item.id)

                    return (
                        <Card key={item.id} className="overflow-hidden  rounded-none transition-all border-none py-0">
                            {/* Mobile View */}
                            <div
                                className="sm:hidden flex justify-between items-start p-3 cursor-pointer"
                                onClick={() => toggleCard(item.id)} // Toggle open card on click
                            >
                                {/* Name on left */}
                                <div className="flex flex-col">
                                    <h3 className="font-semibold text-sm">{item.itemName}</h3>
                                    {
                                        openCardId !== item.id &&
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                    }
                                </div>
                                {/* Price on right */}
                                <span className="text-sm text-[#FF6347] font-medium">
                                    €{item.price.toFixed(2)}
                                </span>
                            </div>

                            {/* Expanded content for mobile when specific card is clicked */}
                            {openCardId === item.id && (
                                <div className="sm:hidden p-3 border-none text-sm space-y-2">
                                    <div className="relative h-[120px] w-full overflow-hidden">
                                        <Image
                                            src={item.imageURL || "/placeholder.svg"}
                                            alt={item.itemName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <p className="text-muted-foreground">{item.description}</p>

                                    {/* Add/Remove Buttons */}
                                    <div className="flex justify-end">
                                        {quantity === 0 ? (
                                            <Button
                                                onClick={() => handleAddToCart(item)}
                                                className="bg-white border rounded-none border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                size="sm"
                                            >

                                                <Plus className="mr-1 h-4 w-4" />  Add
                                            </Button>
                                        ) : (
                                            <div className="flex items-center border border-green-600 space-x-2">
                                                <Button
                                                    onClick={() => handleRemoveFromCart(item)}
                                                    className="text-green-600 font-bold border-none shadow-none rounded-none bg-transparent hover:bg-transparent"
                                                    size="sm"
                                                >
                                                    -
                                                </Button>

                                                {/* Quantity Animation */}
                                                <AnimatePresence mode="wait">
                                                    <motion.span
                                                        key={quantity}
                                                        className="text-sm font-bold text-green-600"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.25 }}
                                                    >
                                                        {quantity}
                                                    </motion.span>
                                                </AnimatePresence>

                                                <Button
                                                    onClick={() => handleAddToCart(item)}
                                                    className="text-green-600 font-bold border-none shadow-none rounded-none bg-transparent hover:bg-transparent"
                                                    size="sm"
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                            }

                            {/* Desktop View */}
                            < div className="hidden sm:flex flex-col h-[300px] overflow-hidden transition-all hover:shadow-lg border-none" >
                                <div className="relative h-[140px] w-full overflow-hidden">
                                    <Image
                                        src={item.imageURL || "/placeholder.svg"}
                                        alt={item.itemName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <CardContent className="p-4 flex-1 flex flex-col">
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="font-bold">{item.itemName}</h3>
                                        <span className="ml-2 text-lg font-bold text-[#FF6347] text-primary">
                                            €{item.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                </CardContent>

                                <CardFooter className="flex justify-end p-4 pt-0 mt-auto">
                                    {quantity === 0 ? (
                                        <Button
                                            onClick={() => handleAddToCart(item)}
                                            className="bg-white border rounded-none border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                                            size="sm"
                                        >

                                            <Plus className="mr-1 h-4 w-4" />  Add
                                        </Button>
                                    ) : (
                                        <div className="flex items-center border border-green-600 space-x-2">
                                            <Button
                                                onClick={() => handleRemoveFromCart(item)}
                                                className="text-green-600 font-bold border-none shadow-none rounded-none bg-transparent hover:bg-transparent"
                                                size="sm"
                                            >
                                                -
                                            </Button>

                                            {/* Quantity Animation */}
                                            <AnimatePresence mode="wait">
                                                <motion.span
                                                    key={quantity}
                                                    className="text-sm font-bold text-green-600"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.25 }}
                                                >
                                                    {quantity}
                                                </motion.span>
                                            </AnimatePresence>

                                            <Button
                                                onClick={() => handleAddToCart(item)}
                                                className="text-green-600 font-bold border-none shadow-none rounded-none bg-transparent hover:bg-transparent"
                                                size="sm"
                                            >
                                                +
                                            </Button>
                                        </div>
                                    )}
                                </CardFooter>
                            </div>
                        </Card>
                    )
                })}
            </div >
            <div className="mt-12">
                <ViewCartFooter itmesCount={2} />
            </div>

        </div >
    )
}

export default MenuGrid