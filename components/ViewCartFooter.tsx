'use client';

import React, { useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import { formatPrice } from '@/utils/valueInEuros';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { handleBasketState } from '@/store/slices/basketSlice';
import { useGetCartQuery } from '@/store/api/cartApi';
import { MenuItem } from '@/lib/types/menu_type';

interface ViewCartProps {
    itmesCount: number;
    menuItems: MenuItem[]
}

const ViewCartFooter: React.FC<ViewCartProps> = ({ itmesCount, menuItems }) => {
    const { data: cart = { cartItems: [], basketId: '' }, isLoading } = useGetCartQuery(undefined, {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });
    const [item_count, setItemCount] = React.useState<number>(itmesCount)
    const [cartTotal, setCartTotal] = React.useState<string>('0,00 €');
    const [isBasketOpen, setBasektOpen] = React.useState<boolean>(false);
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
    const dispatch = useDispatch();
    const [hasMounted, setHasMounted] = React.useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const getCartTotal = () => {
            const cartTotal = cart?.cartItems?.reduce((total, cartItem) => {
                const foodItemMatch = menuItems.find((item) => item.id === cartItem.itemId);
                return foodItemMatch ? total + foodItemMatch.price * cartItem.quantity : total;
            }, 0);
            setCartTotal(formatPrice(Number(cartTotal)))
            return cartTotal;
        };
        if (!isLoading) {
            setItemCount(cart?.cartItems?.length)
            getCartTotal()
        }
    }, [isLoading, cart.cartItems, menuItems])


    if (!hasMounted || !isMobile || item_count <= 0) return null;

    const handleBasketToggle = () => {
        setBasektOpen(!isBasketOpen);
        dispatch(handleBasketState(!isBasketOpen));
    };
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
            onClick={() => handleBasketToggle()}
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
                        {item_count}
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
