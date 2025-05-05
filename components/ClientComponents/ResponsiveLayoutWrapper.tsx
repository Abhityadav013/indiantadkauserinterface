"use client";

import { useState } from "react";
import VideoLoader from "./VideoLoader";
import { useBreakpointChange } from "@/hooks/useBreakpointChange";

const ResponsiveWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showLoader, setShowLoader] = useState(false);

  useBreakpointChange(() => {
    setShowLoader(true);
    setTimeout(() => setShowLoader(false), 2000);
  });

  return (
    <>
      <VideoLoader show={showLoader} />
      {children}
    </>
  );
};

export default ResponsiveWrapper;
