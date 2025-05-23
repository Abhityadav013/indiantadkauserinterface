'use client'

import { useCart } from '@/hooks/useCartDetails'
import { MenuItem } from '@/lib/types/menu_type'
import { CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import toast from "react-hot-toast"
import { Plus } from 'lucide-react'


interface Props {
    item: MenuItem
}

export default function AddToCartButton({ item }: Props) {
    const { addToCart } = useCart()
    // const quantity = getItemQuantity(item.id)

    const handleAddToCart = async (item: MenuItem) => {
        await addToCart(item)
        //updateCart({ cart: updatedCart });
        toast.success(`${item.name} Added to cart`, {
            id: item.id,
            duration: 2000, // Show toast for 2 seconds
            style: {
                padding: "16px 24px", // Adjusted padding
                height: "60px", // Fixed height
                fontSize: "16px", // Fixed font size
                backgroundColor: "#28a745", // Green color for success
                color: "#fff", // White text
                borderRadius: "10px",
                marginTop: '20px'
            },
            iconTheme: {
                primary: "#fff", // White icon
                secondary: "#28a745", // Green icon
            },
        });
    };


    // const handleRemoveFromCart = async (item: MenuItem) => {
    //     await removeFromCart(item);
    //     //  updateCart({ cart: updatedCart });
    //     toast(`${item.name} removed from cart`, {
    //         id: `remove-${item.id}`,
    //         duration: 2000,
    //         style: {
    //             padding: "16px 24px",
    //             height: "60px",
    //             fontSize: "16px",
    //             backgroundColor: "#dc3545", // Red color for removal
    //             color: "#fff",
    //             borderRadius: "10px",
    //             marginTop: "50px",
    //         },
    //         iconTheme: {
    //             primary: "#fff",
    //             secondary: "#dc3545",
    //         },
    //     });
    // };

    return (
        <CardFooter className="flex justify-end p-4 pt-0 mt-auto">
               <Button
                    onClick={() => handleAddToCart(item)}
                    className="bg-white border rounded-none border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                    size="sm"
                >
                    <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
            {/* {quantity === 0 ? (
                <Button
                    onClick={() => handleAddToCart(item)}
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
                        onClick={() => handleAddToCart(item)}
                        className="text-green-600 font-bold rounded-none border-none bg-transparent hover:bg-transparent"
                        size="sm"
                    >
                        +
                    </Button>
                </div>
            )} */}
        </CardFooter>
    )
}