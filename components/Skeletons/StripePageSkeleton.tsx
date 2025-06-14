'use client'
import { Box, Skeleton } from '@mui/material'

const StripePageSkeleton = () => {
    return (
        <Box className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 px-4 mt-20">
            {/* Left Side Skeleton */}
            <Box className="flex-1 space-y-4">
                {/* Heading + Order ID */}
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="text" width="60%" height={24} />

                {/* Stripe form placeholder */}
                <Skeleton variant="rectangular" height={150} className="rounded-md" />

                {/* Pay Button */}
                <Skeleton variant="rectangular" height={48} width="100%" className="rounded-md" />
            </Box>

            {/* Right Side Security Info */}
            <Box className="flex-1 bg-gray-50 rounded-lg mt-8 text-gray-700 shadow-md text-sm h-[40%] hidden md:block p-4 space-y-4">
                {/* Skeleton for image */}
                <Skeleton variant="rectangular" width={128} height={128} className="mx-auto rounded-md" />

                {/* Heading and description */}
                <Skeleton variant="text" width="70%" height={28} className="mx-auto" />
                <Skeleton variant="text" width="90%" height={20} className="mx-auto" />
                <Skeleton variant="text" width="90%" height={20} className="mx-auto" />
                <Skeleton variant="text" width="80%" height={20} className="mx-auto" />
            </Box>
        </Box>
    )
}

export default StripePageSkeleton
