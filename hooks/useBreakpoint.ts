'use client';
import { useEffect, useState } from "react";

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState("base");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1024) setBreakpoint("lg");
      else if (width >= 768) setBreakpoint("md");
      else setBreakpoint("base");
    };

    updateBreakpoint(); // initial
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}
