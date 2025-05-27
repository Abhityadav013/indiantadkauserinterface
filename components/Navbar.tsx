'use client';
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

  const navLinks = [
    { label: 'Menu', href: '/digital-menu' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Offer', href: '/offers' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Reservation', href: '/reservation' }
  ];

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
