import { Star, StarHalf } from "lucide-react"
import { Card, CardContent } from '@mui/material'
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import OffersSectionArrows from "./OffersSectionArrows"
export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      rating: 5,
      text: "The best Indian food I've had outside of India! The butter chicken and garlic naan are absolutely divine. The ambiance is perfect for both family dinners and date nights.",
    },
    {
      name: "Michael Johnson",
      rating: 4.5,
      text: "Indian Tadka has become our go-to place for celebrating special occasions. The service is impeccable, and the food is consistently excellent. Their biryani is a must-try!",
    },
    {
      name: "Aisha Patel",
      rating: 5,
      text: "As someone who grew up with authentic Indian cooking, I'm incredibly impressed by Indian Tadka. They've managed to capture the true essence of Indian flavors while adding their unique touch.",
    },
    {
      name: "Aisha Patel",
      rating: 5,
      text: "As someone who grew up with authentic Indian cooking, I'm incredibly impressed by Indian Tadka. They've managed to capture the true essence of Indian flavors while adding their unique touch.",
    },
    {
      name: "Aisha Patel",
      rating: 5,
      text: "As someone who grew up with authentic Indian cooking, I'm incredibly impressed by Indian Tadka. They've managed to capture the true essence of Indian flavors while adding their unique touch.",
    },
     {
      name: "Aisha Patel",
      rating: 5,
      text: "As someone who grew up with authentic Indian cooking, I'm incredibly impressed by Indian Tadka. They've managed to capture the true essence of Indian flavors while adding their unique touch.",
    },
     {
      name: "Aisha Patel",
      rating: 5,
      text: "As someone who grew up with authentic Indian cooking, I'm incredibly impressed by Indian Tadka. They've managed to capture the true essence of Indian flavors while adding their unique touch.",
    },
     {
      name: "Aisha Patel",
      rating: 5,
      text: "As someone who grew up with authentic Indian cooking, I'm incredibly impressed by Indian Tadka. They've managed to capture the true essence of Indian flavors while adding their unique touch.",
    },
     {
      name: "Aisha Patel",
      rating: 5,
      text: "As someone who grew up with authentic Indian cooking, I'm incredibly impressed by Indian Tadka. They've managed to capture the true essence of Indian flavors while adding their unique touch.",
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