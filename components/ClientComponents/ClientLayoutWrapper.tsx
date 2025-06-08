// components/ClientComponents/ClientLayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import NavBarWrapper from "@/components/NavbarWrapper";
import LanguageSwitcher from "@/components/ClientComponents/LanguageSwitcher";
import { Box } from "@mui/material";

const HIDE_NAVBAR_SUFFIXES  = ["/menu-list", "/checkout"]; // List routes where you want the navbar and switcher

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  // Get the path **after** the locale
    const pathname = usePathname(); // example: /de/checkout or /en/menu
  const segments = pathname.split("/").filter(Boolean); // ["de", "checkout"]
  const pathSuffix = segments.slice(1).join("/") || ""; // "checkout" or ""

  const shouldShowNav = !HIDE_NAVBAR_SUFFIXES.includes(`/${pathSuffix}`);

  return (
    <>
      {shouldShowNav && (
        <>
          <Box className="fixed flex justify-end z-[1201] items-center right-0 top-2">
            <LanguageSwitcher />
          </Box>
          <NavBarWrapper />
        </>
      )}
      {children}
    </>
  );
}
