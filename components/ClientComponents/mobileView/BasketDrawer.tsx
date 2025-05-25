'use client';

import React, { useState } from 'react';
import ViewCartFooter from '@/components/ViewCartFooter';
import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton } from '@mui/material';

interface BasketDrawerProps {
  cartItemCount: number;
  children: React.ReactNode;
}

const BasketDrawer = ({ cartItemCount, children }: BasketDrawerProps) => {
  const [mobileBasketOpen, setMobileBasketOpen] = useState(false);

  return (
    <>
      <ViewCartFooter setBasektOpen={setMobileBasketOpen} itmesCount={cartItemCount} />
      <Drawer
        anchor="bottom"
        open={mobileBasketOpen}
        onClose={() => setMobileBasketOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            maxWidth: "500px",
            height: "100%",
            //  padding: isMobile ? "16px" : "32px", // Adjust padding based on screen size
            // borderRadius: isMobile ? "20px" : "30px", // Add rounded corners on mobile
          },
        }}
      >
        <div className="w-full p-6 relative">
          {/* Close button */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMobileBasketOpen(false)}
            sx={{ position: "absolute", top: 20, right: 20 }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        {children}
      </Drawer>

    </>
  );
};

export default BasketDrawer;
