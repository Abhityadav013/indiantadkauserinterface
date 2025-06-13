'use client';

import React, { useEffect, useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import Image from "next/image";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContactUsForm from "@/components/ClientComponents/ContactUsForm";
import NavBarNavigation from "@/components/NavBarNavigation";

const ContactUs = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1500); // Adjust based on actual load time or API call
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="min-h-screen py-10 px-2 sm:px-6 md:px-12 lg:px-24 bg-white">
            <NavBarNavigation label="Contact Us" />
            <Box
                component="section"
                className="max-w-[1440px] mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
                {/* Image Section */}
                <div className="flex justify-center items-center">
                    {loading ? (
                        <Skeleton
                            variant="rectangular"
                            width={400}
                            height={400}
                            className="rounded"
                        />
                    ) : (
                        <Image
                            src="https://testing.indiantadka.eu/assets/contact-us.gif"
                            alt="Contact Us"
                            width={400}
                            height={400}
                            className="object-contain w-full h-auto max-w-sm sm:max-w-md lg:max-w-lg"
                        />
                    )}
                </div>

                {/* Contact Form */}
                <div className="flex flex-col justify-center w-full bg-white rounded px-6 py-8 sm:px-10 sm:py-10">
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton variant="text" width="80%" height={28} />
                            <Skeleton variant="text" width="60%" height={24} />
                            <Skeleton variant="text" width="90%" height={24} />
                            <Skeleton variant="rectangular" height={240} />
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 space-y-3 text-sm sm:text-base">
                                <div className="flex items-center text-gray-600">
                                    <LocationOnIcon className="mr-2 text-tomato shrink-0" />
                                    <Typography variant="body1" className="font-semibold">
                                        Friedrichstraße 69, 66538 Neunkirchen, Germany
                                    </Typography>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <PhoneIcon className="mr-2 text-tomato shrink-0" />
                                    <a
                                        href="tel:+4915212628877"
                                        className="font-semibold underline hover:text-tomato transition"
                                    >
                                        +49 1521 2628877
                                    </a>
                                </div>

                                <div className="flex items-center text-gray-600 overflow-x-auto">
                                    <EmailIcon className="mr-2 text-tomato shrink-0" />
                                    <a
                                        href="mailto:contact@indiantadka.eu"
                                        className="font-semibold underline text-xs sm:text-sm hover:text-tomato transition whitespace-nowrap"
                                    >
                                        contact@indiantadka.eu
                                    </a>
                                </div>
                            </div>
                            <ContactUsForm />
                        </>
                    )}
                </div>
            </Box>
        </div>
    );
};

export default ContactUs;
