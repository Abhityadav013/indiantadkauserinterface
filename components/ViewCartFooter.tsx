import React from "react";
import { Box, Typography } from "@mui/material";
import CartNavigate from "./ClientComponents/CartNavigate";

interface ViewCartProps {
    itmesCount: number;
}

const ViewCartFooter: React.FC<ViewCartProps> = ({ itmesCount }) => {
    return (
        <Box
            className="fixed left-1/2 bottom-0 transform -translate-x-1/2 bg-green-600 text-white p-4 flex justify-between items-center shadow-lg z-50"
            sx={{
                width: { xs: '100%', sm: '100%', md: '100%', lg: '60%' },
                height: 'auto',
                padding: { sm: '8px', lg: '16px' },
                gap: { sm: '8px', lg: '0' }
            }}
        >
            <Typography variant="body1" className="ml-4 font-semibold">
                {itmesCount} item{itmesCount > 1 ? "s" : ""} added
            </Typography>
            <CartNavigate />
        </Box>
    );
};

export default ViewCartFooter;
