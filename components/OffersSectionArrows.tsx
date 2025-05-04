'use client'

import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useBreakpoint } from "@/hooks/useBreakpoint"; // adjust path

interface OfferSectionProps {
  offersCount: number;
}
const OffersSectionArrows:React.FC<OfferSectionProps> = ({offersCount}) => {

  const breakpoint = useBreakpoint();
  const itemsPerSlide = breakpoint === "lg" ? 3 : breakpoint === "md" ? 2 : 1;
  const showArrows = offersCount > itemsPerSlide;

  if (showArrows) {
    return (
      <>
        <CarouselPrevious className="left-0 bg-white text-[#FF6347]" />
        <CarouselNext className="right-0 bg-white text-[#FF6347]" />
      </>
    );
  }

  return null;
}

export default OffersSectionArrows;
