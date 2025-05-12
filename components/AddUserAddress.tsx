'use client';
import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import { useAddressDetails } from "@/hooks/useAddressDetails";
import { motion } from "framer-motion";
import Image from "next/image";
import AddressForm from "./ClientComponents/AddressForm";
import { CustomerDetails, CustomerOrder } from "@/lib/types/customer_order_type";
import CartPageLoading from "./ClientComponents/CartPageLoading";

const AddUserAddress: React.FC = () => {
    const [showLoader, setShowLoader] = useState(true);
    const { loading: customerdetailLoading } = useAddressDetails();

    const { customerDetails, customerOrder, formError, isAddressModelOpen, setFormError, handleAdddressDetailOpen, handleAdddressDetailClose, handleUpdateCustomerDetails } = useAddressDetails();
    const theme = useTheme();


    useEffect(() => {
        if (!customerdetailLoading) {
            const timer = setTimeout(() => setShowLoader(false), 1000); // delay 1s
            return () => clearTimeout(timer); // ✅ cleanup
        } else {
            setShowLoader(true);
        }
    }, [customerdetailLoading]);
    if (showLoader) {
        return (<CartPageLoading loadingImage={'https://testing.indiantadka.eu/assets/cartPageAgainLoading.gif'} />)
    } else if (customerDetails && Object.keys(customerDetails).length > 0) {
        return null;
    }
    return (
        <Box
            component="section"
            sx={{
                minHeight: '100vh',
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                gap: 3,
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Image
                    src="https://testing.indiantadka.eu/assets/fast-food-map-pin-lottie-animation-fold-1.gif"
                    alt="Add address"
                    width={180}
                    height={180}
                />
            </motion.div>

            <Box
                display="flex"
                alignItems="center"
                gap={1}
                textAlign="center"
                maxWidth="300px"
            >
                <AddLocationAltOutlinedIcon color="primary" />
                <Typography variant="body1" fontWeight={600}>
                    Oops! We don&apos;t have your address yet. Can you add it?
                </Typography>
            </Box>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleAdddressDetailOpen(true)}
                    sx={{
                        background: theme.palette.success.main,
                        color: '#fff',
                        borderRadius: '8px',
                        px: 4,
                        // py: 1.5,
                        textTransform: 'none',
                        '&:hover': {
                            background: theme.palette.success.dark,
                        },
                    }}
                >
                    Add Address To Proceed
                </Button>
            </motion.div>

            <AddressForm
                isAddressModelOpen={isAddressModelOpen}
                customerDetails={customerDetails ?? {} as CustomerDetails}
                customerOrder={customerOrder ?? {} as CustomerOrder}
                formError={formError}
                setFormError={setFormError}
                handleAdddressDetailClose={handleAdddressDetailClose}
                handleUpdateCustomerDetails={handleUpdateCustomerDetails}
            />
        </Box>
    );
};

export default AddUserAddress;
