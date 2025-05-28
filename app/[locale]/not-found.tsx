// app/not-found.tsx
"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Box className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-white">
      <div className="relative w-full max-w-md h-64 mb-8">
        <Image
          src="https://testing.indiantadka.eu/assets/wrongPage.gif" // your custom image
          alt="404 - Not Found"
          layout="fill"
          objectFit="contain"
        />
      </div>

      <Typography
        variant="h4"
        className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-4"
      >
        Oops! We believe you&apos;re on the wrong page.
      </Typography>

      <Typography variant="body1" className="text-gray-600 mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        className="bg-tomato text-white px-6 py-2 rounded-md"
        onClick={() => router.push("/")}
      >
        Go Home
      </Button>
    </Box>
  );
};