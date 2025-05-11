'use client';
import React, { useEffect } from 'react';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import { Box, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Person4Icon from '@mui/icons-material/Person4';
import { useAddressDetails } from '@/hooks/useAddressDetails';
import CustomerContactDetailsWrapper from './CustomerContactDetailsWrapper';
import AddressForm from './AddressForm';
import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';
import { useRouter } from 'next/navigation';
import ButtonAction from './ButtonAction';
const CustomerContactDetails = () => {
    const router = useRouter();
    const { loading, customerDetails, customerOrder, formError, isAddressModelOpen, setFormError, handleAdddressDetailOpen, handleAdddressDetailClose, handleUpdateCustomerDetails } = useAddressDetails();
    useEffect(() => {
        if (!loading && customerDetails) {
            if (customerDetails?.notDeliverable) {
                router.push('/delivery-error');
            }
            sessionStorage.setItem('orderType', customerOrder?.orderType ?? '')
            sessionStorage.setItem('deliveryFee', parseInt(customerDetails?.deliveryFee || '0', 10).toString())
            sessionStorage.setItem('freeDelivery', String(customerDetails?.isFreeDelivery || false))
        }
    }, [loading, customerDetails, customerOrder, router]);

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md">
            {
                !loading && customerDetails ? (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                <IconButton>
                                    <Person4Icon fontSize="medium" className="text-gray-700" />
                                </IconButton>
                                Customer Details
                            </Typography>
                            <IconButton size="small">
                                <EditIcon fontSize="small" onClick={() => handleAdddressDetailOpen(true)} />
                            </IconButton>
                        </Box>
                        <Box
                            sx={{
                                marginTop: '0.5rem',
                            }}
                        >
                            {customerOrder && (
                                <CustomerContactDetailsWrapper isLoading={loading} customerDetails={customerDetails} customerOrder={customerOrder} />
                            )}
                        </Box>
                    </>) :
                    (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '2.5rem' }}>
                                <AddLocationAltOutlinedIcon sx={{ color: 'grey.800' }} fontSize="medium" />
                                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'black' }}>
                                    Oops! Looks like we don’t have your address yet. Can you add it?
                                </Typography>
                            </Box>

                            <ButtonAction textToDisplay="Add Address To Proceed" handleButtonAction={handleAdddressDetailOpen} /></>
                    )
            }
            <AddressForm
                isAddressModelOpen={isAddressModelOpen}
                customerDetails={customerDetails ?? {} as CustomerDetails}
                customerOrder={customerOrder ?? {} as CustomerOrder}
                formError={formError}
                setFormError={setFormError}
                handleAdddressDetailClose={handleAdddressDetailClose}
                handleUpdateCustomerDetails={handleUpdateCustomerDetails}
            />
        </div>
    );
};

export default CustomerContactDetails;
