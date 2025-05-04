import { Box, Typography } from '@mui/material'
import React from 'react'
import Image from 'next/image'
import BackSection from './ClientComponents/BackSection'

interface NavBarNavigationSectionProps {
    label: string
    isImage?: boolean
}
const NavBarNavigation: React.FC<NavBarNavigationSectionProps> = ({ label, isImage }) => {
    return (
        <Box
            //ToDo:: need this wehn we have login functionality
            className="flex flex-col justify-center items-start h-[8%] w-[100%] lg:w-[60%] md:w-[60%] sm:w-[80%] absolute pl-28 left-[50%] top-0 transform -translate-x-1/2 bg-white text-white p-4 shadow-lg z-50"
        >
            <BackSection />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'black' }}>
                    {label}
                </Typography>
                {
                    isImage && (
                        <Box sx={{ transform: 'translateY(-5px)' }}>
                            <Image
                                src="https://testing.indiantadka.eu/assets/food.webp"
                                alt="Food image for the restaurant menu"
                                width={50}
                                height={50}
                                className="rounded"
                            />
                        </Box>
                    )
                }
            </Box>
        </Box>
    )
}

export default NavBarNavigation
