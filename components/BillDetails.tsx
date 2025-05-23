import React from 'react'
import { Box, Typography, IconButton } from "@mui/material";
import ReceiptIcon from '@mui/icons-material/Receipt';
import BillDetailWrapper from './ClientComponents/BillDetailWrapper';
import AddressForm from './ClientComponents/AddressForm';
import { CustomerDetails, CustomerOrder } from '@/lib/types/customer_order_type';
import { ErrorResponse } from '@/lib/types/error_type';
interface BillDetailProps {
    getCartTotal: () => number,
    isAddressModelOpen: boolean
    customerOrder: CustomerOrder,
    customerDetails: CustomerDetails,
    formError: ErrorResponse,
    setFormError: React.Dispatch<React.SetStateAction<ErrorResponse>>,
    handleAdddressDetailClose: () => void,
    handleUpdateCustomerDetails: (value: CustomerOrder) => void,
    handleAdddressDetailOpen: (value: boolean) => void
}



const BillDetails = ({
    getCartTotal,
    isAddressModelOpen,
    customerOrder,
    customerDetails,
    formError,
    setFormError,
    handleAdddressDetailClose,
    handleUpdateCustomerDetails,
    handleAdddressDetailOpen

}: BillDetailProps) => {
    return (
        <>
            <Box
                sx={{
                    minWidth: { xs: '92vw', sm: '90vw', lg: '28vw' },
                    maxWidth: { xs: '92vw', sm: '90vw', lg: '28vw' },
                    borderRadius: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt:0,
                }}>
                <Box
                    sx={{
                        display: 'flex',              // Use Flexbox layout
                        justifyContent: 'center',     // Center horizontally
                        alignItems: 'center',         // Center vertically (if needed)
                        gap: 2,                       // Adds space between the items
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 300, display: 'flex', alignItems: 'center' }}>
                        {/* Receipt Icon */}
                        <IconButton>
                            <ReceiptIcon fontSize="medium" className="text-gray-700" />
                        </IconButton>

                        {/* Text */}
                        Bill Details
                    </Typography>
                </Box>

            </Box>
            <BillDetailWrapper
                customerDetails={customerDetails ?? {} as CustomerDetails}
                getCartTotal={getCartTotal}
                handleAddressModalOpen={handleAdddressDetailOpen}
            />
            <AddressForm
                isAddressModelOpen={isAddressModelOpen}
                customerDetails={customerDetails ?? {} as CustomerDetails}
                customerOrder={customerOrder ?? {} as CustomerOrder}
                formError={formError}
                setFormError={setFormError}
                handleAdddressDetailClose={handleAdddressDetailClose}
                handleUpdateCustomerDetails={handleUpdateCustomerDetails}
            />
        </>
    )
}

export default BillDetails
