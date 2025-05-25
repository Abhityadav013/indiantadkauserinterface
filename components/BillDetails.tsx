import React from 'react'
import { Box, Typography, IconButton } from "@mui/material";
import ReceiptIcon from '@mui/icons-material/Receipt';
import BillDetailWrapper from './ClientComponents/BillDetailWrapper';
import { CustomerDetails } from '@/lib/types/customer_order_type';

interface BillDetailProps {
    getCartTotal: () => number,
    customerDetails: CustomerDetails,
    handleAdddressDetailOpen: () => void
}

const BillDetails = ({
    getCartTotal,
    customerDetails,
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
        </Box>
    );
};

export default BillDetails;
