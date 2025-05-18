import React from 'react'
import { Box, Typography, IconButton } from "@mui/material";
import ReceiptIcon from '@mui/icons-material/Receipt';
import BillDetailWrapper from './ClientComponents/BillDetailWrapper';
import { MenuItem } from '@/lib/types/menu_type';

interface BillDetailsProps {
    menu: MenuItem[];
}


const BillDetails = async ({ menu }: BillDetailsProps) => {

    return (
        <>
            <Box
                sx={{
                    minWidth: { xs: '92vw', sm: '90vw', lg: '28vw' },
                    maxWidth: { xs: '92vw', sm: '90vw', lg: '28vw' },
                    borderRadius: 0,
                    px: 2,
                }}>
                <Typography variant="h6" sx={{ fonWeight: 300 }}>
                    <IconButton>
                        <ReceiptIcon fontSize="medium" className="text-gray-700" />
                    </IconButton>
                    Bill Details
                </Typography>

                <BillDetailWrapper menu={menu} />
            </Box>
        </>
    )
}

export default BillDetails
