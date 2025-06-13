'use client'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Loader from '../CartLoader'

interface MenuPageLoadingProps {
    loadingImage?: string
}
const MenuPageLoading: React.FC<MenuPageLoadingProps> = ({ loadingImage }) => {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowLoader(false), 2000); // delay 1s
        return () => clearTimeout(timer); // ✅ cleanup
    }, []);
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

export default MenuPageLoading