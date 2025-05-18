import Image from "next/image";
import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import Link from "next/link";
import NavBar from "./Navbar";

const NavBarWrapper = () => {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        left:0,
        marginInline:'auto',
        width:"100%",
        px:2,
      //  width:{ xs: "100%", sm: "100%", md: "60%", lg: "60%"},
        backgroundColor: "white",
        boxShadow: "none",
        height: "100px", // Increase height by 10px (default height is around 60px)
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Link href="/">
          <Image
            src="https://testing.indiantadka.eu/assets/IndianTadkaHomeLogo.gif"
            alt="Logo"
            width={100}
            height={100}
          />
        </Link>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* NavBar handles its own responsive rendering */}
        <NavBar />
      </Toolbar>
    </AppBar>
  );
};

export default NavBarWrapper;
;