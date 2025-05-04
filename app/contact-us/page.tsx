import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";;
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContactUsForm from "@/components/ClientComponents/ContactUsForm";
import NavBarNavigation from "@/components/NavBarNavigation";

const ContactUs = () => {
    return (
        <div className="min-h-screen py-10 px-2 sm:px-6 md:px-12 lg:px-24 bg-white">
          <NavBarNavigation label="Contact Us" isImage={false} />
            <Box
                component="section"
                className="max-w-[1440px] mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
                {/* Image Section */}
                <div className="flex justify-center items-center">
                    <Image
                        src="https://testing.indiantadka.eu/assets/contact-us.gif"
                        alt="Contact Us"
                        width={400}
                        height={400}
                        className="object-contain w-full h-auto max-w-sm sm:max-w-md lg:max-w-lg"
                    />
                </div>

                {/* Contact Form */}
                <div className="flex flex-col justify-center w-full bg-white rounded px-6 py-8 sm:px-10 sm:py-10">
            
                    <div className="mb-6 space-y-3 text-sm sm:text-base">
                        <div className="flex items-center text-gray-600">
                            <LocationOnIcon className="mr-2 text-tomato shrink-0" />
                            <Typography variant="body1" className="font-semibold">
                                Friedrichstraße 69, 66538 Neunkirchen, Germany
                            </Typography>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center text-gray-600">
                            <PhoneIcon className="mr-2 text-tomato shrink-0" />
                            <a
                                href="tel:+4915212628877"
                                className="font-semibold underline hover:text-tomato transition"
                            >
                                +49 1521 2628877
                            </a>
                        </div>

                        {/* Email */}
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
                </div>
            </Box>
        </div>
    );
};

export default ContactUs;
