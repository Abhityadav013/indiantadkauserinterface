'use client';
import { Box, Button, Divider, Typography, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { OrderType } from '@/lib/types/order_type';
import { CustomerDetails } from '@/lib/types/customer_order_type';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import InfoIcon from '@mui/icons-material/Info';
import DeliveryFeeDialog from '../DeliveryFeeDialog';
import ServiceFeeDilaog from '../ServiceFeeDilaog';
import { formatPrice } from '@/utils/valueInEuros';
import { useRouter } from 'next/navigation';

interface BillDetailWrapperProps {
    isDeliveryOrder: boolean;
    customerDetails: CustomerDetails;
    getCartTotal: () => number;
    handleAddressModalOpen: (value: boolean) => void;
}

const BillDetailWrapper = ({
    isDeliveryOrder,
    customerDetails,
    getCartTotal,
    handleAddressModalOpen
}: BillDetailWrapperProps) => {
    const [loading, setLoading] = useState(true);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [cartAmountTotal, setCartAmountTotal] = useState<number>();
    const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
    const [serviceFeeDialogOpen, setServiceFeeDialogOpen] = useState(false); // State to control dialog visibility
    const order_type = useSelector((state: RootState) => state.order.orderType);
    const router = useRouter()

    useEffect(() => {
        const deliveryFee = sessionStorage.getItem('deliveryFee');
        setDeliveryFee(deliveryFee ? Number(deliveryFee) : 0);
    }, []);

    // Update cart total in session storage, and set loading timeout
    useEffect(() => {
        const cartTotal = getCartTotal();
        if (cartTotal) {
            const total = ((cartTotal ?? 0) + deliveryFee).toFixed(2);
            sessionStorage.setItem('cartTotalAmount', total);
            setCartAmountTotal(Number(total));
            setLoading(false);
        }
    }, [getCartTotal, deliveryFee]);

    const renderPriceOrLoader = (value: string | number) => {
        if (loading) return <span>Loading...</span>;  // Or any other fallback content while loading
        if (value === 0) {
            return <span>Free</span>
        } else {
            return <span>{formatPrice(Number(value))}</span>
        }
    }

    const renderServiceFee = (value: string | number) => {
        if (loading) return <span>Loading...</span>;  // Or any other fallback content while loading

        const serviceFee = (Number(value) * 2.5) / 100;
        if (serviceFee < 0.99) {
            return <span>{formatPrice(Number(serviceFee.toFixed(2)))}</span>;  // Ensure we are returning the fee with the € symbol
        }

        return <span>€0,99</span>;  // Return the capped fee with the € symbol
    };


    // Function to handle opening the dialog
    const handleDialogOpen = () => setDialogOpen(true);

    const handleServiceFeeDialogOpen = () => setServiceFeeDialogOpen(true);

    // Calculate the total (cartTotal + deliveryFee + serviceFee)
    const calculateTotal = () => {
        const serviceFee = (cartAmountTotal ? (cartAmountTotal * 2.5) / 100 : 0);
        const cappedServiceFee = serviceFee < 0.99 ? serviceFee : 0.99;

        return formatPrice((cartAmountTotal ?? 0) + deliveryFee + cappedServiceFee);
    };

    return (
        <>
            <Box className="mt-2 text-gray-700">
                <Typography variant="body2" className="flex justify-between py-[2px]">
                    Item Total
                    {renderPriceOrLoader(cartAmountTotal?.toFixed(2) || '0.00')}
                </Typography>
                <div>
                    {/* Delivery Fee Section */}
                    {isDeliveryOrder && (
                        <>
                            <Typography variant="body2" className="flex justify-between">
                                <span>
                                    Delivery Fee
                                    <IconButton onClick={handleDialogOpen} sx={{ paddingLeft: '5px' }}>
                                        <InfoIcon sx={{ fontSize: 12 }} /> {/* You can adjust the font size here */}
                                    </IconButton>
                                </span>

                                {renderPriceOrLoader(deliveryFee)}

                            </Typography>
                            <Typography variant="body2" className="flex justify-between">
                                <span>
                                    Service fee 2.5% (max 0.99 €)
                                    <IconButton onClick={handleServiceFeeDialogOpen} sx={{ paddingLeft: '5px' }}>
                                        <InfoIcon sx={{ fontSize: 12 }} /> {/* You can adjust the font size here */}
                                    </IconButton>
                                </span>

                                {renderServiceFee(cartAmountTotal?.toFixed(2) || '0.00')}

                            </Typography>
                        </>
                    )}
                    <Divider sx={{ backgroundColor: '#E0E0E0', my: 1 }} />
                    {/* To Pay Section */}
                    <Typography
                        variant="body1"
                        className={`flex justify-between font-semibold ${!customerDetails ? 'blur-sm text-gray-400' : ''}`}
                    >
                        Total
                        <span>
                            {customerDetails
                                ? `€ ${calculateTotal()}`
                                : '0.00'}
                        </span>
                    </Typography>
                    {/* Show "Add address" button only if no customerDetails */}
                    {!customerDetails && (
                        <Box className="flex flex-col items-center text-center space-y-1">
                            <Typography variant="h6" color="textSecondary">
                                {order_type === OrderType.DELIVERY
                                    ? '🔓 Complete your details to unlock delivery & total'
                                    : '🔓 Let us know who’s picking this up'}
                            </Typography>
                            <Button
                                size="medium"
                                variant="contained"
                                onClick={() => handleAddressModalOpen(true)}
                                sx={{ background: '#FF6347', color: 'white' }}
                            >
                                Add Details
                            </Button>
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: 'flex',             // Enable flexbox layout
                            justifyContent: 'center',    // Center horizontally
                            alignItems: 'center',        // Center vertically
                            position: 'absolute',        // Position it inside the parent container
                            bottom: '20px',              // Space from the bottom of the parent container (adjust as needed)
                            left: '50%',                 // Center horizontally with respect to the parent container
                            transform: 'translateX(-50%)', // Offset by 50% of its width to truly center it
                            width: '80%',               // Full width of the parent container
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => {router.push('/checkout')}}
                            sx={{
                                width: '100%',  // Button will fill the available width of the container
                                backgroundColor: '#f36805', // Orange background
                                color: 'white', // White text
                                padding: '12px 24px', // Some padding for the button
                                fontSize: '20px', // Font size for the button text
                                fontWeight: 'bold', // Make the text bold
                                borderRadius: '50px', // Rounded corners for a more curved button
                                textTransform: 'none', // Prevent text from becoming uppercase
                                '&:hover': {
                                    backgroundColor: '#f36805', // Darker orange on hover
                                },
                            }}
                        >
                            Checkout ({calculateTotal()}) {/* Display the total amount */}
                        </Button>
                    </Box>

                </div>
            </Box>

            {/* Dialog for Delivery Fee Details */}
            <DeliveryFeeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
            <ServiceFeeDilaog open={serviceFeeDialogOpen} onClose={() => setServiceFeeDialogOpen(false)} />
        </>
    );
};

export default BillDetailWrapper;
