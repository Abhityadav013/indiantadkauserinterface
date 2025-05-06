import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ResponsiveWrapper from "@/components/ClientComponents/ResponsiveLayoutWrapper";
import { StoreProvider } from "@/components/StoreProvider";
import { SessionProvider } from "@/components/ClientComponents/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
        {/* <head>
        <script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id="367RVaF9HFZbR9"
          async
        ></script>
      </head> */}
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased w-[100%] md:w-[60%] sm:w-[100%] mx-auto bg-white min-h-screen shadow-md`}
        >
            <Toaster position="top-right" reverseOrder={false} />
            <SessionProvider />
            <ResponsiveWrapper>
              {children}
            </ResponsiveWrapper>
        </body>
      </html>
    </StoreProvider>

  );
}
