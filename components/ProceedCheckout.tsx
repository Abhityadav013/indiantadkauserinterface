'use client'
import { Box, Typography } from '@mui/material'
import React from 'react'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ButtonAction from './ClientComponents/ButtonAction';

import { useRouter } from 'next/navigation';
const ProceedCheckout = () => {
    const router = useRouter();
    const handleCheckoutPage = () => {
        router.push('/checkout')
    }
    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '2.5rem' }}>
                <ShoppingCartCheckoutIcon sx={{ color: 'grey.800' }} fontSize="medium" />
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'black' }}>
                    Ready to dig in? Let’s place your order!
                </Typography>
            </Box>
            <ButtonAction textToDisplay="Proceed To Checkout" handleButtonAction={handleCheckoutPage} btnColor="tomato" /></div>
    )
}

export default ProceedCheckout
