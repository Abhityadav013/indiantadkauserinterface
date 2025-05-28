import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { StoreProvider } from "@/components/StoreProvider";
import { SessionProvider } from "@/components/ClientComponents/SessionProvider";
import MobileViewDetector from "@/components/ClientComponents/mobileView/MobileViewDetector";
import { notFound } from "next/navigation";
// import { getMessages } from "next-intl/server";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { locales } from "@/config";
import { setRequestLocale } from "next-intl/server";
import LanguageSwitcher from "@/components/ClientComponents/LanguageSwitcher";
import { Box } from "@mui/material";
import NavBarWrapper from "@/components/NavbarWrapper";
// import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const outfit = Outfit({
  variable: "--font-outfit", // Custom CSS variable
  subsets: ["latin"], // Load only Latin subset
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify required weights
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IndianTadka",
  description: "A Place for Complete Indian Cusinie",
};

export function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'en' }];
}


export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await params;
  if (!hasLocale(locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
  return (
    <StoreProvider >
      <html lang={locale}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased w-[100%] mx-auto bg-white min-h-screen shadow-md relative`}
        >
          <NextIntlClientProvider locale={locale}>
            <Box className="fixed flex justify-end z-[1201] items-center right-0 top-2">
              <LanguageSwitcher />
            </Box>

            <Toaster position="top-right" reverseOrder={false} />
            <SessionProvider />
            <NavBarWrapper />
            <MobileViewDetector />
            <main
              style={{
                paddingTop: '50px', // 100px navbar height + 30px margin
              }}
            >{children}</main>

          </NextIntlClientProvider>
        </body>
      </html>
    </StoreProvider>

  );
}
