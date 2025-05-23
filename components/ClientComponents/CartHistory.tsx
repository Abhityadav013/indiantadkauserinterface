import React from "react";
import { Card, CardContent, Divider, Box, Typography } from "@mui/material";
import CartItem from "./CartItem";
import { MenuItem } from "@/lib/types/menu_type";
import { Cart } from "@/lib/types/cart_type";

interface CartHistoryProps {
    isCartUpdated: boolean
    isCustomizeModal: boolean,
    items: Cart[],
    handleAddToCart: (item: MenuItem) => Promise<() => void>,
    handleRemoveFromCart: (item: MenuItem) => Promise<() => void>,
    getItemQuantity: (itemId: string) => number,
    getItemPriceWithMenu: (item: Cart) => {
        totalPrice: number;
        menu: MenuItem | undefined;
    }
    setCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>,
}

const CartHistory =  ({
    isCartUpdated,
    isCustomizeModal,
    items,
    handleAddToCart,
    handleRemoveFromCart,
    getItemQuantity,
    getItemPriceWithMenu,
    setCustomizeModal,
}: CartHistoryProps) => {
    return (
        <Card
            sx={{
                minWidth: { xs: '92vw', sm: '90vw', lg: '28vw' },
                maxWidth: { xs: '92vw', sm: '90vw', lg: '28vw' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 0,
                boxShadow: "none",
                // marginTop: 2,
                // minHeight: { sm: '35vh', lg: '45vh' },
                // maxHeight: { sm: '35vh', lg: '45vh' }
            }}
        >
            <CardContent
                sx={{
                    width: '100%',
                    height: '100%', // ✨ important to allow inner box to scroll
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: 'grey.800',
                        marginBottom: 0.2,
                    }}
                >
                    Cart Items
                </Typography>

                <Divider sx={{ my: 0 }} />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        // marginBottom: 2,
                        fontSize: '0.875rem', // ~14px, similar to Tailwind's text-sm
                        fontWeight: 600,
                        color: 'grey.600',
                    }}
                >
                    <Box sx={{ width: '55%' }}>Item Name</Box>
                    <Box sx={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>Qty</Box>
                    <Box sx={{ width: '20%', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'center', lg: 'flex-start' } }}>Price</Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: { xs: '35vh', sm: '35vh', lg: '35vh' },
                        overflowY: 'auto',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <CartItem
                        isCartUpdated={isCartUpdated}
                        isCustomizeModal={isCustomizeModal}
                        items={items}
                        handleAddToCart={handleAddToCart}
                        handleRemoveFromCart={handleRemoveFromCart}
                        getItemQuantity={getItemQuantity}
                        getItemPriceWithMenu={getItemPriceWithMenu}
                        setCustomizeModal={setCustomizeModal}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default CartHistory;
