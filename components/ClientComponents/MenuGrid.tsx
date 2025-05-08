"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MenuItem } from "@/lib/types/menu_type"
// import ViewCartFooter from "../ViewCartFooter"
import { Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import SearchFoodCategory from "./SearchFoodCategory"
import { useCart } from "@/hooks/useCartDetails"
import { Box } from "@mui/material"
import Loader from "../CartLoader"
import toast from "react-hot-toast"
import ViewCartFooter from "../ViewCartFooter"
import { IMenuTransformed } from "@/lib/interface/IMenuTransform"


interface MenuGridProps {
    menuItems: MenuItem[],
    menuCategories: Record<string, IMenuTransformed>,
}
const MenuGrid: React.FC<MenuGridProps> = ({ menuItems, menuCategories }) => {
    const [openCardId, setOpenCardId] = useState<string | null>(null); // Track which card is open
    const { loading, items, addToCart, removeFromCart, getItemQuantity, getTotalItems } = useCart()
    const [showFilter, setShowFilter] = useState(false)
    const [activeCategory, setActiveCategory] = useState<{ id: string, name: string } | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterMenuCategories, setFilterMenuCategories] = useState<Record<string, IMenuTransformed>>(menuCategories);

    useEffect(() => {
        if (activeCategory?.id) {
            const filteredMenuCategories = Object.entries(menuCategories).filter( // Use the original menuCategories here
                ([categoryId, categoryData]) => {
                    const matchesCategory = activeCategory ? categoryId === activeCategory.id : true;
                    const matchesSearch =
                        categoryData.items.some((item) =>
                            item.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ) ||
                        (activeCategory?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
                    if (matchesCategory && matchesSearch) {
                        categoryData.isExpandable = true;
                    }

                    return matchesCategory && matchesSearch;
                }
            ).map(([categoryId, categoryData]) => {
                return [categoryId, { ...categoryData }];
            });
          
            setFilterMenuCategories(Object.fromEntries(filteredMenuCategories));
        } else {
            // No active category: set all categories as not expandable
            const nonExpandableCategories = Object.entries(menuCategories).map(([categoryId, categoryData]) => {
                return [categoryId, { ...categoryData, isExpandable: categoryData.order === 1 }];
            });
    
            setFilterMenuCategories(Object.fromEntries(nonExpandableCategories));
        }


    }, [activeCategory, menuCategories, menuItems, searchQuery]); // <-- removed filterMenuCategories

    const toggleCard = (id: string) => {
        // If the clicked card is already open, close it. Otherwise, open it.
        setOpenCardId(openCardId === id ? null : id);
    };

    const toggleCategory = (categoryId: string) => {
        setFilterMenuCategories(prevState => ({
            ...prevState,
            [categoryId]: { ...prevState[categoryId], isExpandable: !prevState[categoryId].isExpandable } // Toggle the expanded state
        }));
    };

    const categories = Object.entries(filterMenuCategories).map(([categoryId, categoryData]) => ({
        id: categoryId,
        name: categoryData.categoryName
    }));

    const handleAddToCart = (itemId: string, name: string) => {
        addToCart(menuItems, itemId)
        toast.success(`${name} Added to cart`, {
            id: itemId,
            duration: 2000, // Show toast for 2 seconds
            style: {
                padding: "16px 24px", // Adjusted padding
                height: "60px", // Fixed height
                fontSize: "16px", // Fixed font size
                backgroundColor: "#28a745", // Green color for success
                color: "#fff", // White text
                borderRadius: "10px",
                marginTop: '50px'
            },
            iconTheme: {
                primary: "#fff", // White icon
                secondary: "#28a745", // Green icon
            },
        });
    };


    const handleRemoveFromCart = (item: MenuItem) => {
        removeFromCart(item.id);
        toast(`${item.name} removed from cart`, {
            id: `remove-${item.id}`,
            duration: 2000,
            style: {
                padding: "16px 24px",
                height: "60px",
                fontSize: "16px",
                backgroundColor: "#dc3545", // Red color for removal
                color: "#fff",
                borderRadius: "10px",
                marginTop: "50px",
            },
            iconTheme: {
                primary: "#fff",
                secondary: "#dc3545",
            },
        });
    };

    if (loading && !items.length) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Loader
                    loadingImage={
                        'https://testing.indiantadka.eu/assets/cart-item-loader.gif'
                    }
                    isLoading={loading}
                />
            </Box>
        );
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

            {Object.keys(filterMenuCategories)?.length === 0 && (
                <div className="text-center text-lg text-gray-600 mt-6">
                    No food found
                </div>
            )}

            {/* MOBILE VIEW: Grouped by category */}
            <div className="sm:hidden space-y-4">
                {Object.entries(filterMenuCategories).map(([categoryId, categoryData]) => {
                    const { isExpandable } = filterMenuCategories[categoryId]; // Check if the category is expanded
                    // const isExpanded = categoryData.isExpandable; // Check if the category is expandable
                    return (
                        <div key={categoryId} className="mb-2 border-0 rounded">
                            {/* Header */}
                            <div
                                className="flex items-center justify-between px-4 py-2 cursor-pointer bg-gray-100"
                                onClick={() => toggleCategory(categoryId)}
                            >
                                <h2 className="text-base font-semibold">{`${categoryData.categoryName}`}</h2>
                                <motion.div
                                    animate={{ rotate: isExpandable ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </motion.div>
                            </div>

                            {/* Collapsible Content */}
                            <AnimatePresence initial={false}>
                                {isExpandable && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        {/* Category Image (optional, if available) */}
                                        {categoryData.items[0]?.imageURL && (
                                            <div className="relative w-full h-32 mb-2">
                                                <Image
                                                    src={categoryData.items[0].imageURL}
                                                    alt={`Category ${categoryData.order}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Menu Items */}
                                        {categoryData.items.map((item) => {
                                            const quantity = getItemQuantity(item.id);
                                            return (
                                                <Card key={item.id} style={{ border: openCardId === item.id ? '1px outset' : '' }} className="overflow-hidden rounded-none transition-all border-none py-0">
                                                    <div
                                                        className={`sm:hidden flex justify-between items-start p-3 cursor-pointer ${openCardId === item.id ? 'p-0' : 'p-3'}`}
                                                        onClick={() => toggleCard(item.id)} // Toggle open card on click
                                                    >
                                                        {/* Name on left */}
                                                        <div className="flex flex-col">
                                                            <h3 className="font-semibold text-sm">{item.name}</h3>
                                                            {openCardId !== item.id && <p className="text-xs text-muted-foreground">{item.description}</p>}
                                                        </div>
                                                        {/* Price on right */}
                                                        <span className="text-sm text-[#FF6347] pr-3 font-medium">
                                                            €{item.price.toFixed(2)}
                                                        </span>
                                                    </div>

                                                    {/* Expanded content for mobile when specific card is clicked */}
                                                    {openCardId === item.id && (
                                                        <div className="sm:hidden px-3 py-0 pb-3 border-none text-sm space-y-2">
                                                            <div className="relative h-[120px] w-full overflow-hidden">
                                                                <Image
                                                                    src={item.imageURL || "/placeholder.svg"}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>

                                                            <p className="text-muted-foreground">{item.description}</p>

                                                            {/* Add/Remove Buttons */}
                                                            <div className="flex justify-end">
                                                                {quantity === 0 ? (
                                                                    <Button
                                                                        onClick={() => handleAddToCart(item.id, item.name)}
                                                                        className="bg-white border rounded-none border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                                        size="sm"
                                                                    >
                                                                        <Plus className="mr-1 h-4 w-4" /> Add
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
                                                                                transition={{ duration: 0.15 }}
                                                                            >
                                                                                {quantity}
                                                                            </motion.span>
                                                                        </AnimatePresence>

                                                                        <Button
                                                                            onClick={() => handleAddToCart(item.id, item.name)}
                                                                            className="text-green-600 font-bold border-none shadow-none rounded-none bg-transparent hover:bg-transparent"
                                                                            size="sm"
                                                                        >
                                                                            +
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Card>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>


            {/* DESKTOP VIEW: Flat grid, no grouping */}
            <div>
                {Object.entries(filterMenuCategories).map(([categoryId, categoryData]) => {
                    const { isExpandable } = filterMenuCategories[categoryId];
           
                    return (
                        <div key={categoryId} className="mb-6 border-0 rounded">
                            {/* Category Header */}
                            <div
                                className="flex items-center justify-between px-4 py-2 cursor-pointer bg-gray-100"
                                onClick={() => toggleCategory(categoryId)}
                            >
                                <h2 className="text-base font-semibold">{categoryData.categoryName}</h2>
                                <motion.div animate={{ rotate: isExpandable ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </motion.div>
                            </div>

                            {/* Expandable Content */}
                            <AnimatePresence initial={false}>
                                {isExpandable && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >

                                        {/* Responsive Grid of Food Items */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-0">
                                            {categoryData.items.map((item) => {
                                                const quantity = getItemQuantity(item.id);
                                                return (
                                                    <Card key={item.id} className="overflow-hidden transition-all border-none rounded-none mt-3 py-0">
                                                        <div className="flex flex-col h-full">
                                                            <div className="relative h-[140px] w-full overflow-hidden">
                                                                <Image
                                                                    src={item.imageURL || "/placeholder.svg"}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>

                                                            <CardContent className="p-4 flex-1 flex flex-col">
                                                                <div className="mb-2 flex items-start justify-between">
                                                                    <h3 className="font-bold">{item.name}</h3>
                                                                    <span className="ml-2 text-lg font-bold text-[#FF6347]">
                                                                        €{item.price.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                                            </CardContent>

                                                            <CardFooter className="flex justify-end p-4 pt-0 mt-auto">
                                                                {quantity === 0 ? (
                                                                    <Button
                                                                        onClick={() => handleAddToCart(item.id, item.name)}
                                                                        className="bg-white border rounded-none border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                                        size="sm"
                                                                    >
                                                                        <Plus className="mr-1 h-4 w-4" /> Add
                                                                    </Button>
                                                                ) : (
                                                                    <div className="flex items-center border border-green-600 space-x-2 px-2 py-1 rounded">
                                                                        <Button
                                                                            onClick={() => handleRemoveFromCart(item)}
                                                                            className="text-green-600 rounded-none border-none font-bold bg-transparent hover:bg-transparent"
                                                                            size="sm"
                                                                        >
                                                                            -
                                                                        </Button>

                                                                        <AnimatePresence mode="wait">
                                                                            <motion.span
                                                                                key={quantity}
                                                                                className="text-sm font-bold text-green-600"
                                                                                initial={{ opacity: 0, y: 10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                exit={{ opacity: 0, y: -10 }}
                                                                                transition={{ duration: 0.15 }}
                                                                            >
                                                                                {quantity}
                                                                            </motion.span>
                                                                        </AnimatePresence>

                                                                        <Button
                                                                            onClick={() => handleAddToCart(item.id, item.name)}
                                                                            className="text-green-600 font-bold rounded-none border-none bg-transparent hover:bg-transparent"
                                                                            size="sm"
                                                                        >
                                                                            +
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </CardFooter>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {
                getTotalItems() && (
                    <div className="mt-12">
                        <ViewCartFooter itmesCount={getTotalItems()} />
                    </div>
                )
            }
        </div>
    )
}

export default MenuGrid