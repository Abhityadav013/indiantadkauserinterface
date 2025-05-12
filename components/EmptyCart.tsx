import { CardContent, Card, Typography, Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const EmptyCart = () => {
    return (
        <Card
            elevation={0}
            className="rounded-lg max-w-5xl p-4 bg-transparent"
            sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} // Ensures no MUI shadow
        >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Image
                    src={'https://testing.indiantadka.eu/assets/empty_cart.avif'}
                    alt={'empty cart'}
                    width={300}
                    height={300}
                    className="rounded-t-lg mb-4" // Added margin-bottom for spacing
                    sizes="(max-width: 268px) 100vw, 50vw"
                />
                <Typography variant="h5" className="font-semibold mb-4">
                    Good food is always cooking
                </Typography>
                <Typography variant="h6" className="mb-4">
                    Your cart is empty. Add something from the menu
                </Typography>
                <Link href="/" passHref>
                    <Button
                        variant="contained"
                        className="!bg-green-600 !text-white !hover:bg-green-700 w-full py-2"
                    >
                        Fill the Cart
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}

export default EmptyCart
