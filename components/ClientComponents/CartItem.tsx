'use client'
import { Box, LinearProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCartDetails';
import { MenuItem } from '@/lib/types/menu_type';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

interface CartItemProps {
    menu: MenuItem[]
}
const CartItem: React.FC<CartItemProps> = ({ menu }) => {
    const [showLoader, setShowLoader] = useState(true);
    const [isCustomizeModal, setCustomizeModal] = useState(false);
    const { isLoading, items, addToCart,removeFromCart, menuItems, getItemQuantity, updateMenuItems, getItemPriceWithMenu } = useCart()
    const [isCartUpdated, setCartUpdated] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => setShowLoader(false), 1000); // delay 1s
            return () => clearTimeout(timer); // ✅ cleanup
        } else {
            setShowLoader(true);
        }
    }, [isLoading]);
    useEffect(() => {
        if (!menuItems.length) {
            updateMenuItems(menu)
        }
    }, [menuItems, menu, updateMenuItems])

    const handleAddToCart = async (item: MenuItem) => {
        await addToCart(item);
        //updateCart({ cart: updatedCart });
    
        setCartUpdated(true);
        const timer = setTimeout(() => {
            // updateCart({ cart: updatedCart });
            setCartUpdated(false);
        }, 1000); // Show loading indicator for 1 second
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
                marginTop: '50px'
            },
            iconTheme: {
                primary: "#fff", // White icon
                secondary: "#28a745", // Green icon
            },
        });
        return () => clearTimeout(timer);
    
    };

    const handleRemoveFromCart = async(item: MenuItem) => {
        await removeFromCart(item);
        setCartUpdated(true);
        const timer = setTimeout(() => {
            // updateCart({ cart: updatedCart });
            setCartUpdated(false);
        }, 1000); // Show loading indicator for 1 second
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
        return () => clearTimeout(timer);

    };

    // foodCartLoader
    if (showLoader) {
        return (
            <Image
                src='https://testing.indiantadka.eu/assets/foodCartLoader.gif'
                alt="Loading..."
                width={400}
                height={400} // Assuming the image is square
            />
        );
    }
    return (
        <React.Fragment>
            <Box sx={{ width: '100%', height: 4, mb: 5 }}>
                {isCartUpdated && (
                    <motion.div
                        initial={false}
                        animate={{ opacity: isCartUpdated ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ height: 8, marginBottom: '0.5rem' }} // margin to make it visible
                    >
                        <LinearProgress
                            sx={{
                                height: '100%',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: 'tomato',
                                },
                                backgroundColor: 'lightgray',
                            }}
                        />
                    </motion.div>
                )}
            </Box>
            {
                items.map((item) => {
                    const quantity = getItemQuantity(item.itemId)
                    //const quantity = item.quantity ?? 0
                    const { totalPrice: itemTotal, menu: currentMenuItem } = getItemPriceWithMenu(item)
                    // const cartDescription = cartDescriptions.find(di => di.itemId === item.id);

                    return (
                        <React.Fragment key={item.itemId}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    gap: '1rem'
                                }}
                            >
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 2 }}>
                                    <Box
                                        sx={{ flex: '1 1 0%', width: '50%' }}>
                                        <Typography variant="body2" className="text-gray-700 text-sm">
                                            {item.itemName}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            className="text-blue-500 cursor-pointer"
                                            onClick={() => setCustomizeModal(true)}
                                        >
                                            Customize
                                        </Typography>
                                        {isCustomizeModal && (
                                            <></>
                                            // <CartCustomizeDialog
                                            //     isOpen={isCustomizeModal}
                                            //     onClose={handleCustomizeModal}
                                            //     foodData={{ itemId: item.id, itemName: item.itemName }}
                                            //     onSubmit={handleItemDescription}
                                            //     cartDescription={String(cartDescription?.description || '')}
                                            // />
                                        )}
                                    </Box>
                                    <Box sx={{
                                        width: '25%',
                                        left: '10%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: '0.1rem',
                                        marginX: '0.75rem'
                                    }}
                                        className=" border border-gray-500"
                                    >

                                        <Button
                                            onClick={() => handleRemoveFromCart(currentMenuItem || {} as MenuItem)}
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
                                                transition={{ duration: 0.45 }}
                                            >
                                                {quantity}
                                            </motion.span>
                                        </AnimatePresence>

                                        <Button
                                            onClick={() => handleAddToCart(currentMenuItem || {} as MenuItem)}
                                            className="text-green-600 font-bold border-none shadow-none rounded-none bg-transparent hover:bg-transparent"
                                            size="sm"
                                        >
                                            +
                                        </Button>
                                    </Box>
                                    {/* Price Section */}
                                    <Box sx={{
                                        width: '15%',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        marginX: '0.75rem'
                                    }}>
                                        <Typography variant="body2" className="font-semibold text-gray-800 text-sm">
                                            €{itemTotal.toFixed(2)}  {/* Ensuring the price is formatted correctly */}
                                        </Typography>
                                    </Box>

                                </Box>
                            </Box>
                        </React.Fragment>
                    );
                })
            }
        </React.Fragment>
    );
};

export default CartItem;
