'use client'

import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Loading() {
    const [showImage, setShowImage] = useState(true);

    // Hide the image after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImage(false);
        }, 5000); // 2000 ms = 2 seconds

        // Cleanup the timer when the component is unmounted
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex items-center justify-center h-screen relative bg-white">
            {/* Fullscreen loading image */}
            {showImage && (
                <Image
                    src="https://testing.indiantadka.eu/assets/loadingGlass.gif"
                    alt="loading"
                    width={100}
                    height={100}
                />
            )}

            {/* Text that will appear after the image is hidden */}
        </div>
    );
}
