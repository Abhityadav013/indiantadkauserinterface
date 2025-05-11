'use client'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Loader from '../CartLoader'
import { useCart } from '@/hooks/useCartDetails'
import { useAddressDetails } from '@/hooks/useAddressDetails'

const CartPageLoading = () => {
    const [showLoader, setShowLoader] = useState(true);
    const { loading: cartLoading } = useCart();
    const { loading: customerdetailLoading } = useAddressDetails();

    useEffect(() => {
        if (!(cartLoading && customerdetailLoading)) {
            const timer = setTimeout(() => setShowLoader(false), 3000); // delay 1s
            return () => clearTimeout(timer); // ✅ cleanup
        } else {
            setShowLoader(true);
        }
    }, [cartLoading, customerdetailLoading]);
    if (showLoader) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background:'white'
                }}
            >
                <Loader
                    loadingImage={
                        'https://testing.indiantadka.eu/assets/cartPageLoading.gif'
                    }
                    isLoading={showLoader}
                />
            </Box>
        )
    }

    return null

}

export default CartPageLoading
