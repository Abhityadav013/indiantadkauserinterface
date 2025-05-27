import { Suspense } from "react"
import { Container, Typography, Box } from "@mui/material"
import HeroSlider from "@/components/offersComponents/hero-slider"
// import SeasonalOffers from "@/components/offersComponents/seasonal-offers"
import CouponList from "@/components/offersComponents/coupon-list"
import ComboGrid from "@/components/offersComponents/combo-grid"
import CallToAction from "@/components/offersComponents/call-to-action"

// Mock data - in real app, this would come from API/database
const offersData = {
  heroSlides: [
    {
      id: 1,
      title: "25% Off All Curries",
      subtitle: "Valid until Sunday",
      image: "/placeholder.svg?height=400&width=800",
      bgColor: "from-orange-500 to-red-600",
    },
    {
      id: 2,
      title: "Weekend Thali Special",
      subtitle: "Complete meal for €15.99",
      image: "/placeholder.svg?height=400&width=800",
      bgColor: "from-green-500 to-emerald-600",
    },
    {
      id: 3,
      title: "Free Dessert with Mains",
      subtitle: "Order any main course",
      image: "/placeholder.svg?height=400&width=800",
      bgColor: "from-purple-500 to-pink-600",
    },
  ],
  coupons: [
    {
      id: 1,
      code: "CURRY25",
      description: "25% off all curry dishes",
      expiryDate: "2024-12-31",
      discount: "25%",
      minOrder: "€20",
    },
    {
      id: 2,
      code: "FAMILY30",
      description: "30% off family meals (4+ people)",
      expiryDate: "2024-12-25",
      discount: "30%",
      minOrder: "€50",
    },
    {
      id: 3,
      code: "LUNCH15",
      description: "15% off lunch orders (11 AM - 3 PM)",
      expiryDate: "2024-12-20",
      discount: "15%",
      minOrder: "€15",
    },
    {
      id: 4,
      code: "NEWBIE20",
      description: "20% off for first-time customers",
      expiryDate: "2024-12-30",
      discount: "20%",
      minOrder: "€25",
    },
  ],
  combos: [
    {
      id: 1,
      name: "Family Feast",
      description: "2 Curries, Rice, Naan, Dessert for 4 people",
      price: "€45.99",
      originalPrice: "€55.99",
      image: "/placeholder.svg?height=300&width=400",
      popular: true,
    },
    {
      id: 2,
      name: "Lunch Thali + Drink",
      description: "Complete thali with curry, rice, naan, and lassi",
      price: "€12.99",
      originalPrice: "€16.99",
      image: "/placeholder.svg?height=300&width=400",
      popular: false,
    },
    {
      id: 3,
      name: "Tandoori Platter",
      description: "Mixed tandoori with chicken, lamb, and vegetables",
      price: "€28.99",
      originalPrice: "€35.99",
      image: "/placeholder.svg?height=300&width=400",
      popular: true,
    },
    {
      id: 4,
      name: "Vegetarian Delight",
      description: "3 veg curries, dal, rice, naan, and raita",
      price: "€22.99",
      originalPrice: "€28.99",
      image: "/placeholder.svg?height=300&width=400",
      popular: false,
    },
  ],
  seasonalOffer: {
    title: "Christmas Special Menu",
    description: "Limited time festive menu with traditional Indian Christmas dishes",
    endDate: "2024-12-25T23:59:59",
    discount: "20%",
  },
}

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <Suspense fallback={<div className="h-96 bg-gray-200 animate-pulse" />}>
        <HeroSlider slides={offersData.heroSlides} />
      </Suspense>

      {/* Page Title */}
      <Container maxWidth="lg" className="py-8">
        <Box className="text-center mb-8">
          <Typography
            variant="h2"
            component="h1"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Special Offers & Deals
          </Typography>
          <Typography variant="h6" className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing deals and save on your favorite authentic Indian dishes
          </Typography>
        </Box>
      </Container>

      {/* Seasonal Offers */}
      {/* <Suspense fallback={<div className="h-32 bg-gray-200 animate-pulse mx-4 rounded-lg" />}>
        <SeasonalOffers offer={offersData.seasonalOffer} />
      </Suspense> */}

      {/* Available Coupons */}
      <Container maxWidth="lg" className="py-12">
        <Typography
          variant="h3"
          component="h2"
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Available Coupons
        </Typography>
        <CouponList coupons={offersData.coupons} />
      </Container>

      {/* Combo Offers */}
      <Container maxWidth="lg" className="py-12">
        <Typography
          variant="h3"
          component="h2"
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Combo Offers
        </Typography>
        <ComboGrid combos={offersData.combos} />
      </Container>

      {/* Call to Action */}
      <CallToAction />
    </main>
  )
}
