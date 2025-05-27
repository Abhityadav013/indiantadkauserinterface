'use client'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'

const AboutUsFooterNavigation = () => {
    const router = useRouter()
    const handleNavigation = (path: string) => {
        router.push(path)
    }
    return (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
            <div className="container mx-auto max-w-4xl text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Experience India in the Heart of Germany</h2>
                <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed px-4 sm:px-0">
                    Join us for an unforgettable culinary journey where every meal is a celebration of authentic flavors, warm
                    hospitality, and cultural connection.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Button
                        onClick={() => handleNavigation('/reservation')}
                        className="!px-6 !md:px-8 !py-3 !text-sm !md:text-base !bg-orange-600 !text-white !font-semibold !rounded-lg hover:!bg-orange-700 transition-colors"
                    >
                        Make a Reservation
                    </Button>

                    <Button
                        onClick={() => handleNavigation('/digital-menu')}
                        variant="outlined"
                        className="!px-6 !md:px-8 !py-3 !text-sm !md:text-base !border-white !text-white !font-semibold !rounded-lg hover:!bg-white hover:!text-gray-900 transition-colors"
                    >
                        View Our Menu
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default AboutUsFooterNavigation
