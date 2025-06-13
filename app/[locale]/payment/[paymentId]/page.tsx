'use client'
import React, { useEffect, useRef, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripeCheckout from '@/components/ClientComponents/StripeCheckout'
import { convertToSubcurrency } from '@/utils/convertToSubCurrency'
import NavBarNavigation from '@/components/NavBarNavigation'
import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import StripeCheckoutSkeleton from '@/components/Skeletons/StripePageSkeleton'

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

const StripeComponent = () => {
    const [clientSecret, setClientSecret] = useState("")
    const [amount, setAmount] = useState<number>(0)
    const hasFetched = useRef(false)

    useEffect(() => {
        if (hasFetched.current) return
        const existingClientSecret = sessionStorage.getItem('checkout_client_secret')
        const cartTotal = sessionStorage.getItem('cartTotal')
        if (existingClientSecret && cartTotal) {
            const orderPrice = convertToSubcurrency(Number(cartTotal))
            setAmount(orderPrice)
            setClientSecret(existingClientSecret)
            hasFetched.current = true
        }
    }, [])

    if (amount === 0) return null

    return (
        <>
            <NavBarNavigation label="Payment" isImage={false} />
            {/* Header */}
            <Box className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 px-4 mt-20">
                {/* Left Side: Stripe Form */}
                <Box className="flex-1">
                    {/* Header moved here */}
                    <Typography variant="h5" className="font-bold text-lg md:text-xl mb-2 text-center md:text-left">
                        Pay with card
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 mb-6 text-center md:text-left">
                        Order no. <span className="font-semibold">CTFTFF</span>
                    </Typography>

                    {clientSecret ? (
                        <Elements
                            stripe={stripePromise}
                            options={{ clientSecret, locale: 'en' }}
                        >
                            <StripeCheckout amount={amount} clientSecret={clientSecret} />
                        </Elements>
                    ) : (
                        <StripeCheckoutSkeleton />
                    )}
                </Box>

                {/* Right Side: Security Text */}
                <Box className="flex-1 bg-gray-50 mt-25 rounded-lg text-gray-700 shadow-md text-sm  h-[40%] hidden md:block">
                    <Box className="flex flex-col items-center p-4">
                        <Image
                            src="https://testing.indiantadka.eu/assets/paymentSecurity.gif"
                            alt="Secure Payment"
                            className="w-32 h-32 object-contain"
                            width={500}
                            height={500}
                        />
                        <Typography variant="h6" fontWeight={'bold'} marginBottom={2} className="mb-4 text-center">
                            Security and your saved cards 🔒
                        </Typography>
                        <Typography variant="body2" className="text-center">
                            For your security, we never store your full cards details.
                            Your information is encrypted and only the reference token is sent
                            to our trusted payment provider, in compliance with PCI DSS standards.
                        </Typography>
                    </Box>
                </Box>
            </Box>

        </>
    )
}

export default StripeComponent
