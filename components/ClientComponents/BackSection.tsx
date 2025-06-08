'use client'
import React from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";

const BackSection = () => {
  const router = useRouter();

  return (
    <IconButton
      aria-label="Go back"
      onClick={() => router.back()}
      sx={{ color: "black" }}
    >
      <ArrowBackIcon fontSize="small" />
    </IconButton>
  );
};

export default BackSection;
