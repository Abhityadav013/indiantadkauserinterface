import { useEffect, useRef } from "react";

const getBreakpoint = (width: number) => {
  if (width < 640) return "sm";
  if (width < 768) return "md";
  if (width < 1024) return "lg";
  if (width < 1280) return "xl";
  return "2xl";
};

export const useBreakpointChange = (onChange: () => void) => {
  const prevBreakpoint = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const current = getBreakpoint(window.innerWidth);
      if (prevBreakpoint.current && current !== prevBreakpoint.current) {
        onChange();
      }
      prevBreakpoint.current = current;
    };

    // Set initial breakpoint
    prevBreakpoint.current = getBreakpoint(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onChange]);
};
