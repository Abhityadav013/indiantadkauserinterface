'use client';

import React, { useRef, useEffect } from 'react';
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
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (isBasketOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
    return () => {
      if (!isBasketOpen && lastTriggerRef.current) {
        lastTriggerRef.current.focus();
      }
    };
  }, [isBasketOpen]);
  const handleBasketToggle = () => {
    dispatch(handleBasketState(false))
  }
  return (
    <>
      <Drawer
        anchor="bottom"
        open={isBasketOpen}
        onClose={handleBasketToggle}
        aria-modal="true"
        role="dialog"
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            maxWidth: "500px",
            height: "100%",
            //  padding: isMobile ? "16px" : "32px", // Adjust padding based on screen size
            // borderRadius: isMobile ? "20px" : "30px", // Add rounded corners on mobile
          },
        }}
        ModalProps={{
          keepMounted: true,
          disableEnforceFocus: false,
        }}
      >
        <div className="w-full top-0 p-3 relative">
          {/* Close button */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBasketToggle}
            sx={{ position: "absolute", top: 20, right: 20 }}
            ref={firstFocusableRef}
            aria-label="Close basket drawer"
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
