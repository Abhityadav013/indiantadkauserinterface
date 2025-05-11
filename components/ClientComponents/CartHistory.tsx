import React from "react";
import { Card, CardContent, Divider, Box, Typography } from "@mui/material";
import { getMenuData } from "@/app/menu/page";
import CartItem from "./CartItem";


const CartHistory = async () => {
    const { menuItems } = await getMenuData();
    return (
        <Card
            sx={{
                minWidth: { xs: '92vw', sm: '90vw', lg: '28vw' },
                maxWidth: { xs: '92vw', sm: '90vw', lg: '28vw' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 0,
                marginTop: 2,
                minHeight: { sm: '35vh', lg: '80vh' },
                maxHeight: { sm: '35vh', lg: '80vh' }
            }}
        >
            <CardContent
                sx={{
                    width: '100%',
                    //   paddingX: 3, // equivalent to px-6
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: 'grey.800',
                        marginBottom: 2,
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
                    {/* <Box sx={{ width: '55%' }}>Item Name</Box>
                    <Box sx={{ width: '25%' }}>Qty</Box>
                    <Box sx={{ width: '20%', textAlign: 'right' }}>Price</Box> */}
                    <Box sx={{ width: '55%' }}>Item Name</Box>
                    <Box sx={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>Qty</Box>
                    <Box sx={{ width: '20%', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: {xs:'center', sm:'center' ,lg:'flex-start'}}}>Price</Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: { xs: '35vh', sm: '35vh', lg: '70vh' },
                        overflowY: 'auto',
                        padding: '0.75rem 0 0.75rem 0',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '5px'

                    }}>
                    <CartItem menu={menuItems} />
                </Box>

            </CardContent>
        </Card>
    );
};

export default CartHistory;
