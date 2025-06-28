"use client";

import { usePathname } from "next/navigation";
import NavBarWrapper from "@/components/NavbarWrapper";
import LanguageSwitcher from "@/components/ClientComponents/LanguageSwitcher";
import { Box } from "@mui/material";

// Define route prefixes where you want to HIDE the navbar
const HIDE_NAVBAR_PREFIXES = ["/menu-list", "/checkout", "/payment","/order","/error-boundary-preview"];

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // e.g. /de/payment/pi_123
  const segments = pathname.split("/").filter(Boolean); // ["de", "payment", "pi_123"]
  const pathSuffix = "/" + segments.slice(1).join("/"); // "payment/pi_123"

  // Check if the current path starts with any of the prefixes
  const shouldShowNav = !HIDE_NAVBAR_PREFIXES.some(prefix => pathSuffix.startsWith(prefix));

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
