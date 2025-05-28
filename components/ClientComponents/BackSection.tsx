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
      sx={{ left: 20 ,pr:10}}
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackSection;
