import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ResponsiveWrapper from "@/components/ClientComponents/ResponsiveLayoutWrapper";
import { StoreProvider } from "@/components/StoreProvider";
import { SessionProvider } from "@/components/ClientComponents/SessionProvider";
import Script from "next/script";
import MobileViewDetector from "@/components/ClientComponents/mobileView/MobileViewDetector";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider >
      <html lang="en" >
        <head>
          {/* <script
            id="usercentrics-cmp"
            src="https://web.cmp.usercentrics.eu/ui/loader.js"
            data-settings-id="367RVaF9HFZbR9"
            async
          ></script> */}

          <Script
            src="https://pay.google.com/gp/p/js/pay.js"
            strategy="beforeInteractive"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased w-[100%] px-2 mx-auto bg-white min-h-screen shadow-md`}
        >
          <Toaster position="top-right" reverseOrder={false} />
          <SessionProvider />
          <MobileViewDetector />
          <ResponsiveWrapper>
            {children}
          </ResponsiveWrapper>
        </body>
      </html>
    </StoreProvider>

  );
}
