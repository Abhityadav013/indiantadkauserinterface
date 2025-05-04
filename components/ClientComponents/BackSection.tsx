'use client'
import React from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";

const BackSection = () => {
  const router = useRouter();

  const onBack = () => {
    router.push('/');
  };

  return (
    <IconButton
      edge="start"
      color="default"
      onClick={onBack}
      sx={{ position: "fixed", top: 14, left: 20 }}
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackSection;
