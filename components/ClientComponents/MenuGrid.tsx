"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FilteredMenuItem, MenuItem } from "@/lib/types/menu_type"
// import ViewCartFooter from "../ViewCartFooter"
import { Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import SearchFoodCategory from "./SearchFoodCategory"
// import { useGetCartQuery, useUpdateCartMutation } from "@/store/api/cartApi"
import { useCart } from "@/hooks/useCartDetails"
import { Box } from "@mui/material"
import Loader from "../CartLoader"
import toast from "react-hot-toast"


interface MenuGridProps {
    menuItems: MenuItem[],
    menuCategories: FilteredMenuItem[],
}
const MenuGrid: React.FC<MenuGridProps> = ({ menuItems, menuCategories }) => {
    const [openCardId, setOpenCardId] = useState<string | null>(null); // Track which card is open
    const { loading,items, addToCart, removeFromCart, getItemQuantity } = useCart()
    const [showFilter, setShowFilter] = useState(false)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("");
    // const [updateCart] = useUpdateCartMutation();
    // Filter menu items by category if a category is selected
    const filteredItems = menuItems.filter((item) => {
        const matchesCategory = activeCategory ? item.category === activeCategory : true;
        const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            searchQuery.toLowerCase().includes(`category: ${activeCategory?.toLowerCase()}`);
        return matchesCategory && matchesSearch;
    });

    const groupedItems: Record<string, MenuItem[]> = {};
    filteredItems.forEach(item => {
        if (!groupedItems[item.category]) {
            groupedItems[item.category] = [];
        }
        groupedItems[item.category].push(item);
    });
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        Object.keys(groupedItems).forEach((cat, index) => {
            //initialState[cat] = true; // All expanded by default
            initialState[cat] = index === 0; // Only expand the first category by default
        });
        return initialState;
    });

    useEffect(() => {
        // Toggle the selected category
        setExpandedCategories(prev => ({
            ...prev,
            ...(activeCategory ? { [activeCategory]: !prev[activeCategory] } : {}),
        }));

    }, [activeCategory]);
    const toggleCard = (id: string) => {
        // If the clicked card is already open, close it. Otherwise, open it.
        setOpenCardId(openCardId === id ? null : id);
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };


    const categoryImageMap: Record<string, string> = {};
    menuCategories.forEach(cat => {
        categoryImageMap[cat.menu_name] = cat.menu_image;
    });


    const noItemsFound = filteredItems.length === 0
    // Categories for filter buttons
    const categories = Array.from(new Set(menuItems.map((item) => item.category)))

    const handleAddToCart = (itemId: string,itemName:string) => {
        addToCart(menuItems, itemId)
        toast.success(`${itemName} Added to cart`, {
            id:itemId,
            duration: 2000, // Show toast for 2 seconds
            style: {
              padding: "16px 24px", // Adjusted padding
              height: "60px", // Fixed height
              fontSize: "16px", // Fixed font size
              backgroundColor: "#28a745", // Green color for success
              color: "#fff", // White text
              borderRadius: "10px",
              marginTop:'50px'
            },
            iconTheme: {
              primary: "#fff", // White icon
              secondary: "#28a745", // Green icon
            },
          });
    };


    const handleRemoveFromCart = (item: MenuItem) => {
        removeFromCart(item.id);
        toast(`${item.itemName} removed from cart`, {
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

            {noItemsFound && (
                <div className="text-center text-lg text-gray-600 mt-6">
                    No food found
                </div>
            )}

            {/* MOBILE VIEW: Grouped by category */}
            <div className="sm:hidden space-y-4">
                {Object.entries(groupedItems).map(([category, items]) => {
                    const isExpanded = expandedCategories[category];
                    return (
                        <div key={category} className="mb-2 border-0 rounded">
                            {/* Header */}
                            <div
                                className="flex items-center justify-between px-4 py-2 cursor-pointer bg-gray-100"
                                onClick={() => toggleCategory(category)}
                            >
                                <h2 className="text-base font-semibold">{category}</h2>
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
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
                                {isExpanded && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        {/* Category Image */}
                                        {items[0]?.imageURL && (
                                            <div className="relative w-full h-32 mb-2">
                                                <Image
                                                    src={items[0].imageURL}
                                                    alt={category}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Menu Items */}
                                        {items.map(item => {
                                            const quantity = getItemQuantity(item.id);
                                            return (

                                                <Card key={item.id} className="overflow-hidden rounded-none transition-all border-none py-0">
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
                                                        <span className="text-sm text-[#FF6347] pr-3 font-medium">
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
                                                                        onClick={() => handleAddToCart(item.id,item.itemName)}
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
                                                                         onClick={() => handleAddToCart(item.id,item.itemName)}
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
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => {
                    const quantity = getItemQuantity(item.id);
                    return (
                        <Card key={item.id} className="overflow-hidden rounded-none transition-all border-none py-0">
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
                                        onClick={() => handleAddToCart(item.id,item.itemName)}
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
                                               onClick={() => handleAddToCart(item.id,item.itemName)}
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
                    );
                })}
            </div>
            {/* <div className="mt-12">
                <ViewCartFooter itmesCount={2} />
            </div> */}

        </div >
    )
}

export default MenuGrid