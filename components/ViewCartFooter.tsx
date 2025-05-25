'use client';

import React, { useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import { formatPrice } from '@/utils/valueInEuros';

interface ViewCartProps {
    itmesCount: number;
    setBasektOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewCartFooter: React.FC<ViewCartProps> = ({ itmesCount, setBasektOpen }) => {
    const [cartTotal, setCartTotal] = React.useState<string>('0,00 €');

    useEffect(() => {
        const cartTotal = sessionStorage.getItem('cartTotalAmount');
        if (cartTotal) {
            const total = JSON.parse(cartTotal);
            setCartTotal(formatPrice(Number(total)));
        }
    }, []);

    if (itmesCount <= 0) return null;

    return (
        <Box
            className="fixed left-1/2 bottom-0 transform -translate-x-1/2 bg-[#f36805] text-white shadow-lg z-50"
            sx={{
                width: '100%',
                maxWidth: '480px',
                px: 3,
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
            }}
            onClick={() => setBasektOpen(true)}
        >
            {/* Left Section: Icon + Text */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ position: 'relative' }}>
                    <IconButton disableRipple>
                        <ShoppingBasketOutlinedIcon style={{ color: 'white', fontSize: 28 }} />
                    </IconButton>
                    {/* Item Count Badge */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'black',
                            color: 'white',
                            borderRadius: '50%',
                            width: 18,
                            height: 18,
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                        }}
                    >
                        {itmesCount}
                    </Box>
                </Box>


            </Box>
            <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: "var(--font-outfit)", }}
                
            >
                View Basket
            </Typography>
            {/* Right Section: Price */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: "var(--font-outfit)", }}>
                {cartTotal}
            </Typography>
        </Box>
    );
};

export default ViewCartFooter;
