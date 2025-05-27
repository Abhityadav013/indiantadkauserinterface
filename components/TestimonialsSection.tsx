import { Star, StarHalf } from "lucide-react"
import { Card, CardContent } from '@mui/material'
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import OffersSectionArrows from "./OffersSectionArrows"
export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Anna Schneider",
      rating: 5,
      text: "Ein absolut tolles Erlebnis! Das Butter Chicken war unglaublich cremig und lecker. Ich komme definitiv wieder.",
    },
    {
      name: "Lukas Weber",
      rating: 4.5,
      text: "Sehr freundliches Personal und authentische indische Küche. Besonders gut hat mir das Chicken Tikka geschmeckt.",
    },
    {
      name: "Sophie Neumann",
      rating: 5,
      text: "Die Gewürze, der Duft, das Ambiente – alles hat gestimmt. Das Naan war warm und perfekt gebacken.",
    },
    {
      name: "Jonas Müller",
      rating: 4,
      text: "Leckeres Essen und gute Portionen. Die Wartezeit war etwas lang, aber das Warten hat sich gelohnt.",
    },
    {
      name: "Marie Fischer",
      rating: 5,
      text: "Ich habe das vegetarische Thali probiert – einfach hervorragend! Eine tolle Vielfalt an Aromen.",
    },
    {
      name: "Niklas Hoffmann",
      rating: 4.5,
      text: "Ein schöner Ort für ein Abendessen zu zweit. Die Mango Lassi war herrlich erfrischend.",
    },
    {
      name: "Leonie Schuster",
      rating: 5,
      text: "Der beste indische Lieferservice, den ich bisher probiert habe. Heißes Essen, super Geschmack, alles top!",
    },
    {
      name: "Felix Braun",
      rating: 4,
      text: "Sehr gute Küche, aber etwas scharf für meinen Geschmack. Trotzdem ein tolles Erlebnis!",
    },
    {
      name: "Laura Krüger",
      rating: 5,
      text: "Wunderschön eingerichtetes Restaurant mit einem fantastischen Service. Ich fühlte mich wie in Indien!",
    },
  ]


  const renderRating = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-amber-500 text-amber-500" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-5 w-5 fill-amber-500 text-amber-500" />)
    }

    return stars
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-tomato-red sm:text-4xl">What Our Customers Say</h2>

        <Carousel className="mx-auto max-w-5xl">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 h-full"
              >
                <Card key={index} className="border-2 border-cream bg-cream/30 shadow-md">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4 flex">{renderRating(testimonial.rating)}</div>
                    <p className="mb-4 italic text-gray-700">{testimonial.text}</p>
                    <div className="mt-auto">
                      <p className="font-semibold text-tomato-red">— {testimonial.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <OffersSectionArrows offersCount={testimonials.length} />
        </Carousel>

      </div>
    </section>
  )
}