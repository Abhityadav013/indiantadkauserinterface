import React from 'react'
import { Box, Typography,  IconButton } from "@mui/material";
import ReceiptIcon from '@mui/icons-material/Receipt';
import BillDetailWrapper from './ClientComponents/BillDetailWrapper';
import { getMenuData } from '@/app/menu/page';


const BillDetails = async () => {
    const { menuItems } = await getMenuData();
    return (
        <>
            <Box className=" max-w-md mx-auto p-4 bg-white shadow-md">
                <Typography variant="h6" sx={{ fonWeight: 600 }}>
                    <IconButton>
                        <ReceiptIcon fontSize="medium" className="text-gray-700" />
                    </IconButton>
                    Bill Details
                </Typography>

              <BillDetailWrapper menu={menuItems}/>
            </Box>
        </>
    )
}

export default BillDetails
