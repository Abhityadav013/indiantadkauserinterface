'use client';

import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { handleBasketState } from '@/store/slices/basketSlice';

interface BasketDrawerProps {
  children: React.ReactNode;
}

const BasketDrawer = ({ children }: BasketDrawerProps) => {
  const isBasketOpen = useSelector((state: RootState) => state.basket.isBasketOpen);
  const dispatch=  useDispatch();
  const handleBasketToggle = () => {
    dispatch(handleBasketState(false))
  }
  return (
    <>
      <Drawer
        anchor="bottom"
        open={isBasketOpen}
        onClose={handleBasketToggle}
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
            onClick={handleBasketToggle}
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
