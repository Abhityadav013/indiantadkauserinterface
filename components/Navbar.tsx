'use client';
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
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useDispatch } from 'react-redux';
import { startNavigation } from '@/store/slices/navigationSlice';

interface FieldError {
  key: string;
  message: string;
}

export type ErrorResponse = FieldError[];

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
    const dispatch = useDispatch(); // ✅ Redux dispatch hook
  const t = useTranslations("navbar");
  const navLinks = [
    { label: t('menu'), href: '/digital-menu' },
    { label: t('about'), href: '/about-us' },
    { label: t('offer'), href: '/offers' },
    { label: t('contact_us'), href: '/contact-us' },
    { label: t('reservation'), href: '/reservation' }
  ];

  const handleLinkClick = (href: string) => {
    dispatch(startNavigation(href))
    setDrawerOpen(false); // Close the drawer when a link is clicked
  };
  const handleDesktopLinkClick = (href:string) =>{
    dispatch(startNavigation(href))
  }

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center justify-center space-x-6 w-full">
        {navLinks.map(({ label, href }) => (
          <Button
            key={href}
            component={Link}
            href={href}
            onClick={() =>handleDesktopLinkClick(href)} // Close the drawer on link click
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
      <Box className="relative flex items-center ml-4 md:ml-2" sx={{
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
              onClick={() =>handleLinkClick(href)} // Close the drawer on link click
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
