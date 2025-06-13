import { CardContent, Card, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const EmptyCart = () => {
    return (
        <Card
            elevation={0}
            className="rounded-lg max-w-5xl p-4 bg-transparent"
            sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} // Ensures no MUI shadow
        >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                {/* Responsive Image */}
                <Image
                    src={'https://testing.indiantadka.eu/assets/empty_cart.avif'}
                    alt={'empty cart'}
                    width={200}
                    height={200}
                    className="rounded-t-lg mb-4"
                    layout="intrinsic" // Maintains aspect ratio without forcing size
                    objectFit="contain" // Optional, prevents distortion
                />
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    Oops! Your Cart is Empty
                </Typography>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    It looks like your cart is empty. Why not start adding some items from the menu?
                </Typography>
            </CardContent>
        </Card>
    )
}

export default EmptyCart
