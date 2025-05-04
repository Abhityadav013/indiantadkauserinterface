"use server"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Card, CardContent } from "@mui/material"
import { Tag, Gift, Utensils } from "lucide-react"
import OffersSectionArrows from "./OffersSectionArrows"

export default async function OffersSection() {
  const offers = [
    {
      title: "10% Off First Order",
      description: "Use code WELCOME10 when placing your first order online or mention it when dining in.",
      icon: Tag,
    },
    {
      title: "Weekend Brunch Special",
      description: "Enjoy our special weekend brunch buffet with complimentary masala chai.",
      icon: Utensils,
    },
    {
      title: "Birthday Celebration",
      description: "Celebrate your birthday with us and get a complimentary dessert platter.",
      icon: Gift,
    },

  ]

  return (
    <section className="bg-[#FFF5E1] py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#FF6347] sm:text-4xl">Special Offers & Events</h2>

        <Carousel className="mx-auto max-w-5xl">
          <CarouselContent>
            {offers.map((offer, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 h-full"
              >
                <Card className="min-h-[320px] h-full flex flex-col justify-between border-2 border-[#F2A93B]/20 bg-white shadow-md">
                  <CardContent className="flex flex-col items-center p-6 text-center flex-grow">
                    <offer.icon className="mb-4 h-12 w-12 text-[#F2A93B]" />
                    <h3 className="mb-2 text-xl font-bold text-[#FF6347]">{offer.title}</h3>
                    <p className="text-gray-700">{offer.description}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <OffersSectionArrows offersCount={offers.length} />
        </Carousel>
      </div>
    </section>
  )
}
