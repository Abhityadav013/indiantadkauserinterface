'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  Button,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/reducers';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

interface FieldError {
  key: string;
  message: string;
}

export type ErrorResponse = FieldError[];

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const navLinks = [
    { label: 'Menu', href: '/digital-menu' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Offer', href: '/offers' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Reservation', href: '/reservation' }
  ];

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLinkClick = () => {
    setDrawerOpen(false); // Close the drawer when a link is clicked
  };

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center justify-center space-x-6 w-full">
        {navLinks.map(({ label, href }) => (
          <Button
            key={href}
            component={Link}
            href={href}
            disableRipple
            sx={{
              color: "#FF6347",
              backgroundColor: "transparent",
              textTransform: "none",
              fontFamily: "var(--font-outfit)",
              fontSize: '16px',
              top: '20px',
              marginBottom: '5px',
              "&:hover": {
                backgroundColor: "transparent",
                transform: "translateY(-2px) scale(1.05)",
                transition: "all 0.3s ease"
              }
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Cart Icon + Hamburger for Mobile */}
      <Box className="relative flex items-center ml-4 mr-[10%] md:ml-2" sx={{
        top: '20px',
        marginBottom: '5px',
      }}>
        <Link href="/checkout" className="flex items-center">
          <Image
            src="https://testing.indiantadka.eu/assets/basket_icon.png"
            alt="Cart Icon"
            width={100}
            height={100}
            className="dark:invert w-[20px] sm:w-[28px] md:w-[36px] lg:w-[44px]"
          />
          {isClient && (
            <div
              className="absolute top-0 right-10 sm:right-7 bg-tomato text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-semibold
    sm:w-5 sm:h-5 sm:text-[8px] md:w-4 md:h-4 md:text-xs" // Adjusted for mobile and tablet screens
            >
              {5}
            </div>
          )}
        </Link>

        {/* Hamburger icon only on mobile */}
        <div className="md:hidden ml-4">
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon sx={{ color: '#FF6347' }} />
          </IconButton>
        </div>
      </Box>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            bgcolor: '#fff',
            padding: 2
          }
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map(({ label, href }) => (
            <ListItem
              key={href}
              component={Link}
              href={href}
              onClick={handleLinkClick} // Close the drawer on link click
            >
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: '1.2rem',
                  color: '#FF6347',
                  fontFamily: 'var(--font-outfit)'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
