'use client'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Loader from '../CartLoader'
import { useCart } from '@/hooks/useCartDetails'
import { useAddressDetails } from '@/hooks/useAddressDetails'

interface CartPageLoadingProps {
    loadingImage?: string
}
const CartPageLoading: React.FC<CartPageLoadingProps> = ({ loadingImage }) => {
    const [showLoader, setShowLoader] = useState(true);
    const { isLoading: cartLoading } = useCart();
    const { loading: customerdetailLoading } = useAddressDetails();

    useEffect(() => {
        if (!(cartLoading && customerdetailLoading)) {
            const timer = setTimeout(() => setShowLoader(false), 2000); // delay 1s
            return () => clearTimeout(timer); // ✅ cleanup
        } else {
            setShowLoader(true);
        }
    }, [cartLoading, customerdetailLoading]);
    if (showLoader) {
        return (
            <Box
                sx={{
                    position: 'fixed',       // Overlay over the entire screen
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'white',
                }}
            >
                <Loader
                    loadingImage={
                        loadingImage ?? 'https://testing.indiantadka.eu/assets/cartPageLoading.gif'
                    }
                    isLoading={showLoader}
                />
            </Box>
        )
    }

    return null

}

export default CartPageLoading
