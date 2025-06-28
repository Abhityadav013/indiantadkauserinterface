"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material";
import { setMobileView } from "@/store/slices/mobileSlice";
import { useSafeMediaQuery } from "@/hooks/useSafeMediaQuery";

const MobileViewDetector: React.FC = () => {
  const theme = useTheme();
  const isMobile = useSafeMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMobileView(isMobile));
  }, [isMobile, dispatch]);

  return null;
};

export default MobileViewDetector;
