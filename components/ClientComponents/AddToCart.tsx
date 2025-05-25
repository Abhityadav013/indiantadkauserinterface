'use client'

import { useCart } from '@/hooks/useCartDetails'
import { MenuItem } from '@/lib/types/menu_type'
import { CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import toast from "react-hot-toast"
import { Plus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { openAddressModel } from '@/store/slices/addressSlice'
import { RootState } from '@/store'


interface Props {
    item: MenuItem
}

export default function AddToCartButton({ item }: Props) {
    const dispatch = useDispatch()
    const { addToCart } = useCart()
    const {customerDetails} = useSelector((state: RootState) => state.address);
    // const quantity = getItemQuantity(item.id)

    const handleAddToCart = async (item: MenuItem) => {
        if(!customerDetails || Object.keys(customerDetails).length === 0) {
            dispatch(openAddressModel())
            return;
        }
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

    return (
        <CardFooter className="flex justify-end pt-0 mt-auto">
               <Button
                    onClick={() => handleAddToCart(item)}
                    className="bg-white border rounded-none border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                    size="sm"
                >
                    <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
        </CardFooter>
    )
}