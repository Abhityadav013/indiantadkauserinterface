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
        <Box
            sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: '#fff', // optional for visibility
                boxShadow: '0 -2px 4px rgba(0,0,0,0.05)', // optional
                p: 2
            }}
        >
            <Box
                sx={{
                    minWidth: { xs: '92vw', sm: '90vw', lg: '28vw' },
                    maxWidth: { xs: '92vw', sm: '90vw', lg: '28vw' },
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 300, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton>
                        <ReceiptIcon fontSize="medium" className="text-gray-700" />
                    </IconButton>
                    Bill Details
                </Typography>
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
        </Box>
    );
};

export default BillDetails;
