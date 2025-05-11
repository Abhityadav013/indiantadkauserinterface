"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAddressDetails } from "@/hooks/useAddressDetails";
import AddAddressButton from "@/components/ClientComponents/AddAddressButton";

export default function DeliveryError() {
    const { loading, customerDetails,handleAdddressDetailOpen } = useAddressDetails();
    const router = useRouter();
    useEffect(() => {

        if (!loading &&customerDetails && !customerDetails?.notDeliverable) {
            router.push('/cart')
        }
    }, [loading,customerDetails, router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white-50">
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6"
            >
                <Image
                    src="https://testing.indiantadka.eu/assets/fast-food-map-pin-lottie-animation-fold-1.gif"
                    alt="Delivery Error"
                    width={200}
                    height={200}
                />
            </motion.div>

            <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-3xl font-semibold text-red-600 mb-2"
            >
                Oops! Sorry...
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-700 max-w-md mb-6"
            >
                We currently don&apos;t deliver to your location. But hey, don’t go hungry!
                Change your address and let us bring the feast to you. 🍕🚚
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <AddAddressButton textToDisplay="Please change address to get your food" handleAdddressDetailOpen={handleAdddressDetailOpen} />

            </motion.div>
        </div>
    );
}
